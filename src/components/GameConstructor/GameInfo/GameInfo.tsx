import { useState } from 'react';
import CircleButton from '../../shared/CircleButton/CircleButton'
import './GameInfo.css'

interface InfoProps {
    openMenu: () => void;
    stopMusic: () => void;
}
function GameInfo({ openMenu, stopMusic}: InfoProps) {

    const[isMusic, setIsMusic] = useState(true)

    return (
        <>
            <div>
                <div className='score'>
                    <CircleButton doThis={openMenu} imgSrc="https://cdn-icons-png.flaticon.com/512/85/85622.png" imgAlt="pause" />
                    <CircleButton doThis={() => {stopMusic(); setIsMusic(!isMusic)}} imgSrc={isMusic ? "https://cdn-icons-png.flaticon.com/512/95/95021.png" : "https://cdn-icons-png.flaticon.com/512/54/54309.png"} imgAlt="music" />
                </div>
            </div>
        </>
    )
}

export default GameInfo
