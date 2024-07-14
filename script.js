document.addEventListener('DOMContentLoaded', function () {
  let questions = [];
  let currentQuestionIndex = 0;
  let selectedQuestions = [];

  const startScreen = document.getElementById('start-screen');
  const quizScreen = document.getElementById('quiz-screen');
  const questionContainer = document.getElementById('question-container');
  const nextButton = document.getElementById('next-button');
  const questionCountInput = document.getElementById('question-count');
  const categorySelect = document.getElementById('category');
  const showAllButton = document.getElementById('show-all-button'); // Add this line

  document.getElementById('start-button').addEventListener('click', startQuiz);
  nextButton.addEventListener('click', showNextQuestion);
  showAllButton.addEventListener('click', showAllQuestions); // Add this line


  function startQuiz() {
    const questionCount = parseInt(questionCountInput.value);
    if (isNaN(questionCount) || questionCount <= 0) {
      alert('Please enter a valid number of questions');
      return;
    }

    const accessCode = document.getElementById('access-code').value.trim(); // Get the access code and trim whitespace

    // Validate access code
    if (accessCode !== 'Mk') {
      alert('Incorrect access code. Please enter the correct access code to start the quiz.');
      return;
    }

    const category = categorySelect.value;
    const jsonFileName = `qs/${category}.json`;

    fetch(jsonFileName)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(encryptedData => {
        const decryptedData = decryptJSON(encryptedData, 'fc7b22db-a7e9-4260-a6cf-e4a2b53b653d');
        questions = decryptedData;
        selectedQuestions = getRandomQuestions(questions, questionCount);
        currentQuestionIndex = 0;
        startScreen.style.display = 'none';
        quizScreen.style.display = 'block';
        showQuestion(selectedQuestions[currentQuestionIndex]);
      })
      .catch(error => console.error('Error loading JSON:', error));
  }

  function getRandomQuestions(questions, count) {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  function showQuestion(question) {
    questionContainer.innerHTML = `
      <h2>${question.question}</h2>
      ${question.options.map(option => `<div class="option">${option}</div>`).join('')}
    `;

    document.querySelectorAll('.option').forEach(optionElement => {
      optionElement.addEventListener('click', () => selectAnswer(optionElement, question));
    });

  }

  function selectAnswer(selectedElement, question) {
    const selectedAnswer = selectedElement.textContent;
    const correctAnswer = question.answer;

    if (selectedAnswer === correctAnswer) {
      selectedElement.classList.add('correct');
    } else {
      selectedElement.classList.add('incorrect');
      document.querySelectorAll('.option').forEach(optionElement => {
        if (optionElement.textContent === correctAnswer) {
          optionElement.classList.add('correct');
        }
      });
    }

    document.querySelectorAll('.option').forEach(optionElement => {
      optionElement.style.pointerEvents = 'none';
    });

    nextButton.style.display = 'block';
  }

  function showNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < selectedQuestions.length) {
      showQuestion(selectedQuestions[currentQuestionIndex]);
    } else {
      alert('Quiz completed!');
      startScreen.style.display = 'block';
      quizScreen.style.display = 'none';
    }
  }

  function showAllQuestions() {
    const questionCount = parseInt(questionCountInput.value);
    if (isNaN(questionCount) || questionCount <= 0) {
      alert('Please enter a valid number of questions');
      return;
    }
  
    const accessCode = document.getElementById('access-code').value.trim(); // Get the access code and trim whitespace
  
    // Validate access code
    if (accessCode !== 'Mk') {
      alert('Incorrect access code. Please enter the correct access code to start the quiz.');
      return;
    }
  
    const category = categorySelect.value;
    const jsonFileName = `qs/${category}.json`;
  
    fetch(jsonFileName)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(encryptedData => {
        const decryptedData = decryptJSON(encryptedData, 'fc7b22db-a7e9-4260-a6cf-e4a2b53b653d');
        questions = decryptedData;
        selectedQuestions = getRandomQuestions(questions, questionCount);
  
        // Clear previous content
    questionContainer.innerHTML = '';

    // Iterate through all selected questions
    selectedQuestions.forEach((question, index) => {
      const isLastQuestion = index === selectedQuestions.length - 1;
      // Create div for each question
      const questionDiv = document.createElement('div');
      questionDiv.innerHTML = `
        <h2>${question.question}</h2>
        ${question.options.map(option => `
          <div class="option ${option === question.answer ? 'correct' : ''}">
            ${option}
          </div>
        `).join('')}
      `;

      // Append the question div to questionContainer
      questionContainer.appendChild(questionDiv);

      // Add a separator after each question, except the last one
      if (!isLastQuestion) {
        const hr = document.createElement('hr');
        questionContainer.appendChild(hr);
      }
    

  
        // Show the question container
        questionContainer.style.display = 'block';
       

        // Ensure the container is scrollable
        quizScreen.style.overflowY = 'auto';
        questionContainer.style.overflowY = 'auto';
        questionContainer.style.maxHeight = '80vh'; // Adjust the max-height as needed

        // Hide the next button since all questions are shown
        startScreen.style.display = 'none';

        nextButton.style.display = 'none';
        quizScreen.style.display = 'block';
      })
    //  .catch(error => console.error('Error loading JSON:', error));
  })}
  
  // Example decryptJSON function, replace with your actual decryption logic
  function decryptJSON(encryptedData, key) {
    // Implement your decryption logic here
    // Example: using CryptoJS AES decryption
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }
});
