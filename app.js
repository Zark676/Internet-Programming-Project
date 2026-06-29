const form = document.getElementById("searchForm");
const categoryInput = document.getElementById("categoryInput");
const resultsDiv = document.getElementById("results");
const statusDiv = document.getElementById("status");
const difficultyFilter = document.getElementById("difficultyFilter");
const sortBtn = document.getElementById("sortBtn");
let triviaData = [];

const categories = {general: 9, books: 10, film: 11, music: 12, tv: 14,
 games: 15, boardGames: 16, science: 17, computers: 18, math: 19, myth: 20, sports: 21,
 geography: 22, history: 23, politics: 24, art: 25, celebrities: 26,  animals: 27,
vehicles: 28, comics: 29, gadgets: 30, anime: 31, cartoon: 32};

// Form submit event
form.addEventListener("submit",async(event) => {
    event.preventDefault();
    const categoryName = categoryInput.value;

    await fetchTrivia(categories[categoryName]);
});

async function fetchTrivia(categoryId) {
    try {
        statusDiv.textContent = "Now loading...";
        resultsDiv.innerHTML = "";
        const response =await fetch(
            `https://opentdb.com/api.php?amount=50&category=${categoryId}`
        );
        if (!response.ok) {
            throw new Error("Could not fetch data");
        }
        const data = await response.json();
        triviaData = data.results;
       statusDiv.textContent= "";
        displayTrivia();

    }catch (error){
        statusDiv.textContent="Could not get trivia questions";
        console.error(error);
    }
}

difficultyFilter.addEventListener("change",() => {
    displayTrivia();
});

function decodeHTML(text) {
    const txt = document.createElement("textarea");
    txt.innerHTML = text;
    return txt.value;
}

sortBtn.addEventListener("click", () => {
    triviaData.sort((a, b) => {
        const first = decodeHTML(a.question).toLowerCase();
        const second = decodeHTML(b.question).toLowerCase();
        return first.localeCompare(second);
    });

    displayTrivia();
});

function displayTrivia() {
    resultsDiv.innerHTML = "";
    let filteredData = triviaData;
    const selectedDifficulty = difficultyFilter.value;
    if (selectedDifficulty !== "all") {
        filteredData = triviaData.filter(
            question => question.difficulty === selectedDifficulty
        );
    }

    filteredData.forEach(question => {
        const card = document.createElement("div");
        card.classList.add("card");
        const title = document.createElement("h3");
        title.innerHTML = question.question;
        const difficulty = document.createElement("p");
        difficulty.textContent =`Difficulty: ${question.difficulty}`;
        const category = document.createElement("p");
        category.textContent = `Category: ${question.category}`;

        card.appendChild(title);
        card.appendChild(category);
        card.appendChild(difficulty);

        const answers = [
            question.correct_answer,
            ...question.incorrect_answers
        ];
        answers.sort(() => Math.random() - 0.5);
        const answersDiv = document.createElement("div");
        answersDiv.classList.add("answers");
        answers.forEach(answer => {
            const answerBtn= document.createElement("button");
            answerBtn.innerHTML= answer;
            answerBtn.addEventListener("click", () => {

                const buttons = answersDiv.querySelectorAll("button");
                buttons.forEach(btn => {
                    btn.disabled = true;

                    if(btn.innerHTML === question.correct_answer){
                        btn.classList.add("correct");
                    }
                });

                if (answer !== question.correct_answer){
                    answerBtn.classList.add("wrong");
                }

            });
        answersDiv.appendChild(answerBtn);

        });
        card.appendChild(answersDiv);
        resultsDiv.appendChild(card);

    });
}