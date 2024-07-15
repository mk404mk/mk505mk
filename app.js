// app.js

// Decrypt function
function decryptData(encryptedData, key) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }
  
  // Sample decryption key (replace with your actual key)
  const decryptionKey = '6ea48c42-7fe9-4067-b9c5-624a9fcf0c19';
  
  // Fetch the encrypted JSON data from the file
  fetch('questions.json')
    .then(response => response.text())
    .then(encryptedData => {
      // Decrypt the JSON data
      const questions = decryptData(encryptedData, decryptionKey);
  
 // Function to search questions and answers
function searchQuestions(query) {
    if (query.length < 3) {
      document.getElementById('results').innerHTML = '';
      return;
    }
  
    const lowerCaseQuery = query.toLowerCase(); // Convert query to lowercase
  
    const results = questions.filter(q => 
      q.question.toLowerCase().includes(lowerCaseQuery) || // Convert question to lowercase for comparison
      q.answer.toLowerCase().includes(lowerCaseQuery)    // Convert answer to lowercase for comparison
    );
  
    displayResults(results);
  }
  
      // Function to display search results
      function displayResults(results) {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';
  
        results.forEach(result => {
          const resultElement = document.createElement('div');
          resultElement.classList.add('result');
  
          const questionElement = document.createElement('div');
          questionElement.innerText = result.question;
  
          // Sort options so that the correct answer is first
          const sortedOptions = [...result.options].sort((a, b) => {
            if (a === result.answer) return -1;
            if (b === result.answer) return 1;
            return 0;
          });
  
          const optionsElement = document.createElement('ul');
          sortedOptions.forEach(option => {
            const optionElement = document.createElement('li');
            optionElement.innerText = option;
            if (option === result.answer) {
              optionElement.classList.add('answer');
            }
            optionsElement.appendChild(optionElement);
          });
  
          resultElement.appendChild(questionElement);
          resultElement.appendChild(optionsElement);
          resultsContainer.appendChild(resultElement);
        });
      }
  
      // Event listener for search input (keypress)
      document.getElementById('search').addEventListener('input', (e) => {
        searchQuestions(e.target.value);
      });
  // Event listener for clear button
document.getElementById('clearButton').addEventListener('click', () => {
    document.getElementById('search').value = ''; // Clear the search input field
    document.getElementById('results').innerHTML = ''; // Clear the results container
  });
      // Event listener for search button
      document.getElementById('searchButton').addEventListener('click', () => {
        const query = document.getElementById('search').value;
        searchQuestions(query);
      });
    })
    .catch(error => console.error('Error fetching the encrypted data:', error));
  