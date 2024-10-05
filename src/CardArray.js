import Card from './Card';
import { useNavigate } from 'react-router-dom';

function CardArray() {
    const navigate = useNavigate();
    const objectIds = [51170, 466105, 450748, 503651, 78190, 202996, 437658, 459246, 544442, 469858, 10464, 257875]; 

    return (
        <div>
            <nav>
                {/* https://stackoverflow.com/questions/29552601/how-to-set-the-defaultroute-to-another-route-in-react-router */}
                <div><img src="img/logo.svg" alt="ArtBook logo" onClick={() => navigate("/")} /></div>
                <div className="header">Pick an art style that catches your eye!</div>
                <div><img src="img/menu.svg" alt="hamburger menu" /></div>
            </nav>
            <div className="wrapper">
                {/* https://njirumwai.hashnode.dev/react-router-6-go-back-how-to-go-back-using-react-router-v6 */}
                <div className="previousCard" onClick={() => navigate(-1)}>
                    <img src="img/leftArrow.svg" alt="previous arrow" className="previousImg" />
                    <div className="previousText">Back</div> 
                </div>
                <div className="card-list">
                    {objectIds.map((id, index) => (
                        <Card key={index} objectId={id} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CardArray;