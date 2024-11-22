import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Menu({ userId, onMenuToggle }) {
    const [userPhoto, setUserPhoto] = useState('');
    const [userName, setUserName] = useState('');

    const navigate = useNavigate();

    console.log("userID in menu: " + userId);

    // Get userID from the React Router and load user Data
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
        }
    }, [userId]);

    return (
        <div>
            <div className="menu">
                <div className="x_button" onClick={onMenuToggle}><img src="/img/x_button.svg" alt="x button" /></div>
                <div className="menu_clicked">
                    <div className="menu_top">
                        <div className="menu_photo"><div>{userPhoto}</div></div>
                        <div><span>Hi,</span> {userName}!</div>
                    </div>

                    <div className="menu_middle">
                        <div className="menu_category">MAIN MENU</div>
                        <div className="menu_icons" onClick={() => navigate("/list")}><img src="/img/home_icon.svg" alt="home" /> Home</div>
                        <div className="menu_icons" onClick={() => navigate("/saved")}><img src="/img/saved_icon.svg" alt="save" /> Saved</div>
                        <div className="menu_icons" onClick={() => navigate("/recommend")}><img src="/img/recommend_icon.svg" alt="recommend" /> Recommend</div>
                    </div>

                    <div className="menu_bottom">
                        <div className="menu_category">ACCOUNT</div>
                        <div className="menu_icons" onClick={() => navigate("/profile")}><img src="/img/profile_icon.svg" alt="profile" /> Profile</div>
                    </div>
                </div>
            </div>
            <div className="bc_blur menu_blur"></div>
        </div>
    );
}

export default Menu;
