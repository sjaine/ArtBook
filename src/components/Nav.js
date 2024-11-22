import React from 'react';
import { useNavigate } from 'react-router-dom';

function Nav({ onMenuToggle }) {
    const navigate = useNavigate();

    return (
        <nav>
            {/* https://stackoverflow.com/questions/29552601/how-to-set-the-defaultroute-to-another-route-in-react-router */}
            <div><img src="img/logo.svg" alt="ArtBook logo" onClick={() => navigate("/list")} /></div>
            <div onClick={onMenuToggle} className="center"><div></div></div>
        </nav>
    );
}

export default Nav;