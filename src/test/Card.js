import './Card.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

let number = 0;

function Card() {
    const [idParam, setIdParam] = useState('');
    const [photo, setPhoto] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isHighlight=true&isOnView=true&q=Paintings');
                const data = await response.json();
                const randomIds = data.objectIDs;
                number = randomIds[Math.floor(Math.random() * randomIds.length)];

                // Fetch object details in parallel
                const objectResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${number}`);
                const objectData = await objectResponse.json();

                setPhoto(objectData.primaryImageSmall);
                setTitle(objectData.title);

                if (objectData.artistDisplayName !== "") {
                    setDescription(`${objectData.artistDisplayName}, ${objectData.objectDate}`);
                } else {
                    setDescription(`Unknown, ${objectData.objectDate}`);
                }

                setIdParam(objectData.objectID);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    // const handleClick = () => {
    //     navigate(`/result?id=${idParam}`);
    // };

    const handleClick = () => {
        navigate(`/category?id=${idParam}`);
    };

    console.log(title)
    
    return(
        <div className="cardBox" onClick={handleClick}>
            <div><img src={photo} alt="there is from api" className="imgBox"></img></div>
            <div className="infoBox">
                <div className="title">{title}</div>
                <div className="description">{description}</div>
            </div>
        </div>
    );
}

export default Card;

