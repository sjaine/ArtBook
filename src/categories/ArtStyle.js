import ResultArray from './ResultArray';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Result() {
    // https://reactrouter.com/en/main/hooks/use-search-params
    // https://developer.mozilla.org/en-US/docs/Web/API/Location/search
    // Utilize useSearchParams from React Router DOM as the search parameter for the API
    const [searchParams] = useSearchParams();
    const idParam = searchParams.get('id');
    const categoryParam = searchParams.get('category');
    const [artworkData, setArtworkData] = useState([]);
    const [navId, setnavId] = useState("");

    useEffect(() => {
        // To pass selected card's objectId to Result Array Component
        setnavId(idParam);
    }, [idParam]);

    useEffect(() => {
        if (idParam && categoryParam) {
            fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${idParam}`)
            .then(response => response.json())
            .then(() => {
                fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isOnView=true&q=${categoryParam}`)
                .then(response => response.json())
                .then(data => {
                        // https://chatgpt.com/share/67008882-ac10-8011-802e-5e003a44ac44 
                        // Pass the objectIDs array to the ResultArray component
                        setArtworkData(data.objectIDs)
                    })
                })
                .catch(error => console.log(error));
            }
        }, [idParam, categoryParam]);
        
    return (
        <ResultArray value={artworkData} navName="artStyle" navId={navId} />
    );
}

export default Result;
