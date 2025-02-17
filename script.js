const player_info = document.getElementById("player-information");
const startbtn = document.getElementById("start-btn");
const category_part = document.getElementById("category");
let player1NameInput = document.getElementById("player-input-1");
let player2NameInput = document.getElementById("player-input-2");
let tagname;

let player1Name = "";
let player2Name = "";

let Score = { player1Score: 0, player2Score: 0 };

startbtn.addEventListener("click", () => {
    player1Name = player1NameInput.value;
    console.log(player1Name);

    player2Name = player2NameInput.value;
    console.log(player2Name);

    category();
});

function category() {
    if (player1Name === "" || player2Name === "") {
        alert("please enter your name..!!");
    } else {
        player_info.style.display = "none";
        category_part.style.display = "block";
    }
}

const categoryOptions = document.getElementById("category-options");
const submitbtn = document.getElementById("submit-btn");
const question_part = document.getElementById("question");

const playername1 = document.getElementById("player-1-name");
const playername2 = document.getElementById("player-2-name");

let questionText = document.getElementById("question-Text");

submitbtn.addEventListener("click", question);

async function question() {
    let finalQuestion = [];

    let selectedOption = categoryOptions.value;
    console.log(selectedOption);
    categoryOptions.querySelectorAll("option").forEach((option) => {
        if (option.value === selectedOption) {
            tagname = document.querySelector(`option[value="${selectedOption}"]`);
            console.log(tagname);
        }
    });

    difficulties = ["easy", "medium", "hard"];

    for (let i = 0; i < difficulties.length; i++) {
        const response = await fetch(
            `https://the-trivia-api.com/v2/questions?categories=${selectedOption}&limit=${2}&difficulties=${difficulties[i]
            }`
        );
        const question = await response.json();
        console.log(question);
        finalQuestion.push(...question);
    }

    console.log(finalQuestion);

    renderQuestionAnsValidation(finalQuestion);

    category_part.style.display = "none";
    question_part.style.display = "block";
}

function renderQuestionAnsValidation(finalQuestion) {
    let index = 0;
    let currentPlayer = player1Name;

    renderCurrentQuestion();

    function renderCurrentQuestion() {
        if (index >= finalQuestion.length) {
            alert("Game over for this category!");
            displayFinalScores();
            return;
        }

        const currentQuestion = finalQuestion[index];
        renderQuestion(currentQuestion);
        renderOptions(currentQuestion);

        playername1.textContent = player1Name;
        console.log(playername1);
        playername2.textContent = player2Name;
        console.log(playername2);
    }

    function renderQuestion(currentQuestion) {
        questionText.textContent = currentQuestion.question.text;
    }

    function renderOptions(currentQuestion) {
        const options = document.getElementById("options");
        options.innerHTML = "";

        const allAnswers = [
            ...currentQuestion.incorrectAnswers,
            currentQuestion.correctAnswer,
        ];
        console.log(allAnswers);

        const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
        console.log(shuffledAnswers);

        for (let i = 0; i < shuffledAnswers.length; i++) {
            const answer = shuffledAnswers[i];
            const button = document.createElement("button");
            button.textContent = answer;
            // console.log(answer);

            button.addEventListener("click", () => {
                verifyAnswer(answer, currentQuestion.correctAnswer);
            });

            options.appendChild(button);
        }
    }

    function verifyAnswer(answer, correctAnswer) {
        console.log("Selected Answer:", answer);
        console.log("Correct Answer:", correctAnswer);

        if (answer === correctAnswer) {
            alert("Correct!");
            if (currentPlayer === player1Name) {
                Score.player1Score += calculateScore(finalQuestion[index].difficulty);
            } else {
                Score.player2Score += calculateScore(finalQuestion[index].difficulty);
            }
        } else {
            alert("Incorrect!");
        }

        console.log("Updated Scores:", Score);

        currentPlayer = currentPlayer === player1Name ? player2Name : player1Name;
        console.log(currentPlayer);

        index++;
        renderCurrentQuestion();
    }

    function calculateScore(difficulty) {
        switch (difficulty) {
            case "easy":
                return 10;
            case "medium":
                return 20;
            case "hard":
                return 30;
            default:
                return 0;
        }
    }

    let resultSection = document.getElementById("result-section");
    let resultText = document.getElementById("result-text");
    let playAgainButton = document.getElementById("play-again");

    function displayFinalScores() {
        question_part.style.display = "none";
        resultSection.style.display = "block";

        if (Score.player1Score > Score.player2Score) {
            resultText.textContent = `${player1Name} wins with ${Score.player1Score} points!`;
        } else if (Score.player2Score > Score.player1Score) {
            resultText.textContent = `${player2Name} wins with ${Score.player2Score} points!`;
        } else {
            resultText.textContent = `It's a tie! Both scored ${Score.player1Score} points.`;
        }
    }

    playAgainButton.addEventListener("click", () => {
        finalQuestion = [];
        resultSection.style.display = "none";
        category_part.style.display = "block";
        tagname.remove();
    });

    const exitButton = document.getElementById("Exit");
    exitButton.addEventListener("click", () => {
        resultSection.style.display = "none";
    });
}
