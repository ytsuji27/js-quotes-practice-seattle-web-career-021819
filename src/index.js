// Set constants
const QUOTES_URL = "http://localhost:3000/quotes";
const ul = document.getElementById('quote-list');
const form = document.getElementById('new-quote-form');

const fetchHeader = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

// Setting event listeners
document.addEventListener('DOMContentLoaded', fetchQuotes);
form.addEventListener('submit', (ev) => formSubmittal(ev));

// Fetches quotes from API on page load
function fetchQuotes() {
  fetch(QUOTES_URL)
  .then(resp => resp.json())
  .then(data => quoteIterator(data))
}


// Iterate through array of quotes
function quoteIterator(quotes) {
  for (const quote of quotes) {
    displayOnPage(quote);
  }
}


// Display single quote passed in
function displayOnPage(quote) {

  // Create and build out LI
  let li = document.createElement('li');
  li.classList.add("quote-card");

  // Create Blockquote
  let bq = document.createElement('blockquote');
  bq.classList.add("blackquote");

  // Create p tag
  let pTag = document.createElement('p');
  pTag.classList.add("mb-O");
  pTag.innerText = quote.quote;

  // Create footer
  let footer = document.createElement('footer');
  footer.classList.add("blockquote-footer");
  footer.innerText = quote.author;

  // Creating <br>
  let br = document.createElement('br');

  // Create like button
  let likeButton = document.createElement('button');
  likeButton.classList.add("btn-success");
  likeButton.innerText = "Likes: ";
  likeButton.addEventListener('click', (ev) => liked(quote, ev));

  // Create span (in like button)
  let span = document.createElement('span');
  span.innerText = quote.likes;
  likeButton.appendChild(span);

  // Create delete button
  let deleteButton = document.createElement('button');
  deleteButton.classList.add("btn-danger");
  deleteButton.innerText = "Delete";
  deleteButton.addEventListener('click', (ev) => deleted(quote, ev));

  // Append stuff
  bq.append(pTag, footer, br, likeButton, deleteButton);
  li.appendChild(bq);
  ul.appendChild(li);
}


// Handle new quote
function formSubmittal(ev) {
  ev.preventDefault();
  // Create new quote object
  let quoteContent = ev.target[0].value;
  let author = ev.target[1].value;
  let newQuote = {
    quote: quoteContent,
    likes: 0,
    author: author
  }
  // Send PATCH request
  sendNew(newQuote);
}


// Send POST request
function sendNew(newQuote) {
  fetch(QUOTES_URL, {
    method: 'POST',
    headers: fetchHeader,
    body: JSON.stringify(newQuote)
  })
    .then(resp => resp.json())
    .then(data => {
      console.log("POST successful!");
      displayOnPage(data);
    })
}


// Increase number of likes
function liked(quote, ev) {
  quote.likes += 1;
  ev.target.parentElement.querySelector('span').textContent = quote.likes;
  sendUpdate(quote);
}


// Send PATCH request
function sendUpdate(updatedQuote) {
  fetch(`${QUOTES_URL}/${updatedQuote.id}`, {
    method: 'PATCH',
    headers: fetchHeader,
    body: JSON.stringify(updatedQuote)
  })
    .then(resp => resp.json())
    .then(data => console.log("PATCH successful!"))
}


// Delete quote
function deleted(quote, ev) {
  ev.target.parentElement.parentElement.remove();
  sendDelete(quote);
}


// Send DELETE request
function sendDelete(quote) {
  fetch(`${QUOTES_URL}/${quote.id}`, {
    method: 'DELETE',
    headers: fetchHeader
  })
    .then(resp => resp.json())
    .then(data => console.log("DELETE successful!"))
}
