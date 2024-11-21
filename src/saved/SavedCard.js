import { useState, useEffect, useCallback } from 'react';

function SavedCard({ userId, objectId, objectName, objectUrl, objectArtistName, objectYear }) {
    const [photo, setPhoto] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [favoriteArtworks, setFavoriteArtworks] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);

    const fetchFavArtworks = async (userId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/fav-artworks`);
    
            if (!response.ok) {
                throw new Error('Failed to load favorite artworks');
            }
    
            const favArtworks = await response.json();
            console.log('Favorite Artworks:', favArtworks);

            // Update your state or display the data
            setFavoriteArtworks(favArtworks);
        } catch (error) {
            console.error('Error fetching favorite artworks:', error);
        }
    };

    // fetch fav artworks
    // Call this function in a useEffect or on a button click
    useEffect(() => {
        if (userId) {
            fetchFavArtworks(userId);
        }
    }, [userId]);

    const checkIsFavorite = useCallback(() => {
        console.log("favoriteArtworks:", favoriteArtworks);
        console.log("아이디", objectId);

        const isFound = favoriteArtworks.some((item) => item.object_id === String(objectId));
    
        if (isFound) {
            console.log(`ID ${objectId}가 배열에 존재합니다.`);
            setIsFavorite(true);
        } else {
            console.log(`ID ${objectId}가 배열에 없습니다.`);
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

    const toggleFavoriteArtwork = async () => {
        if(isFavorite) {
            removeArtwork();
        } else {
            saveArtwork();
        }
    }
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

    useEffect(() => {
        setPhoto(objectUrl);
        setTitle(objectName);
        if (objectArtistName !== "") {
            setDescription(objectArtistName, objectYear);
        } else {
            // Display "Unknown" if the data does not exist
            setDescription("Unknown", objectYear);
        }
    }, [objectId, objectName, objectUrl, objectArtistName, objectYear]);

    // Slice text if it is too long
    const truncateText = (text, n) => {
        return text.length > n ? text.slice(0, n) + '…' : text;
    };

    return (
        <div className="savedBox">
            <img 
                src={isFavorite ? '/img/heart-filled.svg' : '/img/heart.svg'}
                alt="button" 
                className="fav_button_card" 
                onClick={() => {
                    toggleFavoriteArtwork(); // Call the saveArtwork function
                }} 
            />
            <div><img src={photo} alt={title} className="saved_imgBox"></img></div>
            <div className="saved_infoBox">
                <div className="saved_title">{truncateText(title, 50)}</div>
                <div className="saved_description">{description}</div>
            </div>
        </div>
    );
}

export default SavedCard;
