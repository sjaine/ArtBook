// This module defines a set of CRUD endpoints for Items
// NOTE: image file uploads are handled separately.

import {mongoReady} from '../server.js';

// Import the Item schema
import {User} from "../models/ItemModel.js"  

// Import Express so we can make API endpoints
import express from 'express' 
import mongoose from 'mongoose';

// active the express Router
const api = express.Router()   

// CREATE ITEM (ENDPOINT)
// this endpoint looks for JSON data in the body of the request and saves a new item to MongoDB
api.post('/user', async (req, res) => { 
  console.log()
  try{
    delete req.body._id // don't include the _id on a new item (Mongo will create it automatically)
    const user = await User.create(req.body)
    res.send(user) 
  }
  catch(err){
    res.status(500).send(err)
  }
})


// READ USERS (ENDPOINT)
api.get('/users', async (req, res) => {  
  try{
    // a empty filter means "find everything"
    let filter = {}   
    const users = await User.find(filter)
    res.send(users)
  }
  catch(err){
    res.status(500).send(err)
  } 
})


// READ SINGLE ITEM (ENDPOINT)  
api.get('/users/:id', mongoReady, async (req, res) => {  
  try{
    const filter = {_id: req.params.id}
    const item = await User.findOne(filter)  
    res.send(item)
  }
  catch(err){
    res.status(500).send(err)
  } 
}) 

// READ FAV ARTWORKS LIST (ENDPOINT)  
api.get('/users/:id/fav-artworks', mongoReady, async (req, res) => {  
  try {
    const { id } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid user ID' });
    }

    // Find the user by ID
    const user = await User.findById(id).select('fav_artworks'); // Only fetch fav_artworks field

    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    // Send the favorite artworks list
    res.send(user.fav_artworks);
  } catch (err) {
      console.error('Error fetching favorite artworks:', err);
      res.status(500).send({ message: 'Failed to fetch favorite artworks', error: err.message });
  }
}) 

// READ USERS EMOJIS's FAV ARTWORKS LIST
api.get('/users/emojis/:emoji/fav-artworks', mongoReady, async (req, res) => {  
  try {
      const { emoji } = req.params;

      // Find all users matching the given emoji
      const users = await User.find({ emojis: emoji }).select('fav_artworks');

      if (!users || users.length === 0) {
          return res.status(404).send({ message: 'No users found for the given emoji' });
      }

      // Combine all fav_artworks from the matched users
      const allFavArtworks = users.flatMap(user => user.fav_artworks);

      // Send the combined favorite artworks list
      res.send(allFavArtworks);
  } catch (err) {
      console.error('Error fetching favorite artworks by emoji:', err);
      res.status(500).send({ message: 'Failed to fetch favorite artworks', error: err.message });
  }
});

// Get the most saved emojis (ENDPOINT)
api.get('/users/aggregate/most-saved-emojis', mongoReady, async (req, res) => {
  try {
    const mostSavedEmojis = await User.aggregate([
      {
        $group: {
          _id: "$emojis", // Group by the 'emojis' field
          count: { $sum: 1 } // Count the number of occurrences
        }
      },
      {
        $sort: { count: -1 } // Sort by count in descending order
      },
      {
        $limit: 1 // Optional: Limit to top 10 most saved emojis
      }
    ]);

    res.send(mostSavedEmojis);
  } catch (err) {
    console.error('Error finding most saved emojis:', err);
    res.status(500).send({ message: 'Failed to find most saved emojis', error: err.message });
  }
});

// FIND USER BY NICKNAME (ENDPOINT)
api.post('/users/get-id', async (req, res) => {
  try {
    const { nickname } = req.body;
    const user = await User.findOne({ nickname }); 
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'Sorry, that username does not exist!' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// UPDATA (EDIT) USERS' FAV ARTWORKS
api.patch('/users/:id/fav-artworks', mongoReady, async (req, res) => {
  try {
    const { id } = req.params;
    const { object_id, object_name, object_url, object_artistName, object_year } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        id,
        {
            $addToSet: {
                fav_artworks: {
                    object_id,
                    object_name,
                    object_url,
                    object_artistName,
                    object_year,
                },
            },
        },
        { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedUser) {
        return res.status(404).send({ message: 'User not found' });
    }

    res.send(updatedUser);
} catch (err) {
    console.error('Error updating favorites:', err);
    res.status(500).send({ message: 'Failed to update favorites', error: err });
}
})

// DELETE FAVORITE
api.delete('/users/:id/fav-artworks/:objectId', mongoReady, async (req, res) => {
  try {
      const { id, objectId } = req.params;

      // Validate the user ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).send({ message: 'Invalid user ID' });
      }

      // Ensure objectId is treated as a string
      const updatedUser = await User.findByIdAndUpdate(
          id,
          {
              $pull: { fav_artworks: { object_id: String(objectId) } }, // Ensure object_id matches type
          },
          { new: true } // Return the updated document
      );

      if (!updatedUser) {
          return res.status(404).send({ message: 'User not found' });
      }

      return res.status(200).send({ 
          message: 'Artwork removed from favorites', 
          fav_artworks: updatedUser.fav_artworks 
      });
  } catch (err) {
      console.error('Error removing favorite artwork:', err);
      return res.status(500).send({ 
          message: 'Failed to remove favorite artwork', 
          error: err.message 
      });
  }
});

// Endpoint to check nickname availability
api.get('/check-nickname', async (req, res) => {
  try {
      const { nickname } = req.query;

      // Validate input
      if (!nickname) {
          return res.status(400).json({ error: 'Nickname is required' });
      }

      // Query the database for the nickname
      const existingNickname = await User.findOne({ nickname }); // Ensure field matches schema
      const isAvailable = !existingNickname;

      // Return availability status
      return res.json({ isAvailable });
  } catch (err) {
      console.error('Error checking nickname availability:', err);
      return res.status(500).json({ error: 'Failed to check nickname', message: err.message });
  }
});


// DELETE USER (ENDPOINT)
api.delete('/users/:id', mongoReady, async (req, res) => {
  try{
    const filter = {_id:req.params.id} 
    // remove item from database
    const user = await User.findOneAndDelete(filter)  
    res.send({status :"User deleted."})   
  }
  catch(err){  
    console.log(err)
    res.status(500).send(err) 
  }
})


export { api as crudEndpoints }

 