import "./NavBar.css"
interface NavBarProps {
 isList: boolean;
  openList: () => void; 
  closeList: () => void;      
}

function NavBar({isList, openList, closeList} : NavBarProps) {

    return (
        <div className="nav">
            <div className={`nav-button ${!isList ? 'choosed' : ''}`} onClick={closeList} >
                <img src="https://cdn-icons-png.flaticon.com/512/18/18625.png" alt="Main" />
            </div>

            <div className={`nav-button ${isList ? 'choosed' : ''}`} onClick={openList}>
                <img src="https://cdn-icons-png.flaticon.com/512/570/570170.png" alt="Leaders-list" />
            </div>
        </div>
    )
}

export default NavBar