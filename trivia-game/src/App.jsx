import React from 'react'

import './index.css'
import StartScreen from './StartScreen'
import QuestionSheet from './QuestionSheet';

function App() {

  const [game_progress, setGameProgress] = React.useState({'starting': true, 'playing': false}); 

  function startGame() {
    setGameProgress({'starting': false, 'playing': true})
    // changeHeight(true);
  }

  

  return (    
      <div className='main'>
        {game_progress.starting && <StartScreen handleClick={startGame}/>}
        {game_progress.playing && <QuestionSheet setGameProgress={setGameProgress}/>}
        <div className='blobs'></div>
        
        
      </div>
  )
}

export default App
