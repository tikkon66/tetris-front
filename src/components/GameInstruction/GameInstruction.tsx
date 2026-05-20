import { useEffect, useRef } from "react";
import "./GameInstruction.css"

function GameInstruction({ close }: { close: () => void }) {

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                close(); 
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [close]);

    return (
        <>
            <div className="fon">
                <div className="instruction-list" ref={modalRef}>
                    <div className="exit" onClick={close}>

                    </div>
                    <div className="instruction-wrapper">
                        <img src="https://cdn-icons-png.flaticon.com/512/25/25282.png" alt="up" />
                        <div>
                            <b>Кнопка вверх:</b>
                            <p>Поварачивет фигуру</p>
                        </div>
                    </div>
                    <div className="horizontal"></div>
                    <div className="instruction-wrapper">
                        <img src="https://images.icon-icons.com/934/PNG/512/left-arrow-black-circular-button_icon-icons.com_73001.png" alt="left" />
                        <div>
                            <b>Левая кнопка:</b>
                            <p>перемещает влево</p>
                        </div>
                    </div>
                    <div className="horizontal"></div>
                    <div className="instruction-wrapper">
                        <img src="https://cdn-icons-png.flaticon.com/512/1/1413.png" alt="right" />
                        <div>
                            <b>Правая кнопка:</b>
                            <p>перемещает вправо</p>
                        </div>
                    </div>
                    <div className="horizontal"></div>
                    <div className="instruction-wrapper">
                        <img src="https://cdn-icons-png.flaticon.com/512/9321/9321249.png" alt="down" />
                        <div>
                            <b>Кнопка вниз:</b>
                            <p>Ускоряет падение</p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default GameInstruction