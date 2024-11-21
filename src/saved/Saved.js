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

    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const fetchFavArtworks = async (userId) => {
        try {
            const response = await fetch(`https://artbook-x9c3.onrender.com/api/users/${userId}/fav-artworks`);
    
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
    
    // Call this function in a useEffect or on a button click
    useEffect(() => {
        if (userId) {
            fetchFavArtworks(userId);
        }
    }, [userId]);

    // Pagination Logic
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
                                objectyear={artwork.object_year}  />
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