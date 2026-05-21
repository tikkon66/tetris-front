import { useState } from "react";
import Button from "../shared/Button/Button";
import "./Form.css"

export default function Form({ closeModal }: { closeModal: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");

    async function register() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    email,
                    password,
                    nickname,
                }),
            });

            const data = await response.json();

            console.log(data);

            localStorage.setItem("token", data.token);
            closeModal()
        }
        catch(err) {
            alert("This email is taken!")
        }
    }

    async function login() {
        try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        console.log(data);

        localStorage.setItem("token", data.token);
            closeModal()
        }
        catch(err) {
            alert("The email or password is wrong!")
        }
    }

    return (
        <div className="fon">

            <div className="form">
                <div className="exit" onClick={closeModal}></div>
                <b>Authorization</b>
                <br />

                <input
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br />

                <input
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br />

                <input
                    placeholder="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />

                <br />

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Button doThis={register} text="Register" />

                    <Button doThis={login} text="Login" />

                </div>

                <hr />


            </div>


            {/* <button onClick={saveScore}>Save score</button>

            <button onClick={getLeaderboard}>Leaderboard</button>

            <button onClick={changeNickname}>Change nickname</button> */}
        </div>
    );
}