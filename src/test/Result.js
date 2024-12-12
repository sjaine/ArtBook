import ResultArray from '../categories/ResultArray';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Result() {
    const [searchParams] = useSearchParams();
    const idParam = searchParams.get('id');
    const [artworkData, setArtworkData] = useState([]);

    useEffect(() => {
        if (idParam) {
            fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${idParam}`)
                .then(response => response.json())
                .then(data => {
                    let artist = data.artistAlphaSort
                    let artistFirst = artist.split(',')[0]


                    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isOnView=true&q=${artistFirst}`)
                    .then(response => response.json())
                    .then(data => {
                        setArtworkData(data.objectIDs)
                    })
                })
                .catch(error => console.log(error));
            }
        }, [idParam]);
        
    return (
        <ResultArray value={artworkData} />
    );
}

export default Result;
