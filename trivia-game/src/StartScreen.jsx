import React from "react";

function StartScreen(props) {
    return (
        <div className='start-screen'>
            <h1>Quizzical</h1>
            <h2>Randomly Generated Trivia Questions</h2>
            <button onClick={props.handleClick}>Start Quiz</button>
        </div>
    );
}
export default StartScreen;