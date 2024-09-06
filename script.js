const questions = [
  {
    id: 1,
    question: "Who is the Strongest Hashira?",
    questionType: "MULTIPLE_CHOICE",
    answers: [
      {text: "Gyomei", correct: true},
      {text: "Sanemi", correct: false},
      {text: "Giyuu", correct: false},
      {text: "Muichiro", correct: false}
    ]
  },
  {
    id: 2,
    question: "Who killed Rengoku?",
    questionType: "TEXT",
    answers: [
        {text: "Akaza", correct: true}
    ]
},
{
    id: 3,
    question: "Who can use Sun Breathing?",
    questionType: "CHECKBOX",
    answers: [
        {text: "Nezuko", correct: false},
        {text: "Shinobu", correct: false},
        {text: "Yoriichi", correct: true},
        {text: "Tanjiro", correct: true}
    ]
},
  {
    id: 4,
    question: "Who is Zenitsu's senior who lately become a demon?",
    questionType: "MULTIPLE_CHOICE",
    answers: [
      {text: "Tanjiro", correct: false},
      {text: "Murata", correct: false},
      {text: "Kaigaku", correct: true},
      {text: "Inosuke", correct: false}
    ]
  },
  {
    id: 5,
    question: "Who is the strongest Upper Moon Demon?",
    questionType: "MULTIPLE_CHOICE",
    answers: [
      {text: "Akaza", correct: false},
      {text: "Kokushibo", correct: true},
      {text: "Doma", correct: false},
      {text: "Gyutaro", correct: false}
    ]
  }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;
let isAnswered = false;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  if (currentQuestion.questionType === "TEXT") {
      const input = document.createElement("input");
      input.type = "text";
      input.classList.add("text-input");
      input.placeholder = "Type your answer here";
      answerButtons.appendChild(input);

      input.addEventListener("keyup", function(event) {
          if (event.key === "Enter") {
              checkTextAnswer(input, currentQuestion.answers[0].text);
          }
      });
  } else if (currentQuestion.questionType === "CHECKBOX") {
      const checkboxContainer = document.createElement("div");
      checkboxContainer.classList.add("checkbox-container");
      
      currentQuestion.answers.forEach((answer, index) => {
          const checkboxOption = document.createElement("div");
          checkboxOption.classList.add("checkbox-option");
          
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.id = `checkbox-${index}`;
          checkbox.value = answer.text;
          
          const label = document.createElement("label");
          label.htmlFor = `checkbox-${index}`;
          label.textContent = answer.text;
          
          checkboxOption.appendChild(checkbox);
          checkboxOption.appendChild(label);
          checkboxContainer.appendChild(checkboxOption);
      });
      
      answerButtons.appendChild(checkboxContainer);
      
      const checkboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
          checkbox.addEventListener('change', () => {
              const checkedBoxes = checkboxContainer.querySelectorAll('input[type="checkbox"]:checked');
              if (checkedBoxes.length > 2) {
                  checkbox.checked = false;
              }
          });
      });
      
      const submitButton = document.createElement("button");
      submitButton.textContent = "Submit";
      submitButton.classList.add("btn");
      submitButton.addEventListener("click", () => checkCheckboxAnswers(checkboxContainer, currentQuestion.answers));
      answerButtons.appendChild(submitButton);
  } else {
      currentQuestion.answers.forEach(answer => {
          const button = document.createElement("button");
          button.innerHTML = answer.text;
          button.classList.add("btn");
          answerButtons.appendChild(button);
          if(answer.correct) {
              button.dataset.correct = answer.correct;
          }
          button.addEventListener("click", selectAnswer);
      });
  }
}

function checkTextAnswer(input, correctAnswer) {
  input.disabled = true;
  if (input.value.toLowerCase() === correctAnswer.toLowerCase()) {
      input.classList.add("correct");
      score++;
  } else {
      input.classList.add("incorrect");
      input.value = "Incorrect. The correct answer is: " + correctAnswer;
  }
  nextButton.style.display = "block";
}

function checkCheckboxAnswers(container, answers) {
  if (isAnswered) return;

  const checkboxes = container.querySelectorAll('input[type="checkbox"]');
  let correct = true;

  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked !== answers[index].correct) {
      correct = false;
    }
    if (answers[index].correct) {
      checkbox.parentElement.classList.add("correct");
    } else if (checkbox.checked) {
      checkbox.parentElement.classList.add("incorrect");
    }

    checkbox.disabled = true;
  });

  if (correct) score++;

  isAnswered = true
  nextButton.style.display = "block";
}

function resetState() {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
  isAnswered = false;
}

  function selectAnswer(e) {
      const selectedBtn = e.target;
      const isCorrect = selectedBtn.dataset.correct === "true";
      if(isCorrect) {
          selectedBtn.classList.add("correct");
          score++;
      } else {
          selectedBtn.classList.add("incorrect");
      }
      Array.from(answerButtons.children).forEach(button => {
          if(button.dataset.correct === "true"){
              button.classList.add("correct");
          }
          button.disabled = true;
      });
      nextButton.style.display = "block";
  }

  function showScore() {
      resetState();
      questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
      nextButton.innerHTML = "Retake Quiz";
      nextButton.style.display = "block";
      nextButton.addEventListener("click", () => {
          window.location.href = "Homepage.html";
      });
  }

  function handleNextButton() {
      currentQuestionIndex++;
      if(currentQuestionIndex < questions.length) {
          showQuestion();
      } else {
          showScore();
      }
  }

  nextButton.addEventListener("click", () => {
      if(currentQuestionIndex < questions.length) {
          handleNextButton();
      } else {
          startQuiz();
      }
  });
  
  startQuiz();