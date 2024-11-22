import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Card({ objectId }) {
    const [photo, setPhoto] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Get objectId from the CardArray component
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`)
            .then(response => response.json())
            .then(data => {
                setPhoto(data.primaryImageSmall);
                setTitle(data.title);
                
                // Check for the existence of the artist's name
                if (data.artistDisplayName !== "") {
                    setDescription(`${data.artistDisplayName}, ${data.objectDate}`);
                } else {
                    // Display "Unknown" if the data does not exist
                    setDescription(`Unknown, ${data.objectDate}`);
                }
            })
    }, [objectId]);

    const handleClick = () => {
        navigate(`/category?id=${objectId}`);
    };

    // Slice text if it is too long
    const truncateText = (text, n) => {
        return text.length > n ? text.slice(0, n) + '…' : text;
    };

    return (
        <div className="cardBox" onClick={handleClick}>
            <div><img src={photo} alt={title} className="imgBox"></img></div>
            <div className="infoBox">
                <div className="title">{truncateText(title, 50)}</div>
                <div className="description">{description}</div>
            </div>
        </div>
    );
}

export default Card;
