import './Card.css';
import { useState, useEffect } from 'react';

let number = 0;

function Card() {
    const [photo, setPhoto] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetch('https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isHighlight=true&isOnView=true&q=Paintings')
            .then(response => response.json())
            .then(data => {
                let randomIds = data.objectIDs;
                number = randomIds[Math.floor(Math.random()*randomIds.length)];
                fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects/' + number)
                .then(response => response.json())
                .then(data => {
                    setPhoto(data.primaryImage);

                    setTitle(data.title);

                    if(data.artistDisplayName !== "") {
                        setDescription(data.artistDisplayName + ', ' + data.accessionYear);
                    } else {
                        setDescription('Unknown, ' + data.accessionYear);
                    }
                })
            })
          .catch((error) => console.log(error));
      }, []);

    return(
        <div className="card">
            <div><img src={photo} alt="there is from api" className="img"></img></div>
            <div className="infoBox">
                <div className="title">{title}</div>
                <div className="description">{description}</div>
            </div>
        </div>
    );
}

export default Card;