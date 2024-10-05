import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ResultArray({ value, navName, navId }) {
    const [objectsData, setObjectsData] = useState([]);
    const [name, setName] = useState("");
    const [selectedObject, setSelectedObject] = useState(null); 
    const [isCardVisible, setIsCardVisible] = useState(false); 
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);
    
        return () => clearTimeout(timer);
      }, []);

    // useEffect to change the nav bar depending on the category
    useEffect(() => {
        if (navName === "artStyle") {
            setName("ART-STYLE");
        } else if (navName === "department") {
            setName("DEPARTMENT");
        } else if (navName === "medium") {
            setName("MEDIUM");
        } else if (navName === "period") {
            setName("PERIOD");
        }
    }, [navName]);

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
            <nav>
                {/* https://stackoverflow.com/questions/29552601/how-to-set-the-defaultroute-to-another-route-in-react-router */}
                <div><img src="img/logo.svg" alt="ArtBook logo" onClick={() => navigate("/")} /></div>
                <div className="header">{name}</div>
                <div><img src="img/menu.svg" alt="hamburger menu" /></div>
            </nav>
            {isCardVisible && <div className="backgroundOverlay"></div>}
            {/* https://chatgpt.com/share/67008d05-e94c-8011-be21-8707500f3977 */}
            {/* stopPropagation: Block the effect of the closeCardOnBackgroundClick function */}
            <div className={`selectedCard ${isCardVisible ? '' : 'none'}`} onClick={(e) => e.stopPropagation()}>
            {selectedObject && (
                <div className="selectedCardBox">
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
                            <div className="cardArtist">{selectedObject.artistDisplayName || 'Unknown'}</div>
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
                                <div>Accession Number</div>
                                <div>{selectedObject.accessionNumber || 'Unknown'}</div>
                            </div>
                        </div>
                        <a href="https://maps.metmuseum.org/?lang=en-GB#17/40.779448/-73.963517/-61/" className="cardButton">
                            <div>
                                On view at Living Map in  <strong>Gallery {selectedObject.GalleryNumber}</strong>
                            </div>
                            <img src="img/map.svg" alt="map icon" className="cardIcon" />
                        </a>
                    </div>
                </div>
                )}
            </div>
            <div className="wrapper">
                {/* https://njirumwai.hashnode.dev/react-router-6-go-back-how-to-go-back-using-react-router-v6 */}
                <div className="previousResult" onClick={() => navigate(-1)}>
                    <img src="img/leftArrow.svg" alt="previous arrow" className="previousImg" />
                    <div className="previousText">Back</div>
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
            <div class="loading">
                <img src="img/artbook.svg" alt="artbook logo" />
            </div> : null }

            
        </div>
      );
}

export default ResultArray;

