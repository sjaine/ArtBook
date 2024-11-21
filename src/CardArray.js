import React, { useState } from 'react';
import Card from './Card';
import Nav from './Nav';
import Menu from './Menu';
// import { useNavigate } from 'react-router-dom';

function CardArray({ userId }) {
    // const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const objectIds = [51170, 466105, 450748, 503651, 78190, 202996, 437658, 459246, 544442, 469858, 10464, 257875]; 
    
    console.log("userId is: " + userId);

    return (
        <div>
            <Nav onMenuToggle={toggleMenu} />
            {isMenuOpen && <Menu userId={userId} onMenuToggle={toggleMenu}  />}
            <div className="wrapper">
                {/* https://njirumwai.hashnode.dev/react-router-6-go-back-how-to-go-back-using-react-router-v6 */}
                <div className="previousCard">
                    <div className="previousText">Pick an <span>art style</span> that catches your eyes 👀</div> 
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