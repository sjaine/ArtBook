import { useState, useEffect, useCallback } from 'react';

function SavedCard({ userId, objectId, objectName, objectUrl, objectArtistName, objectYear, onClick }) {
    const [photo, setPhoto] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [favoriteArtworks, setFavoriteArtworks] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);

    // Fetch Favorite Artwork lists
    const fetchFavArtworks = async (userId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/fav-artworks`);
    
            if (!response.ok) {
                throw new Error('Failed to load favorite artworks');
            }
    
            const favArtworks = await response.json();

            // Update your state or display the data
            setFavoriteArtworks(favArtworks);
        } catch (error) {
            console.error('Error fetching favorite artworks:', error);
        }
    };

    // Fetch fav artworks
    // Call this function in a useEffect or on a button click
    useEffect(() => {
        if (userId) {
            fetchFavArtworks(userId);
        }
    }, [userId]);

    // Check does it already in the list
    const checkIsFavorite = useCallback(() => {
        const isFound = favoriteArtworks.some((item) => item.object_id === String(objectId));
    
        if (isFound) {
            console.log(`ID ${objectId} is exisitng in the array.`);
            setIsFavorite(true);
        } else {
            console.log(`ID ${objectId} isn't exisitng in the array.`);
            setIsFavorite(false);
        }
    }, [favoriteArtworks, objectId]);

    useEffect(() => {
        if (objectId && favoriteArtworks.length > 0) {
            checkIsFavorite();
        }
    }, [objectId, favoriteArtworks, checkIsFavorite]);
    

    useEffect(() => {
        console.log(`isFavorite updated: ${isFavorite}`);
    }, [isFavorite]);

    // Toggle, like / unlike
    const toggleFavoriteArtwork = async () => {
        if(isFavorite) {
            removeArtwork();
        } else {
            saveArtwork();
        }
    }

    // Remove the artwork from the list
    const removeArtwork = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/fav-artworks/${objectId}`, {
                method: 'DELETE', credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to remove artwork');
            } 
            
            console.log("Deleted Successfully");
            setIsFavorite(false);
            fetchFavArtworks(userId);
        } catch (error) {
            console.error('Error removing artwork:', error);
        }
    };

    // Save the artwork from the list
    const saveArtwork = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/fav-artworks`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    object_id: objectId,
                    object_name: objectName,
                    object_url: objectUrl,
                    object_artistName: objectArtistName || 'Unknown',
                    object_year: objectYear || 'Unknown',
                }),
                credentials: 'include',
            });
    
            if (!response.ok) {
                throw new Error('Failed to save artwork');
            }
    
            const updatedUser = await response.json();
            console.log('Artwork saved successfully:', updatedUser);
            setIsFavorite(true);
            fetchFavArtworks(userId);
        } catch (error) {
            console.error('Error saving artwork:', error);
        }
    };

    // Get Object Data to show the information
    useEffect(() => {
        setPhoto(objectUrl);
        setTitle(objectName);
        if (objectArtistName !== "") {
            setDescription(`${objectArtistName}, ${objectYear || "Unknown Year"}`);
        } else {
            // Display "Unknown" if the data does not exist
            setDescription(`Unknown, ${objectYear || "Unknown Year"}`);
        }
    }, [objectId, objectName, objectUrl, objectArtistName, objectYear]);

    // Slice text if it is too long
    const truncateText = (text, n) => {
        return text.length > n ? text.slice(0, n) + '…' : text;
    };

    return (
        <div className="savedBox" onClick={onClick}>
            <img 
                src={isFavorite ? '/img/heart-filled.svg' : '/img/heart.svg'}
                alt="button" 
                className="fav_button_card" 
                onClick={(e) => {
                    e.stopPropagation(); 
                    toggleFavoriteArtwork(); 
                }} 
            />
            <div><img src={photo} alt={title} className="saved_imgBox"></img></div>
            <div className="saved_infoBox">
                <div className="saved_title">{truncateText(title, 28)}</div>
                <div className="saved_description">{truncateText(description, 30)}</div>
            </div>
        </div>
    );
}

export default SavedCard;
