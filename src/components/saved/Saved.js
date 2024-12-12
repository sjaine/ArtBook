import { useEffect, useState } from 'react';
import Nav from '../Nav.js';
import Menu from '../Menu.js';
import SavedCard from './SavedCard.js';
import { useNavigate } from 'react-router-dom';

function Saved({ userId }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [favoriteArtworks, setFavoriteArtworks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Pagination: Current page
    const itemsPerPage = 10; // Number of items per page

    const [selectedObject, setSelectedObject] = useState(null); 
    const [isCardVisible, setIsCardVisible] = useState(false); 
    const [isFavorite, setIsFavorite] = useState(false);

    const navigate = useNavigate();

    // on and off Menu.js
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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
    
    // Call this function in a useEffect or on a button click
    useEffect(() => {
        if (userId) {
            fetchFavArtworks(userId);
        }
    }, [userId]);

    // Pagination Logic
    // https://chatgpt.com/share/673ff681-12a0-8011-ad19-149061f4c85e
    const totalPages = Math.ceil(favoriteArtworks.length / itemsPerPage);
    const paginatedArtworks = favoriteArtworks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
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
            
            <div className="saved-wrapper">
                <div className="saved-header">
                    <div>Home / Saved</div>
                    <div>Here are <span>artworks</span> that caught your eye ✨</div>
                    <div>{favoriteArtworks.length} saved</div>
                </div>

                {favoriteArtworks.length === 0 ? (
                    <div className="saved-none">
                        <div>🧐</div>
                        <div>You don’t have any saved artworks yet.</div>
                        <div>To start building your personal collection, <br />
                        explore artworks on the Home page or check out the Recommend page!</div>
                        <button className="home_btn form_btn" onClick={() => navigate("/list")}>Go to Home page</button>
                    </div>
                ) : (
                    <div className="saved-list">
                        {paginatedArtworks.map((artwork, index) => (
                            <SavedCard 
                                key={index} 
                                userId={userId}
                                objectId={artwork.object_id}
                                objectName={artwork.object_name}
                                objectUrl={artwork.object_url} 
                                objectArtistName={artwork.object_artistName} 
                                objectYear={artwork.object_year}
                                onClick={() => popupCardInfo(artwork.object_id)}  />
                        ))}
                    </div>
                )}

                {favoriteArtworks.length > itemsPerPage && (
                    <div className="pagination">
                        <button 
                            className="prevBtn form_btn" 
                            onClick={goToPreviousPage} 
                            disabled={currentPage === 1}
                        >
                            <img src="img/nextArrow.svg" alt="left arrow" /> Before 
                        </button>
                        <button 
                            className="nextBtn form_btn" 
                            onClick={goToNextPage} 
                            disabled={currentPage === totalPages}
                        >
                            Next <img src="img/nextArrow.svg" alt="right arrow" />
                        </button>
                    </div>
                )}

                
            </div>
        </div>
    );
}

export default Saved;