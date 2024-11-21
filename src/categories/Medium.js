import ResultArray from './ResultArray';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Result({ userId }) {
    // https://reactrouter.com/en/main/hooks/use-search-params
    // https://developer.mozilla.org/en-US/docs/Web/API/Location/search
    // Utilize useSearchParams from React Router DOM as the search parameter for the API
    const [searchParams] = useSearchParams();
    const idParam = searchParams.get('id');
    const categoryParam = searchParams.get('category');
    const [artworkData, setArtworkData] = useState([]);
    const [navId, setnavId] = useState("");

    useEffect(() => {
        setnavId(idParam);
    }, [idParam]);

    useEffect(() => {
        if (idParam && categoryParam) {
            fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${idParam}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
    
                    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isOnView=true&q=${categoryParam}`)
                        .then(response => response.json())
                        .then(searchData => {
                            // Check if objectIDs exist, then filter out objectID 78870
                            if (searchData.objectIDs) {
                                const filteredIDs = searchData.objectIDs.filter(id => id !== 78870);
                                // Update state with the filtered objectIDs
                                setArtworkData(filteredIDs);
                            }
                        })
                        .catch(error => console.log(error));
                })
                .catch(error => console.log(error));
        }
    }, [idParam, categoryParam]);
        
    return (
        <ResultArray value={artworkData} navName="medium" navId={navId} userId={userId} />
    );
}

export default Result;
