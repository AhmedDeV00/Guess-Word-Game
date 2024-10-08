// Setting GAme Name 
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game created By Ahmed Benhenda `;

//Setting Game Option 
let numberOfTries = 6;
let numberOfLetters = 6;
let currntTry = 1;
let numberOfHints = 2;

// Manage Hints

document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButtom = document.querySelector(".hint");
getHintButtom.addEventListener("click", getHint);

// Manage Words
let wordToGuess = "";
const words = ["Create", "Update", "Master", "Branch", "Mainly", "Khalil", "School", "paypal", "google"];
// This code selects a random word from the  words array and converts it to lower 
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
console.log(wordToGuess);

let messageArea = document.querySelector(".message");

function generateInput() {
    const inputsContainer = document.querySelector(".inputs");

    // Create main try Div
    for (let i = 1; i <= numberOfTries; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;

        if (i !== 1) {
            tryDiv.classList.add("disabled-inputs");
        }

        // Create input
        for (let j = 1; j <= numberOfLetters; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1");
            tryDiv.appendChild(input);

        }

        inputsContainer.appendChild(tryDiv);
    }
    inputsContainer.children[0].children[1].focus();

    // Disable All inputs excepts One
    const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    inputsInDisabledDiv.forEach((input) => (input.disabled = true))

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        // Convert Input To UpperCase
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
            // tranfert to next input when the first input is not empty
            const nextInput = inputs[index + 1];
            if (nextInput) nextInput.focus();



        });
        input.addEventListener("keydown", function (event) {
            const currentIndex = Array.from(inputs).indexOf(event.target);// Or this
            if (event.key === "ArrowRight") {
                const nextInput = currentIndex + 1;
                if (nextInput < inputs.length) inputs[nextInput].focus();
            }
            if (event.key === "ArrowLeft") {
                const prevInput = currentIndex - 1;
                if (prevInput >= 0) inputs[prevInput].focus();
            }

        })
    })
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener('click', handleGuesses);

function handleGuesses() {
    let successGuess = true;
    for (let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currntTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];

        // Game Logic
        if (letter === actualLetter) {
            // letter is correct and in right place
            inputField.classList.add("in-place");
        } else if (wordToGuess.includes(letter) && letter !== "") {
            // letter is correct but in not right place
            inputField.classList.add("not-in-place");
            successGuess = false;
        } else {
            inputField.classList.add("no");
            successGuess = false;
        }
    }
    // Check If User Win Or Lose
    if (successGuess) {
        messageArea.innerHTML = ` You Win The Word is <span>${wordToGuess}</span>`;
        if (numberOfHints === 2) {
            messageArea.innerHTML = `<p>Congratz you didn't use hints</p>`
        }

        // Disable All Inputs // Add Disabled class on All Try Divs
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
        // disable also button(check)
        guessButton.disabled = true;
        getHintButtom.disabled = true;

    } else {
        document.querySelector(`.try-${currntTry}`).classList.add("disabled-inputs");
        const currentTryInputs = document.querySelectorAll(`.try-${currntTry} input`);
        currentTryInputs.forEach((input) => (input.disabled = true));

        currntTry++;


        const nextTryInputs = document.querySelectorAll(`.try-${currntTry} input`);
        nextTryInputs.forEach((input) => (input.disabled = false));

        let el = document.querySelector(`.try-${currntTry}`);
        if (el) {
            document.querySelector(`.try-${currntTry}`).classList.remove("disabled-inputs");
            el.children[1].focus();
        } else {

            // disable also button(check)
            guessButton.disabled = true;
            getHintButtom.disabled = true;
            messageArea.innerHTML = ` You Lose The Word is  <span>${wordToGuess}</span>`;
        }
    }

}

function getHint() {
    if (numberOfHints > 0) {
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;
    }
    if (numberOfHints === 0) {
        getHintButtom.disabled = true;
    }

    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    // console.log(enabledInputs);
    // filtrage all inputs to empty inpuuts with method filter()
    const emptyEanbledInputs = Array.from(enabledInputs).filter((input) => input.value === "");
    // console.log(emptyEanbledInputs);

    if (emptyEanbledInputs.length > 0) {
        // select a random index 
        const randomIndex = Math.floor(Math.random() * emptyEanbledInputs.length);
        // select a random input with random index
        const randomInput = emptyEanbledInputs[randomIndex];
        // normalerweise select index of random input 
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        // console.log(randomIndex);
        // console.log(randomInput);
        // console.log(indexToFill);
        if (indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }
}

function handleBackSpace(event) {
    if (event.key === "Backspace") {
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        if (currentIndex > 0) {
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];
            currentInput.value = "";
            prevInput.value = "";
            prevInput.focus();

        }
    }
}
document.addEventListener("keydown", handleBackSpace);

window.onload = function () {
    generateInput();
};