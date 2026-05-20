import './Button.css'

interface ButtonProps {
    doThis: () => void;
    text: string;
}

function Button({ doThis, text }: ButtonProps) {

    return (
        <>
            <button className="name-button" onClick={doThis}>
                {text}
            </button>

        </>
    )
}

export default Button