import { useState } from 'react'
import './App.css'
import ActionButtons from './components/ActionButtons/ActionButtons'
import GameInstruction from './components/GameInstruction/GameInstruction'
import MainPage from './components/MainPage/MainPage'
import NavBar from './components/NavBar/NavBar'
import LeaderList from './components/LeaderList/LeaderList'

function MainMenu() {
  const [instruction, setInstruction] = useState(false)
  const [isList, setIsList] = useState(false)

  return (
    <>
      <ActionButtons openModal={() => setInstruction(!instruction)} />
      {instruction && <GameInstruction close={() => setInstruction(!instruction)} />}

        <LeaderList isList={isList}/>
        <MainPage  isList={isList}/>

        <NavBar isList={isList} openList={() => setIsList(true)} closeList={() => setIsList(false)}/>
    </>
  )
}

export default MainMenu