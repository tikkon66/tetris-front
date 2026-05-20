import { useEffect, useRef, useState } from "react";
import Button from "../../shared/Button/Button";
import { Link } from "react-router-dom";
import '../GameConstructor.css'
import GameInfo from "../GameInfo/GameInfo";

type Cell = string | null;

type PieceType = "I" | "O" | "T" | "L" | "J" | "S" | "Z";

interface Piece {
    shape: number[][];
    type: PieceType;
    x: number;
    y: number;
}

interface TetrisProps {
    onScoreChange?: (score: number) => void;
    onGameOver?: (score: number) => void;
}


const COLS = 10;
const ROWS = 17;

const COLORS: Record<PieceType, string> = {
    I: "#00e5ff",
    O: "#ffe600",
    T: "#b400ff",
    L: "#ff8800",
    J: "#0044ff",
    S: "#00ff66",
    Z: "#ff0033",
};

const SHAPES: Record<PieceType, number[][]> = {
    I: [[1, 1, 1, 1]],
    O: [
        [1, 1],
        [1, 1],
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
    ],
    L: [
        [1, 0],
        [1, 0],
        [1, 1],
    ],
    J: [
        [0, 1],
        [0, 1],
        [1, 1],
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
    ],
};

function randomPiece(): Piece {
    const keys = Object.keys(SHAPES) as PieceType[];
    const type = keys[Math.floor(Math.random() * keys.length)];

    return {
        type,
        shape: SHAPES[type],
        x: 3,
        y: 0,
    };
}

function rotate(shape: number[][]) {
    return shape[0].map((_, index) =>
        shape.map((row) => row[index]).reverse()
    );
}

export default function Tetris({
    onScoreChange,
    onGameOver,
}: TetrisProps) {

    async function saveScore() {
        const token = localStorage.getItem("token");


        const response = await fetch(`${import.meta.env.VITE_API_URL}/score/updatescore`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
                score,
            }),
        });

        const data = await response.json();

        console.log(data);
    }


    function useWindowSize() {
        const [size, setSize] = useState({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        useEffect(() => {
            function onResize() {
                setSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }

            window.addEventListener("resize", onResize);
            return () => window.removeEventListener("resize", onResize);
        }, []);

        return size;
    }

    const { width, height } = useWindowSize();
    const theme = localStorage.getItem("theme")

    const BLOCK = width > 1000 ? 40 : 23;
    const miniBlock = width > 1000 ? 40 : 15;
    const defaultColor = theme == "light" ? "#dadada": "#1a1a1a";

    interface MenuProps {
        isMenu: boolean;
        closeMenu: () => void;
        saveScore: () => void;
    }
    const [isMenu, setIsMenu] = useState(false)
    function InfoMenu({ isMenu, closeMenu, saveScore }: MenuProps) {

        return (
            <>
                <div className={`fon button ${!isMenu ? 'none' : ''}`} >
                    <div className="menu-wrapper" >
                        <div className="menu-list">
                            <Button doThis={closeMenu} text="Continue" />
                            <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-h)' }} onClick={saveScore}>
                                <Button doThis={() => 1 + 1} text="Main-menu" />
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        )
    }



    const [board, setBoard] = useState<Cell[][]>(
        Array.from({ length: ROWS }, () => Array(COLS).fill(null))
    );

    const [piece, setPiece] = useState(randomPiece());
    const [nextPiece, setNextPiece] = useState(randomPiece());

    const [score, setScore] = useState(0);
    const [paused, setPaused] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    function collision(
        newX: number,
        newY: number,
        shape: number[][]
    ) {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (!shape[y][x]) continue;

                const boardX = newX + x;
                const boardY = newY + y;

                if (
                    boardX < 0 ||
                    boardX >= COLS ||
                    boardY >= ROWS
                ) {
                    return true;
                }

                if (boardY >= 0 && board[boardY][boardX]) {
                    return true;
                }
            }
        }

        return false;
    }


    function resetGame() {
        setBoard(
            Array.from({ length: ROWS }, () =>
                Array(COLS).fill(null)
            )
        );

        setPiece(randomPiece());
        setNextPiece(randomPiece());
        setScore(0);
        setGameOver(false);
        setPaused(false);
    }

    // ---------- merge ----------
    function mergePiece() {
        const copy = board.map((row) => [...row]);

        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    copy[piece.y + y][piece.x + x] = COLORS[piece.type];
                }
            });
        });

        let cleared = 0;

        const filtered = copy.filter((row) => {
            const full = row.every(Boolean);

            if (full) cleared++;

            return !full;
        });

        while (filtered.length < ROWS) {
            filtered.unshift(Array(COLS).fill(null));
        }

        if (cleared > 0) {
            const newScore = score + cleared * 100;

            setScore(newScore);
            onScoreChange?.(newScore);
        }

        setBoard(filtered);

        const newPiece = nextPiece;
        const next = randomPiece();

        setPiece({
            ...newPiece,
            x: 3,
            y: 0,
        });

        setNextPiece(next);

        if (collision(3, 0, newPiece.shape)) {
            saveScore()
            setGameOver(true);
            onGameOver?.(score);
        }
    }

    // ---------- move ----------
    function move(dx: number) {
        if (
            !collision(piece.x + dx, piece.y, piece.shape)
        ) {
            setPiece((prev) => ({
                ...prev,
                x: prev.x + dx,
            }));
        }
    }

    function drop() {
        if (
            !collision(piece.x, piece.y + 1, piece.shape)
        ) {
            setPiece((prev) => ({
                ...prev,
                y: prev.y + 1,
            }));
        } else {
            mergePiece();
        }
    }

    function rotatePiece() {
        const rotated = rotate(piece.shape);

        if (!collision(piece.x, piece.y, rotated)) {
            setPiece((prev) => ({
                ...prev,
                shape: rotated,
            }));
        }
    }

    // ---------- keyboard ----------
    useEffect(() => {
        function handle(e: KeyboardEvent) {
            if (paused || gameOver) return;

            if (e.key === "ArrowLeft") move(-1);
            if (e.key === "ArrowRight") move(1);
            if (e.key === "ArrowDown") drop();
            if (e.key === "ArrowUp") rotatePiece();
        }

        window.addEventListener("keydown", handle);

        return () =>
            window.removeEventListener("keydown", handle);
    });

    // ---------- game loop ----------
    useEffect(() => {
        if (paused || gameOver) return;

        intervalRef.current = setInterval(() => {
            drop();
        }, 450);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    });


    return (
        <div className="tetris-wrapper"
            style={{
                paddingLeft: 10,
                paddingRight: 10,
                boxSizing: "border-box",
                display: "flex",
                color: "white",
                fontFamily: "sans-serif",
            }}
        >
            <div >
                {/* BOARD */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${COLS}, ${BLOCK}px)`,
                        background: defaultColor,
                        border: "3px solid #333",
                    }}
                >
                    {board.map((row, y) =>
                        row.map((cell, x) => {
                            let color = cell;

                            piece.shape.forEach((r, py) => {
                                r.forEach((value, px) => {
                                    if (
                                        value &&
                                        piece.x + px === x &&
                                        piece.y + py === y
                                    ) {
                                        color = COLORS[piece.type];
                                    }
                                });
                            });

                            return (
                                <div
                                    key={`${x}-${y}`}

                                    style={{
                                        width: BLOCK,
                                        height: BLOCK,
                                        outline: "3px solid #313131d2",
                                        background: color || defaultColor,
                                    }}
                                />
                            );
                        })
                    )}
                </div>

                <div className="mobile"
                    style={{
                        flexDirection: "column",
                        gap: 10,
                        userSelect: "none",
                    }}
                >
                    <button
                        onClick={rotatePiece}
                        style={{ padding: 15 }}
                    >
                        ⬆ rotate
                    </button>

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <button
                            onClick={() => move(-1)}
                            style={{ padding: 15 }}
                        >
                            ⬅ left
                        </button>

                        <button
                            onTouchStart={drop}
                            onMouseDown={drop}
                            style={{ padding: 15 }}
                        >
                            ⬇ down
                        </button>

                        <button
                            onClick={() => move(1)}
                            style={{ padding: 15 }}
                        >
                            ➡ right
                        </button>
                    </div>
                </div>

            </div>


            {/* UI */}
            <div className="info">

                <GameInfo openMenu={() => { setIsMenu(true); setPaused(true) }} />

                <InfoMenu isMenu={isMenu} closeMenu={() => { setIsMenu(false); setPaused(false) }} saveScore={saveScore} />

                <div>
                    <h3 style={{ lineHeight: 0.51 }}>Next figure:</h3>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(4, ${miniBlock}px)`,
                            gap: 2,
                            marginBottom: 10,
                        }}
                    >
                        {Array.from({ length: 16 }).map((_, i) => {
                            const x = i % 4;
                            const y = Math.floor(i / 4);

                            let filled = false;

                            nextPiece.shape.forEach((row, py) => {
                                row.forEach((v, px) => {
                                    if (v && px === x && py === y) {
                                        filled = true;
                                    }
                                });
                            });

                            return (
                                <div
                                    key={i}
                                    style={{
                                        width: miniBlock,
                                        height: miniBlock,
                                        outline: "3px solid #313131d2",
                                        background: filled
                                            ? COLORS[nextPiece.type]
                                            : defaultColor,
                                    }}
                                />
                            );
                        })}
                    </div>

                </div>
                <h2>score: {score}</h2>

                {gameOver && (
                    <div className="fon">
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <h2 style={{ color: "red" }}>
                                GAME OVER
                            </h2>
                            <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-h)' }}>
                                <Button doThis={() => 1 + 1} text="Main-menu" />
                            </Link>
                            <Button doThis={resetGame} text="Try again" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}