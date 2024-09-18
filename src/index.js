import './style.css';

const addIncomeBtn = document.getElementById('addIncomeBtn');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

// const expenseForm = document.getElementById('expense-form');
const expenseDescription = document.getElementById('expense-description');
const incomeDescription = document.getElementById('income-description');
const expenseCategory = document.getElementById('expense-category');
const expenseAmount = document.getElementById('expense-amount');
const incomeAmount = document.getElementById('income-amount');
const totalExpenses = document.getElementById('total-expenses');
const totalIncome = document.getElementById('total-income');
const balance = document.getElementById('balance');
const transactionHistory = document.getElementById('transaction-history');

addExpenseBtn.addEventListener('click', () => {
  if (
    expenseDescription.value === '' ||
    expenseAmount.value === '' ||
    expenseAmount.value.trim() < 0
  ) {
    alert('Enter values for Description and Amount');
  } else {
    addTransactions(
      expenseDescription.value.trim(),
      expenseCategory.value.trim(),
      expenseAmount.value.trim(),
      'expense',
      false
    );
    expenseDescription.value = '';
    expenseCategory.value = '';
    expenseAmount.value = '';
  }
  expenseDescription.value = '';
  expenseCategory.value = '';
  expenseAmount.value = '';
});

addIncomeBtn.addEventListener('click', () => {
  if (
    incomeAmount.value === '' ||
    incomeDescription.value === '' ||
    incomeAmount.value <= 0
    //|| isNaN(parseFloat(incomeAmount.value.trim()))
  ) {
    alert('Enter values for Description and Amount');
  } else {
    addTransactions(
      incomeDescription.value.trim(),
      'Income',
      incomeAmount.value.trim(),
      'income',
      false
    );
  }
  incomeAmount.value = '';
  incomeDescription.value = '';
});

function addTransactions(
  description,
  category = '',
  amount,
  type,
  inLocalStorage = true
) {
  let noOfTransactions = transactionHistory.rows.length;
  noOfTransactions += 1;
  const transRow = document.createElement('tr');
  transRow.id = 'row#' + noOfTransactions;
  const descColumn = document.createElement('td');
  descColumn.textContent = description;
  const categColumn = document.createElement('td');
  categColumn.textContent = category;
  const amountColumn = document.createElement('td');
  amountColumn.textContent = amount;
  const typeColumn = document.createElement('td');
  typeColumn.textContent = type;
  const actionColumn = document.createElement('td');
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.textContent = 'delete';
  actionColumn.appendChild(deleteBtn);

  transRow.appendChild(descColumn);
  transRow.appendChild(categColumn);
  transRow.appendChild(amountColumn);
  transRow.appendChild(typeColumn);
  transRow.appendChild(actionColumn);

  transactionHistory.appendChild(transRow);
  //   save transaction to localStorage
  const transaction = {
    description: description,
    category: category,
    amount: amount,
    type: type,
  };
  if (!inLocalStorage) {
    saveTransaction(transaction);
  }
  deleteBtn.addEventListener('click', (element) => {
    // console.log(element.target.parentNode.parentNode.rowIndex);
    const tableRow = element.target.parentNode.parentNode;
    const transactionToBeRemoved = {
      description: '',
      amount: '',
      category: '',
      type: '',
    };
    for (let i = 0; i < tableRow.cells.length; i++) {
      //   console.log(tableRow.cells[i].textContent);
      switch (i) {
        case 1:
          transactionToBeRemoved.description = tableRow.cells[i].textContent;
        case 2:
          transactionToBeRemoved.amount = tableRow.cells[i].textContent;
        case 3:
          transactionToBeRemoved.category = tableRow.cells[i].textContent;
        case 4:
          transactionToBeRemoved.type = tableRow.cells[i].textContent;
      }
    }

    console.log(transactionToBeRemoved);
    removeTransaction(transactionToBeRemoved);

    // removeTransaction(element.target.parentNode.parentNode)
    const rowNumber = element.target.parentNode.parentNode.rowIndex;
    if (rowNumber > 0) {
      if (rowNumber === 1) {
        transactionHistory.deleteRow(-1);
      } else transactionHistory.deleteRow(rowNumber - 1);
    }
    updateSummary();
  });
  showNotification('Transaction added successfully!');
  updateSummary();
}

// clearAll button
clearAllBtn.addEventListener('click', () => {
  while (transactionHistory.rows.length > 0) {
    transactionHistory.deleteRow(0);
  }
  totalExpenses.textContent = 0;
  totalIncome.textContent = 0;
  balance.textContent = 0;
});

function updateSummary() {
  // Calculate balance
  let runningBal = 0.0;
  let totIncome = 0.0; //total income
  let totExpense = 0.0; //total expenses
  let cellAmount = 0;
  for (let i = 0, row; (row = transactionHistory.rows[i]); i++) {
    for (let j = 0, col; (col = row.cells[j]); j++) {
      if (j === 2) {
        cellAmount = col.innerHTML; //Save amount
        // console.log('Each CELL DATA : ' + col.innerHTML);
      }
      if (j === 3 && col.innerHTML === 'expense') {
        runningBal = parseFloat(runningBal) - parseFloat(cellAmount);
        totExpense = parseFloat(totExpense) + parseFloat(cellAmount);
      } else if (j === 3 && col.innerHTML === 'income') {
        runningBal = parseFloat(runningBal) + parseFloat(cellAmount);
        totIncome = parseFloat(totIncome) + parseFloat(cellAmount);
      }
    }
  }
  // add color codes for balances
  if (parseFloat(runningBal) >= 0) {
    balance.classList.remove('negative');
    balance.classList.add('positive');
  } else {
    balance.classList.remove('positive');
    balance.classList.add('negative');
  }

  totalIncome.textContent = totIncome;
  totalExpenses.textContent = totExpense;
  balance.textContent = runningBal;
}

function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.remove('hidden');

  setTimeout(function () {
    notification.classList.add('hidden');
  }, 2000);
}

// function to handle deletion of data from localStorage
function removeTransaction(transactionToRemove) {
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  transactions = transactions.filter(function (transaction) {
    return (
      transaction.description !== transactionToRemove.description &&
      transaction.amount !== transactionToRemove.amount &&
      transaction.category !== transactionToRemove.category &&
      transaction.type !== transactionToRemove.type
    );
  });
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// function to load saved transactions when page is loaded
function loadTransactions() {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

  transactions.forEach((transaction) => {
    addTransactions(
      transaction.description,
      transaction.category,
      transaction.amount,
      transaction.type,
      true
    );
  });
  //   updateSummary();
}
// function to save transaction to localStorage
function saveTransaction(transactionToBeAdded) {
  // save data to localStorage to preserve data after page is refreshed
  const transaction = {
    description: transactionToBeAdded.description,
    amount: transactionToBeAdded.amount,
    category: transactionToBeAdded.category,
    type: transactionToBeAdded.type,
  };

  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

window.addEventListener('load', loadTransactions);
