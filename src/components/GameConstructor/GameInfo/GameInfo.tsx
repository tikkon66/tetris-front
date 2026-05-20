import CircleButton from '../../shared/CircleButton/CircleButton'
import './GameInfo.css'

interface InfoProps {
    openMenu: () => void;
}
function GameInfo({ openMenu}: InfoProps) {

    return (
        <>
            <div>
                <div className='score'>
                    <CircleButton doThis={openMenu} imgSrc="https://cdn-icons-png.flaticon.com/512/85/85622.png" imgAlt="pause" />
                </div>
            </div>
        </>
    )
}

export default GameInfo
