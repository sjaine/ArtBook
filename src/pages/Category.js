import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav.js';
import Menu from '../components/Menu.js';


function Category({ userId }) {
    const [searchParams] = useSearchParams();
    const idParam = searchParams.get('id');
    const [classification, setClassification] = useState('');
    const [medium, setMedium] = useState('');
    const [deparment, setDeparment] = useState('');
    const [period, setPeriod] = useState('');

    const navigate = useNavigate();

    const [artStylePhoto, setArtStylePhoto] = useState('');
    const [mediumPhoto, setMediumPhoto] = useState('');
    const [departmentPhoto, setDepartmentPhoto] = useState('');
    const [periodPhoto, setPeriodPhoto] = useState('');
    
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);
    
        return () => clearTimeout(timer);
      }, []);

    // From ChatGPT https://chatgpt.com/share/670084e6-6d2c-8011-a2b8-7d7f2629f7d3 
    const fetchCategoryData = (category, setter) => {
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isOnView=true&q=${category}`)
            .then(response => response.json())
            .then(data => {
                if (data.objectIDs) {
                    // Filter out objectID 78870 since it no longer exists (but has not been updated)
                    const filteredIDs = data.objectIDs.filter(id => id !== 78870);
                    
                    if (filteredIDs.length > 1) {
                        // Fetch data from its child components – from each category page
                        // Fetch data at index[1] since index[0] is the selected card
                        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${filteredIDs[1]}`)
                            .then(response => response.json())
                            .then(objectData => {
                                if (objectData.primaryImage === "") {
                                    // If index[1] doesn't have an image, fetch data from index[2]
                                    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${filteredIDs[2]}`)
                                        .then(response => response.json())
                                        .then(objectData => {
                                            setter(objectData.primaryImage); 
                                        });
                                } else {
                                    setter(objectData.primaryImage); 
                                }
                            });
                    }
                }
            })
            .catch(error => console.log(error));
    };
    

    useEffect(() => {
        if (idParam) {
            fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${idParam}`)
                .then(response => response.json())
                .then(data => {
                    setClassification(data.objectName)
                    setMedium(data.medium.split(',')[0])
                    setDeparment(data.department)

                    // Check for the existence of the objectDate
                    if (data.objectDate) {
                        setPeriod(data.objectDate);
                    } else {
                        // If objectData doesn't exist, then setPeriod to objectBeginDate
                        setPeriod(data.objectBeginDate);
                    }

                    // from ChatGPT https://chatgpt.com/share/67008543-675c-8011-9e9e-aa44986b1f5f 
                    // Set a different photo depending on the category by using the fetchCategoryData function
                    fetchCategoryData(data.objectName, setArtStylePhoto);  
                    fetchCategoryData(data.medium.split(',')[0], setMediumPhoto);  
                    fetchCategoryData(data.department, setDepartmentPhoto);  
                    fetchCategoryData(data.objectDate || data.objectBeginDate, setPeriodPhoto); 
                    // from ChatGPT
                })
                .catch(error => console.log(error));
            }

        }, [idParam]);

    // https://reactrouter.com/en/main/hooks/use-search-params
    // https://developer.mozilla.org/en-US/docs/Web/API/Location/search
    // Utilize useSearchParams from React Router DOM as the search parameter for the API

    const handleClickArt = (e) => {
        // ${link} allows to redirect each categories by using value
        let link = e.target.value;
        navigate(`/${link}?id=${idParam}&category=${classification}`);
    };

    const handleClickMedium = (e) => {
        let link = e.target.value;
        navigate(`/${link}?id=${idParam}&category=${medium}`);
    };

    const handleClickDepartment = (e) => {
        let link = e.target.value;
        navigate(`/${link}?id=${idParam}&category=${deparment}`);
    };

    const handleClickPeriod = (e) => {
        let link = e.target.value;
        navigate(`/${link}?id=${idParam}&category=${period}`);
    };

    // on and off Menu.js
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
        
    return (
        <div>
            <Nav onMenuToggle={toggleMenu} />
            {isMenuOpen && <Menu userId={userId} onMenuToggle={toggleMenu}  />}
            <div className="wrapper">
                <div className="profile_nav">
                    {/* https://njirumwai.hashnode.dev/react-router-6-go-back-how-to-go-back-using-react-router-v6 */}
                    <div className="previous" onClick={() => navigate(-1)}>
                        <img src="img/leftArrow.svg" alt="previous arrow" className="previousImg" />
                        <div className="previousBtnText">Back</div>
                    </div>
                    <div className="profile_title">
                        How would you like to <span>explore</span> your results? 🧐
                    </div>
                </div>
                <div className="category_boxes">
                    <div className="category_CardBox">
                        <div><img src={artStylePhoto} alt="Art Style" className="category_imgBox" loading="lazy" /></div>
                        <div className="category_infoBox">
                            <div className="title">Art Style</div>
                            <div className="description">See artworks from the same classification</div>
                            <button type="button" className="btn category-btn" value="artStyle" onClick={handleClickArt}>See details</button>
                        </div>
                    </div>
                    <div className="category_CardBox">
                        <div><img src={periodPhoto} alt="Period" className="category_imgBox" /></div>
                        <div className="category_infoBox">
                            <div className="title">Period</div>
                            <div className="description">See artworks from the same period</div>
                            <button type="button" className="btn category-btn" value="period" onClick={handleClickPeriod}>See details</button>
                        </div>
                    </div>
                    <div className="category_CardBox">
                        <div><img src={mediumPhoto} alt="Medium" className="category_imgBox" /></div>
                        <div className="category_infoBox">
                            <div className="title">Medium</div>
                            <div className="description">See artworks in similar mediums</div>
                            <button type="button" className="btn category-btn" value="medium" onClick={handleClickMedium}>See details</button>
                        </div>
                    </div>
                    <div className="category_CardBox">
                        <div><img src={departmentPhoto} alt="Department" className="category_imgBox" /></div>
                        <div className="category_infoBox">
                            <div className="title">Department</div>
                            <div className="description">See related nearby artworks</div>
                            <button type="button" className="btn category-btn" value="department" onClick={handleClickDepartment}>See details</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* https://www.shecodes.io/athena/11556-react-how-to-show-a-loading-message-when-fetching-data */}
            {isLoading ? <div className="loading">
                <img src="img/artbook.svg" alt="artbook logo" />
            </div> : null}
        </div>
            
    );
}

export default Category;
