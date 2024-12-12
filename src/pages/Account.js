import { useEffect, useState } from 'react';
import Nav from '../components/Nav.js';
import Menu from '../components/Menu.js';
import { useNavigate } from 'react-router-dom';
import Chart from '../components/Chart.js';

function Saved({ userId }) {
    const [userPhoto, setUserPhoto] = useState('');
    const [userName, setUserName] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [alert, setAlert] = useState("⚠️");
    const [alarm, setAlarm] = useState("Delete your account?");
    const [explanation, setExplanation] = useState(<>
        This action is permanent and cannot be undone.<br />
        You will immediately lose your access to all your account and data.
    </>);
    const [isDeleteButtonsVisible, setIsDeleteButtonsVisible] = useState(true);

    const [favoriteDepartments, setFavoriteDepartments] = useState([]);
    const [firstDepartment, setFirstDepartment] = useState('');
    
    const [isExistingDepartment, setIsExistingDepartment] = useState(false);

    const navigate = useNavigate();

    // on and off Menu.js
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // on and off Delete Box
    const toggleDelete = () => {
        setIsOpenDelete(!isOpenDelete);
    }

    // Delete User
    // https://chatgpt.com/share/673ff604-105c-8011-8bb3-63176e29b624
    const deleteUser = async (userId) => {
          try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`, {method: "DELETE", credentials: 'include',}); // Pass the endpoint string to fetch
            const result = await response.json();
            console.log(result, "Deleted!");
        } catch (error) {
            console.log(error);
        }
      };

    // If user delete their data, confirm that deleted successfully then go back to first page
    const deletedUser = async (userId) => {
        deleteUser(userId);
        setAlert("👋");
        setAlarm("Success!");
        setExplanation(<>Your account was successfully deleted. <br />
            Thank you for using it!</>);
        setIsDeleteButtonsVisible(false);
        setTimeout(() => {
            navigate("/");
        }, 2000);
    };

    // How to order top 3 departments
    // https://chatgpt.com/share/675b0f85-604c-8011-88ec-e720af80e328
    // Get fav_artwork_department
    const getDepartment = async (userId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/fav-artworks-department`);
            if (!response.ok) throw new Error('Failed to load favorite artworks');
        
            const top3Departments = await response.json();

            if(top3Departments.length >= 3) {
                setFavoriteDepartments(top3Departments);
                setIsExistingDepartment(true);

                if(top3Departments[0].name === "Arts of Africa, Oceania, and the Americas") {
                    setFirstDepartment("Arts of Africa");
                } else if (top3Departments[0].name === "European Sculpture and Decorative Arts") {
                    setFirstDepartment("European Sculpture");
                } else {
                    setFirstDepartment(top3Departments[0].name);
                }
            } else {
                setIsExistingDepartment(false);
            }
          
        } catch (error) {
          console.error('Error fetching favorite artworks:', error);
        }
      };


    // User profile
    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`);
                const user = await response.json();
                setUserPhoto(user.emojis);
                setUserName(user.nickname);
            } catch (error) {
                console.log(error);
            }
        };
        
        if (userId) {
            getUsers();
            getDepartment(userId);
        }
    }, [userId]);
    
    return(
        <div>
            <Nav onMenuToggle={toggleMenu} />
            {isMenuOpen && <Menu userId={userId} onMenuToggle={toggleMenu}  />}
            
            <div className="saved-wrapper">
                <div className="saved-header">
                    <div>Home / Profile</div>
                    <div>Hi, {userName} 👋</div>
                </div>

                <div className="profile-box">
                    <div className="profile-deleteEdit">
                        <div className="profile-profile">My profile</div>
                        <div className="showEmoji"><div>{userPhoto}</div></div>
                        <div className="profile_input name_input">
                            <div>{userName}</div>
                            <img src="img/name.svg" alt="name" />
                        </div>
                        <fieldset className="profile_btns">
                            <button className="profile_btn delete_btn" onClick={() => toggleDelete()}>Delete</button>
                            <button className="profile_btn edit_btn">Edit</button>
                        </fieldset>
                    </div>

                    <div>
                        <div className="profile_leftBox">
                            <div className="bar">
                                <img src="/img/chart.svg" alt="analytics" />
                                Analytics
                            </div>
                            {isExistingDepartment ? (
                                <div className="profile_chartBox">
                                    <Chart value={favoriteDepartments} userId={userId}  />
                                    <div className="profile_topDepartment">
                                        <div>Your <span>top</span> department is...</div>
                                        <a className="profile_departmentBtn" href="https://www.metmuseum.org/about-the-met/collection-areas">{firstDepartment}</a>
                                    </div>
                                </div>
                            ) : (
                                <div className="profile_chartBox chart-none">
                                    <div>🧐</div>
                                    <div>You don’t have enough saved artworks yet.</div>
                                    <div>Want to discover your artistic taste? <br />
                                    Save a few artworks you love, and we'll show you your top art style!</div>

                                    <div className="chart_blur"></div>
                                    <img className="placeholder_chart" src="/img/placeholder_chart.svg" alt="placeholder" />
                                </div>
                            )}
                            
                        </div>
                        <img src="img/mappie.svg" alt="mappie" />
                    </div>

                    {isOpenDelete && <div className="delete_box">
                        <div>{alert}</div> 
                        <div>{alarm}</div>
                        <div>{explanation}</div>
                        {isDeleteButtonsVisible && (
                            <fieldset className="profile_btns">
                                <button className="profile_btn delete_btn" onClick={toggleDelete}>Cancel</button>
                                <button className="profile_btn edit_btn" onClick={() => deletedUser(userId)}>Yes, Delete</button>
                            </fieldset>
                        )}
                    </div>}

                    {isOpenDelete && <div className="bc_blur"></div>}

                </div>

            </div>
        </div>
    );
}

export default Saved;