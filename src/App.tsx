import './App.css'
import GameConstructor from './components/GameConstructor/GameConstructor';
import MainMenu from './MainMenu'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainMenu/>}/>
          <Route path='/game' element={<GameConstructor/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
