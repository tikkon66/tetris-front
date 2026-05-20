import './CircleButton.css'

interface ButtonProps {
    doThis: () => void;
    imgSrc: string;
    imgAlt: string;
}

function CircleButton({ doThis,imgSrc, imgAlt }: ButtonProps) {

  return (
    <>
            <div className="action-button" onClick={doThis}>
                <img src={imgSrc} alt={imgAlt} />
            </div>
    </>
  )
}

export default CircleButton