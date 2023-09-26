import React from "react";
import Question from "./Question";



function QuestionSheet(props) {

    const [questions_data, setQuestionsData] = React.useState([])
    // correct_choices is an array of 5 objects representing questions with 4 multiple choices. selected_choice is the index the user clicks on. isCorrect is if that index matches the index the correct_answer was placed in, i.e. if the user chose the correct answer.
    const [correct_choices, setCorrectChoices] = React.useState([
        {
            selected_choice: -1, 
            correct_choices: [false, false, false, false],
            isCorrect: false
        },
        {
            selected_choice: -1, 
            correct_choices: [false, false, false, false],
            isCorrect: false
        },
        {
            selected_choice: -1, 
            correct_choices: [false, false, false, false],
            isCorrect: false
        },
        {
            selected_choice: -1, 
            correct_choices: [false, false, false, false],
            isCorrect: false
        },
        {
            selected_choice: -1, 
            correct_choices: [false, false, false, false],
            isCorrect: false
        }
    ])
    const [num_points, setNumPoints] = React.useState(0);
    let question_elements = [<div></div>];
    // get 5 multiple choice Trivia Questions from api -> array of 5 objects. 
    getQuestions(); // get questions the first time this component loads. (as soon as Start game is clicked)
    function getQuestions() {
        React.useEffect(()=>{
            fetch('https://opentdb.com/api.php?amount=5&type=multiple')
            .then(res => res.json())
            .then(data => {
                setQuestionsData(data.results);
                // console.log(data);
            });
        }, []);
    }

    setQuestions();
    function setQuestions() {
        // create 5 <Question/> Components, passing in one question object from data per <Question/>
        question_elements = questions_data.map((question, index) => {
            return <Question key={index} data={question} question_num={index} setCorrectChoices={setCorrectChoices}/>
        })
    }
    

    // these state variables are used for conditional rendering of 'check answers', 'play again & you got x correct answers', 'you must answer all questions'
    let [has_been_checked, setHasBeenChecked] = React.useState(false);
    let [not_all_questions_answered,setNotAllQuestionsAnswered] = React.useState(false);
    // when Check Answers button is clicked, check each question, and then modify the classList of each choice based on if its correct. 
    function checkAnswers() {
        // console.log(correct_choices);
        setNumPoints(0);
        for (let q=0; q< 5; q++) {
            // q is question number
            // sanity check, if question has not been answered, selected_choice will still be -1, not 0,1,2,3.
            if (correct_choices[q].selected_choice === -1) {
                setHasBeenChecked(false);
                setNotAllQuestionsAnswered(true);
                break;
            }
            else {

                // if the wrong answer was selected, highlight the wrong choice in red.
                if (!correct_choices[q].isCorrect) {
                    document.getElementById(q+','+correct_choices[q].selected_choice+',label').classList.add('wrong-answer');
                }
                else {
                    // if the right answer was selected, increase number of points
                    // console.log(correct_choices[q])
                    setNumPoints((points) => {return points+1});
                    
                }

                for (let c=0; c<4; c++) {
                    // c is choice number
                    // id of label for each input, defined in <Question/> is 'q,c,label'
                    let question_choice_label = document.getElementById(q+','+c+',label');
                    // let question_choice_input = document.getElementById(q+','+c);
                    // if (question_choice_input.checked)
    
    
                    // highlight the correct multiple choice for each question in green.
                    if (correct_choices[q].correct_choices[c]) {
                        question_choice_label.classList.add('right-answer');
                    }
                    else {
                        //fade out all other choices that are not the correct one.
                        question_choice_label.classList.add('fade-answer');
                    }
                }
            }
            setNotAllQuestionsAnswered(false);
            setHasBeenChecked(true);
        }
    }

    // on play again, set the state variable in the parent component, so this component rerenders and new questions are generated.
    function playAgain() {
        props.setGameProgress({'starting': true, 'playing': false});
    }

    return (
        <div className="question-sheet">
            {question_elements}
            {not_all_questions_answered && <h4>You must answer all questions</h4>}
            {!has_been_checked && <button className='medium-btn' onClick={checkAnswers}>Check answers</button>}
            {(has_been_checked && !not_all_questions_answered) &&
            <div className="done-playing">
                <h4>You got {num_points}/5 correct answers</h4>
                <button className='medium-btn' onClick={playAgain}>Play again</button>
            </div>}
        </div>
    );
}
export default QuestionSheet;