const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const addButton = document.querySelector(".btn");
const money_minus = document.getElementById("money-minus");
const money_plus = document.getElementById("money-plus");
const history_data = document.getElementById("list");
const balance = document.getElementById("balance");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

addButton.addEventListener("click", (e) => {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please enter Text and Amount");
  }
  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
  };

  transactions.push(transaction);

  addTransactionDOM(transaction);
  updateBalance();
  updateLocalStorage();
  text.value = "";
  amount.value = "";
});

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
function addTransactionDOM(transaction) {
  //get sign
  const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `${transaction.text} <span>${sign} ${Math.abs(
    transaction.amount
  )}</span><button class="delete-btn" onClick={removeTransaction(${
    transaction.id
  })}>X</button`;

  history_data.appendChild(item);
}

function removeTransaction(id) {
  const indexToRemove = transactions.findIndex(
    (transaction) => transaction.id === id
  );
  if (indexToRemove !== -1) {
    // Use splice() to remove the transaction from the array
    transactions.splice(indexToRemove, 1);
    console.log(`Transaction with ID ${id} was removed.`);
    updateLocalStorage();
    updateExpenseData();
  }
}

function updateExpenseData() {
  history_data.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateBalance();
}

function updateBalance() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = amounts
    .filter((item) => item < 0)
    .reduce((acc, item) => (acc -= item), 0);

  balance.innerHTML = `$${total}`;
  money_plus.innerHTML = `$${income}`;
  money_minus.innerHTML = `-$${expense}`;
}

updateExpenseData();
