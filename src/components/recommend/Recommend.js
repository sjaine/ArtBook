import { useEffect, useState } from 'react';
import Nav from '../Nav.js';
import Menu from '../Menu.js';
import RecommendCard from './RecommendCard.js';

function Recommend({ userId }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userEmoji, setUserEmoji] = useState('');
    const [mostEmoji, setMostEmoji] = useState('');
    const [favoriteArtworks, setFavoriteArtworks] = useState([]);
    const [favoriteArtworksByMost, setFavoriteArtworksByMost] = useState([]);
    
    const [currentPageForFavorites, setCurrentPageForFavorites] = useState(1); // Pagination for favoriteArtworks
    const [currentPageForMost, setCurrentPageForMost] = useState(1); // Pagination for favoriteArtworksByMost
    const itemsPerPage = 5; // Number of items per page for both lists

    const [selectedObject, setSelectedObject] = useState(null); 
    const [isCardVisible, setIsCardVisible] = useState(false); 
    const [isFavorite, setIsFavorite] = useState(false);

    // on and off Menu.js
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Fecth user info to get the emoji
    const fetchUserInfo = async (userId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`);
    
            if (!response.ok) {
                throw new Error('Failed to load favorite artworks');
            }
    
            const userInfo = await response.json();
            return userInfo.emojis;
        } catch (error) {
            console.error('Error fetching favorite artworks:', error);
            return null;
        }
    };

    // Fetch favorite artworks by emoji
    const fetchFavArtworksByEmoji = async (emoji) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/emojis/${emoji}/fav-artworks`);
            if (!response.ok) {
                throw new Error('Failed to fetch favorite artworks');
            }
            const favArtworks = await response.json();
            setFavoriteArtworks(favArtworks); // Update state
        } catch (error) {
            console.error('Error fetching favorite artworks by emoji:', error);
        }
    };

    // Get the most saved emoji
    const getMostSavedEmoji = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/aggregate/most-saved-emojis`);

            if(!response.ok) {
                throw new Error('Failed to fetch favorite artworks');
            }

            const mostSavedEmoji = await response.json();
            return mostSavedEmoji[0]._id;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Fetch favorite artworks by most saved emoji
    const fetchFavArtworksByMostSavedEmoji = async (mostEmoji) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/emojis/${mostEmoji}/fav-artworks`);
            if (!response.ok) {
                throw new Error('Failed to fetch favorite artworks');
            }
            const favArtworks = await response.json();
            setFavoriteArtworksByMost(favArtworks); // Update state
        } catch (error) {
            console.error('Error fetching favorite artworks by emoji:', error);
        }
    };
    
    // Call this function in a useEffect or on a button click
    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                const emoji = await fetchUserInfo(userId);
                if (emoji) {
                    setUserEmoji(emoji);
                    await fetchFavArtworksByEmoji(emoji);
                }
            }
        };

        const fetchMostData = async () => {
            if (userId) {
                const mostEmoji = await getMostSavedEmoji();
                if (mostEmoji) {
                    setMostEmoji(mostEmoji);
                    await fetchFavArtworksByMostSavedEmoji(mostEmoji);
                }
            }
        };
        fetchData();
        fetchMostData();
    }, [userId]);

    // Fetch favorite artwork list 
    // https://chatgpt.com/share/673ff681-12a0-8011-ad19-149061f4c85e
    // https://chatgpt.com/share/673ff65e-efc4-8011-bd70-3d2d6b331824
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

     // Check does it already exist in the array
     const checkIsFavorite = (id) => {
        const isFound = favoriteArtworks.some((item) => item.object_id === String(id));
    
        if (isFound) {
            console.log(`ID ${id} is existing in the array.`);
            setIsFavorite(true);
        } else {
            console.log(`ID ${id} isn't existing in the array.`);
            setIsFavorite(false);
        }
    }

    useEffect(() => {
        console.log(`isFavorite updated: ${isFavorite}`);
    }, [isFavorite]);

    // Toggle, like / unlike
    const toggleFavoriteArtwork = async (artwork) => {
        if(isFavorite) {
            removeArtwork(artwork.objectID);
        } else {
            saveArtwork(artwork);
        }
    }

    // Remove artwork from the list
    const removeArtwork = async (artwork) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/fav-artworks/${artwork}`, {
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

    // Save artwork to the list
    const saveArtwork = async (artwork) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/fav-artworks`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    object_id: artwork.objectID,
                    object_name: artwork.title,
                    object_url: artwork.primaryImageSmall,
                    object_artistName: artwork.artistDisplayName || 'Unknown',
                    object_year: artwork.objectDate || 'Unknown',
                    object_department: artwork.department
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

    // Slice text if it is too long
    const truncateText = (text, n) => {
        return text.length > n ? text.slice(0, n) + '…' : text;
    };

    // https://chatgpt.com/share/67008d05-e94c-8011-be21-8707500f3977
    // https://bender.sheridanc.on.ca/system-design/pokemon <- Thank you Harold!
    // Show a popover when the user clicks each table
    const popupCardInfo = async (url) => {
        checkIsFavorite(url);
        
        const data = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${url}`)
        const selectedObject = await data.json()
    
        setSelectedObject(selectedObject); 
        setIsCardVisible(true); 

        window.addEventListener('click', closeCardOnBackgroundClick);
    }

    // Close the Popover when user clicks the background! 
    const closeCardOnBackgroundClick = () => {
        setIsCardVisible(false);
        setSelectedObject(null);

        window.removeEventListener('click', closeCardOnBackgroundClick);
    };


    // Pagination Logic for favoriteArtworks
    // https://chatgpt.com/share/673ff681-12a0-8011-ad19-149061f4c85e
    const totalPagesForFavorites = Math.ceil(favoriteArtworks.length / itemsPerPage);
    const paginatedFavorites = favoriteArtworks.slice(
        (currentPageForFavorites - 1) * itemsPerPage,
        currentPageForFavorites * itemsPerPage
    );

    const goToNextPageForFavorites = () => {
        if (currentPageForFavorites < totalPagesForFavorites) {
            setCurrentPageForFavorites(currentPageForFavorites + 1);
        }
    };

    const goToPreviousPageForFavorites = () => {
        if (currentPageForFavorites > 1) {
            setCurrentPageForFavorites(currentPageForFavorites - 1);
        }
    };

    // Pagination Logic for favoriteArtworksByMost
    const totalPagesForMost = Math.ceil(favoriteArtworksByMost.length / itemsPerPage);
    const paginatedMostFavorites = favoriteArtworksByMost.slice(
        (currentPageForMost - 1) * itemsPerPage,
        currentPageForMost * itemsPerPage
    );

    const goToNextPageForMost = () => {
        if (currentPageForMost < totalPagesForMost) {
            setCurrentPageForMost(currentPageForMost + 1);
        }
    };

    const goToPreviousPageForMost = () => {
        if (currentPageForMost > 1) {
            setCurrentPageForMost(currentPageForMost - 1);
        }
    };
    
    return(
        <div>
            <Nav onMenuToggle={toggleMenu} />
            {isMenuOpen && <Menu userId={userId} onMenuToggle={toggleMenu}  />}
            {isCardVisible && <div className="backgroundOverlay"></div>}
            {/* https://chatgpt.com/share/67008d05-e94c-8011-be21-8707500f3977 */}
            {/* stopPropagation: Block the effect of the closeCardOnBackgroundClick function */}
            <div className={`selectedCard ${isCardVisible ? '' : 'none'}`} onClick={(e) => e.stopPropagation()}>
            {selectedObject && (
                <div className="selectedCardBox">
                    <img 
                        src={isFavorite ? '/img/heart-filled.svg' : '/img/heart.svg'}
                        alt="button" 
                        className="fav_button" 
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the popover
                            toggleFavoriteArtwork(selectedObject); // Call the saveArtwork function
                        }} 
                    />
                    {/* https://chatgpt.com/share/67008d05-e94c-8011-be21-8707500f3977 */}
                    <div onClick={() => {setIsCardVisible(false); setSelectedObject(null);}}>
                        <img src="img/close.svg" alt="close button" className="closeButton" />
                    </div>
                    <div>
                        <img src={selectedObject.primaryImage} alt="card" className="cardImage" />
                    </div>
                    <div className="cardInfo">
                        <div>
                            <div className="cardTitle">{truncateText(selectedObject.title, 60)}</div>
                            <div className="cardArtist">{selectedObject.artistDisplayName || 'Unknown'}, {selectedObject.objectDate}</div>
                        </div>
                        <div>
                            <div className="cardTable">
                                <div>Period</div>
                                <div>{selectedObject.objectDate || 'Unknown'}</div>
                            </div>
                            <div className="cardTable">
                                <div>Date</div>
                                <div>{selectedObject.objectBeginDate || 'Unknown'}</div>
                            </div>
                            <div className="cardTable">
                                <div>Culture</div>
                                <div>{selectedObject.culture || 'Unknown'}</div>
                            </div>
                            <div className="cardTable">
                                <div>Medium</div>
                                <div>{truncateText(selectedObject.medium, 100) || 'Unknown'}</div>
                            </div>
                            <div className="cardTable">
                                <div>Classification</div>
                                <div>{selectedObject.classification || 'Unknown'}</div>
                            </div>
                            <div className="cardTable">
                                <div>Department</div>
                                <div>{selectedObject.department || 'Not on view'}</div>
                            </div>
                        </div>
                        <a href="https://maps.metmuseum.org/?lang=en-GB#17/40.779448/-73.963517/-61/" className="cardButton">
                            <div>
                                {favoriteArtworks.length} On view at Living Map in  <strong>Gallery {selectedObject.GalleryNumber}</strong>
                            </div>
                            <img src="img/map.svg" alt="map icon" className="cardIcon" />
                        </a>
                    </div>
                </div>
                )}
            </div>
            
            <div className="recommend-wrapper">
                <div className="recommend-header">
                    <div>Home / Recommend</div>
                    <div>Here are some recommended <span>artworks</span> just for you 👍</div>
                </div>

                <div className="recommend-lists">
                    <div className="recommend-emoji">From others who chose the <span>same</span> emoji({userEmoji}) as you...</div>
                    <div className="recommend-recommend">
                        <div className="recommend-list">
                            {paginatedFavorites.map((artwork, index) => (
                                <RecommendCard 
                                    key={index}
                                    userId={userId}
                                    objectId={artwork.object_id}
                                    objectName={artwork.object_name}
                                    objectUrl={artwork.object_url}
                                    objectArtistName={artwork.object_artistName}
                                    objectYear={artwork.object_year}
                                    onClick={() => popupCardInfo(artwork.object_id)}
                                />
                            ))}
                        </div>
                        <div className="recommend-pagination">
                            <button onClick={goToPreviousPageForFavorites} disabled={currentPageForFavorites === 1} className="recommend-left">
                                <img src="img/arrowWhite.svg" alt="left arrow" />
                            </button>
                            <button onClick={goToNextPageForFavorites} disabled={currentPageForFavorites === totalPagesForFavorites} className="recommend-right">
                                <img src="img/arrowWhite.svg" alt="right arrow" />
                            </button>
                        </div>
                    </div>

                    <div className="recommend-emoji">From others who picked this <span>popular</span> emoji({mostEmoji})...</div>
                    <div className="recommend-recommend">
                        <div className="recommend-list">
                            {paginatedMostFavorites.map((artwork, index) => (
                            <RecommendCard 
                                key={index}
                                userId={userId}
                                objectId={artwork.object_id}
                                objectName={artwork.object_name}
                                objectUrl={artwork.object_url}
                                objectArtistName={artwork.object_artistName}
                                objectYear={artwork.object_year}
                                onClick={() => popupCardInfo(artwork.object_id)}
                            />
                            ))}
                        </div>
                        <div className="recommend-pagination">
                            <button onClick={goToPreviousPageForMost} disabled={currentPageForMost === 1} className="recommend-left">
                                <img src="img/arrowWhite.svg" alt="left arrow" />
                            </button>
                            <button onClick={goToNextPageForMost} disabled={currentPageForMost === totalPagesForMost} className="recommend-right">
                                <img src="img/arrowWhite.svg" alt="right arrow" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Recommend;