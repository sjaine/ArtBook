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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const fetchUserInfo = async (userId) => {
        try {
            const response = await fetch(`/api/users/${userId}`);
    
            if (!response.ok) {
                throw new Error('Failed to load favorite artworks');
            }
    
            const userInfo = await response.json();
            console.log('User Information Emoji:', userInfo.emojis);
            return userInfo.emojis;
        } catch (error) {
            console.error('Error fetching favorite artworks:', error);
            return null;
        }
    };

    // Fetch favorite artworks by emoji
    const fetchFavArtworksByEmoji = async (emoji) => {
        try {
            const response = await fetch(`/api/users/emojis/${emoji}/fav-artworks`);
            if (!response.ok) {
                throw new Error('Failed to fetch favorite artworks');
            }
            const favArtworks = await response.json();
            console.log('Favorite Artworks:', favArtworks);
            setFavoriteArtworks(favArtworks); // Update state
        } catch (error) {
            console.error('Error fetching favorite artworks by emoji:', error);
        }
    };

    // Get the most saved emoji
    const getMostSavedEmoji = async () => {
        try {
            const response = await fetch(`/api/users/aggregate/most-saved-emojis`);

            if(!response.ok) {
                throw new Error('Failed to fetch favorite artworks');
            }

            const mostSavedEmoji = await response.json();
            console.log(mostSavedEmoji[0]._id);
            return mostSavedEmoji[0]._id;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Fetch favorite artworks by most saved emoji
    const fetchFavArtworksByMostSavedEmoji = async (mostEmoji) => {
        try {
            const response = await fetch(`/api/users/emojis/${mostEmoji}/fav-artworks`);
            if (!response.ok) {
                throw new Error('Failed to fetch favorite artworks');
            }
            const favArtworks = await response.json();
            console.log('Favorite Artworks by most Saved:', favArtworks);
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
    
    
    console.log("userId is: " + userId);

    // Pagination Logic for favoriteArtworks
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