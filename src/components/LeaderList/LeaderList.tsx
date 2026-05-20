import { useEffect, useState } from "react";
import "./LeaderList.css"

function LeaderList({ isList }: { isList: boolean }) {
    type LeaderboardItem = {
        nickname: string;
        score: number;
        created_at: string;
    };
    const [leaders, setLeaders] = useState<LeaderboardItem[]>([]);

    async function getLeaderboard() {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/score/leaderboard`);

        const data = await response.json();
        setLeaders(data)
        console.log("d", data);
    }
    useEffect(() => {
        getLeaderboard().then((e) => {
            console.log("score:", leaders);
        });
    }, []);


    return (
        <>
            <div className="leader-list" style={{ display: !isList ? 'none' : 'flex' }} >
                <div className="leader">
                    <div className="leader-name">Nick</div>
                    <div className="vertical"></div>
                    <div className="leader-score">Score</div>
                    <div className="vertical"></div>
                    <div className="score-date">Reached</div>
                </div>
                <div className="horizontal"></div>
                {leaders.map((item, index) => (
                    <div key={index}>
                        <div className="leader">
                            <div className="leader-name">{item?.nickname}</div>
                            <div className="vertical"></div>
                            <div className="leader-score">{item?.score}</div>
                            <div className="vertical"></div>
                            <div className="score-date">{new Date(item?.created_at).toLocaleString()}</div>
                        </div>
                        <div className="horizontal"></div>

                    </div>
                ))}
            </div>
        </>
    )
}

export default LeaderList