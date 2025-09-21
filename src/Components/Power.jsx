
import "./Power.css";

const Power = ({ image, altText, content }) => {
    return (
        <div className="card-container">
            {image && (
                <div className="card-image">
                    <img src={image} alt={altText} className='flower' />
                </div>
            )}
            {content && (
                <div className="card-content">
                    <p>{content}</p>
                </div>
            )}
        </div>
    );
}

export default Power
