import { useEffect, useState } from "react"
import "./MainPage.css"
import { Link } from 'react-router-dom';
import Button from "../shared/Button/Button";

function MainPage({ isList }: { isList: boolean }) {
    const [name, setName] = useState("")
    const [inputValue, setInputValue] = useState("");
    const [score, setScore] = useState("$$")

    async function getScore() {
        const token = localStorage.getItem("token");

        const response = await fetch(`${import.meta.env.VITE_API_URL}/score/getscore`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        console.log(data.score);

        setScore(data.score)
    }

    async function getNick() {

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_API_URL}/score/getnick`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            console.log(data, "eeeee");

            setName(data.nickname)

        }
        catch (err) {
            console.log("getNick :", err);
        }
    }


    useEffect(() => {
        getNick();
        getScore()
    }, []);


    async function changeNickname(nick: string) {
        const token = localStorage.getItem("token");

        const response = await fetch(`${import.meta.env.VITE_API_URL}/score/nickname`, {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
                nickname: nick,
            }),
        });

        const data = await response.json();

        console.log(data);
        alert("Nick was changed at " + inputValue)
    }




    return (
        <>
            <div className="main-wrapper" style={{ display: isList ? 'none' : 'flex' }} >

                <img src="https://upload.wikimedia.org/wikipedia/commons/4/46/Tetris_logo.png" alt="tetris" />
                <div className="main-info">
                    <div className="info-name">
                        <input type="text" placeholder={"Your name: " + name} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />

                        <Button doThis={() => { changeNickname(inputValue); setName(inputValue); setInputValue("") }} text="change name" />
                    </div>
                    <div className="name-wrapper">Your best score: {score}</div>

                    <Link to="/game" style={{ textDecoration: 'none', color: 'var(--text-h)' }}>
                        <button className="play-button">PLAY!</button>
                    </Link>


                </div>


            </div >
        </>
    )
}

export default MainPage