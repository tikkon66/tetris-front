import { useEffect, useState } from "react"
import "./ActionButtons.css"
import CircleButton from "../shared/CircleButton/CircleButton";
import Form from "../Form/Form";

function ActionButtons({ openModal }: { openModal: () => void }) {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

    const [isForm, setIsForm] = useState(false)

    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem('theme', theme)
    }, [theme])

    return (
    <>
    {isForm && <Form closeModal={() => setIsForm(false)}/>}
        <div className="action-buttons">
            <CircleButton doThis={openModal} imgSrc="https://emojio.ru/images/apple-b/2754.png" imgAlt="Instruction" />

            <CircleButton doThis={() => setTheme(theme === "light" ? "dark" : "light")} imgSrc={theme === "light" ? "https://s1.iconbird.com/ico/2013/12/505/w450h4001385925286Moon.png" : "https://img.icons8.com/ios7/600/FFFFFF/sun--v2.png"} imgAlt="theme" />

            <CircleButton doThis={() => setIsForm(true)} imgSrc="https://www.pngarts.com/files/16/Entry-PNG-Pic-HQ.png" imgAlt="Authorization" />
        </div>
    </>
    )
}

export default ActionButtons