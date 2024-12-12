import mongoose from 'mongoose'
  
// To make your own Schema, check the documentation Here:
// https://mongoosejs.com/docs/guide.html#definition
// You can also try a Schema Generator like this one:
// https://bender.sheridanc.on.ca/system-design/schema-generator 

const favArtWorkSchema = new mongoose.Schema({
    "object_id": { type: String },
    "object_name": { type: String },
    "object_url": { type: String },
    "object_artistName": { type: String },
    "object_year": { type: String },
    "object_department": { type: String }
}, { _id: false });

const schema = new mongoose.Schema({ 
    "nickname": {"type": "String", required: true},
    "emojis": {"type": "String", required: true},
    "fav_artworks": {
        type: [favArtWorkSchema],
        default: []
    }
}) 

const User = mongoose.model('users', schema);
  

export { User };