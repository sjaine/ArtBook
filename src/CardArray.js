import './CardArray.css';
import Card from './Card';

function CardArray() {
    const cards = Array.from({ length: 12 });

    return (
        <div className="card-list">
            {cards.map((_, index) => (
                <Card key={index} />
            ))}
        </div>
    );
}

export default CardArray;