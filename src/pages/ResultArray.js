import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav.js';
import Menu from '../components/Menu.js';

function ResultArray({ value, navId, userId }) {
    const [objectsData, setObjectsData] = useState([]);
    const [selectedObject, setSelectedObject] = useState(null); 
    const [isCardVisible, setIsCardVisible] = useState(false); 
    const [isLoading, setIsLoading] = useState(true);
    const [favoriteArtworks, setFavoriteArtworks] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);

    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            console.log('Favorite Artworks:', favArtworks);

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
        console.log("favoriteArtworks:", favoriteArtworks);
        console.log("ID", id);

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
        console.log(artwork);
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

    // loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);
    
        return () => clearTimeout(timer);
      }, []);

    // fetch
    useEffect(() => {
        if (value && Array.isArray(value) && navId) {
            let objects = value.slice(0, 10); 

            // https://chatgpt.com/share/67008a5d-da2c-8011-9e08-598ec7add6e7
            const fetchData = async () => {
                // Fetch the selected card's data before fetching related data
                const [initialResponse, dataArr] = await Promise.all([
                    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${navId}`).then(res => res.json()),
                    Promise.all(
                        objects.map(async (object) => {
                            const response = await fetch(
                                `https://collectionapi.metmuseum.org/public/collection/v1/objects/${object}`
                            );
                            const data = await response.json();
                            return data;
                        })
                    )
                ]);

                // Filter DataArr by: 1. No image 2. Same as the selected data (to prevent overlapping results)
                const filteredDataArr = dataArr
                .filter(data => data.primaryImage !== "")
                .filter(data => data.objectID !== initialResponse.objectID);

                // Combine two arrays to load as a table by using map
                const dataArray = [initialResponse].concat(filteredDataArr);

                // Limit the number to 5 for visualization
                setObjectsData(dataArray.slice(0, 5));
            };
    
            fetchData();
        }
    }, [value, navId]);

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

    return (
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
            <div className="wrapper">
                <div className="profile_nav result">
                    {/* https://njirumwai.hashnode.dev/react-router-6-go-back-how-to-go-back-using-react-router-v6 */}
                    <div className="previousResult" onClick={() => navigate(-1)}>
                        <img src="img/leftArrow.svg" alt="previous arrow" className="previousImg" />
                        <div className="previousBtnText2">Back</div>
                    </div>
                    <div className="profile_title title_result">Classification</div>
                </div>
                <div className="object_Table">
                    <table>
                        <tbody>
                            {objectsData.map((object, index) => (
                                // https://chatgpt.com/share/67008d05-e94c-8011-be21-8707500f3977
                                <tr className="objectTable" key={index} onClick={() => popupCardInfo(object.objectID)}>
                                    <td className="tableImage">
                                        <img src={object.primaryImageSmall} alt="primary" className="objectImage" loading="lazy" />
                                    </td>
                                    <td>
                                        <div className="objectInfo">
                                            <div className="objectTitle">{truncateText(object.title, 45)}</div>
                                            <div className="objectDescription">
                                                {object.artistDisplayName ? object.artistDisplayName : 'Unknown'}, {object.objectDate}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <img src="/img/button.svg" alt="button" className="table_button" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div> 

            {/* https://www.shecodes.io/athena/11556-react-how-to-show-a-loading-message-when-fetching-data */}
            {isLoading ? 
            <div className="loading">
                <img src="img/artbook.svg" alt="artbook logo" />
            </div> : null }

            
        </div>
      );
}

export default ResultArray;

