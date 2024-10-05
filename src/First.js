import { useNavigate } from 'react-router-dom';

function First() {
    const navigate = useNavigate();

    return (
        <div>
            <nav>
                {/* It redirects to the home page when user click the logo */}
                {/* https://stackoverflow.com/questions/29552601/how-to-set-the-defaultroute-to-another-route-in-react-router */}
                <div><img src="img/logo.svg" alt="ArtBook logo" onClick={() => navigate("/")} /></div>
                <div className="header"></div>
                <div><img src="img/menu.svg" alt="hamburger menu" /></div>
            </nav>
            <div className="wrapper noMargin">
                <div className="main">
                    <div className="mainInfo">
                        <div>Are you planning to visit a museum but unsure where to start? </div>
                        <div>Discover your perfect art match and make the most of your time with our personalized recommendations.</div>
                        {/* It redirects to the main page when user click the logo */}
                        <div onClick={() => navigate("/list")}>Let’s discover</div>
                    </div>
                    <img src="img/main.png" alt="main background" />
                </div>
            </div>
        </div>
    );
}

export default First;


