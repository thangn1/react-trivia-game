import React from "react";
import {decode} from 'html-entities';

function Question(props) {
    /*
    props.data = {
        category : "Science: Computers",
        correct_answer : "Amazon",
        difficulty : "medium",
        incorrect_answers : (3) ['eBay', 'Overstock', 'Shopify'],
        question : "Which internet company began life as an online bookstore called &#039;Cadabra&#039;?",
        type : "multiple" 
    }
    props.question_num = 0, 1, 2, or 3 // referring to the question number
    */
    
    // choices_array = list of answers from api with correct_answer randomly placed in this array. used to populate radio choices
    // correct_index is the index that the correct_answer was placed into
    // boolean_choices is an array of 4 booleans, with all being false, except for the correct_index which is true
    // const [choices_array, correct_index, boolean_choices] = assembleChoices();
    const [choices_array, setChoicesArray] = React.useState([]);
    const [correct_index, setCorrectIndex] = React.useState(-1);
    const [correct_booleans, setCorrectBooleans] = React.useState([]) 

    // assemble an array of 4 choices, with the correct_answer randomly placed in the array.
  
    React.useEffect(assembleChoices, []);
    
    function assembleChoices() {

        let boolean_choices = [false, false, false, false];
        let random_choices = ['','','',''];
        // generate a random index from 0 to 3 to place the correct answer.
        // fill that index in random_choices with the correct answer
        // fill that index in boolean_choices with true
        const random_index = Math.floor(Math.random()*4); 
        random_choices[random_index] = decode(props.data.correct_answer);
        boolean_choices[random_index] = true;
        // place the incorrect answers in all the other spots in the random_choices array.
        let j=0; 
        for (let i=0; i< 4; i++) {
            if (i !== random_index) {
                random_choices[i] = decode(props.data.incorrect_answers[j]);
                j++;
            }
        }
        // console.log(random_choices);
        // return [random_choices, random_index, boolean_choices];
        setChoicesArray(random_choices);
        setCorrectIndex(random_index);
        setCorrectBooleans(boolean_choices);
    }
    

    // onChange for radio buttons, set state variable 
    function changeChoice(event) {
        event.stopPropagation();
        const chosen_index = Number(event.target.value);

        // console.log(choices_array);
        // if the second choice was the correct choice, {correct_choirces: [false, true, false, false]}
        // selected_choice is the index (0,1,2,3) that the user selected from the radio_choices
        props.setCorrectChoices((correct_choices) => {
            
            return correct_choices.map(((choice_data, question_index) => {
                if (question_index === props.question_num) {
                    return {
                        selected_choice: chosen_index,
                        correct_choices: correct_booleans,
                        isCorrect: chosen_index === correct_index
                    }
                }
                else {
                    return choice_data;
                }
            }));
            // return correct_choices;
        });
    }

    // generate 4 radio inputs with the label containing a multiple choice answer
    const radio_choices = choices_array.map((choice,index) => {
        return <div className="choice" key={index}>
                    <input 
                        id={props.question_num+','+index} 
                        type='radio' 
                        name='multiple-choice' 
                        onChange={changeChoice} 
                        value={index}></input>
                    <label htmlFor={props.question_num+','+index} id={props.question_num+','+index+',label'}>{choice}</label>
                </div>
    });

    // display one star for easy, two stars for medium, three stars for hard
    let star_difficulty = '';
    if (props.data.difficulty == 'easy') {
        star_difficulty = '☆'
    }
    else if (props.data.difficulty == 'medium') {
        star_difficulty = '☆☆'
    }
    else if (props.data.difficulty == 'hard') {
        star_difficulty = '☆☆☆'
    }
    return (
        <div className="question">
            <h3><span className="category" >{star_difficulty}&nbsp;&nbsp;&nbsp;({decode(props.data.category)})</span> {decode(props.data.question)}</h3>
            <form>
                {radio_choices}
            </form>
        </div>
    );
}
export default Question;