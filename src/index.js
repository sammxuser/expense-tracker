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
      'expense'
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
      'income',
      incomeAmount.value.trim(),
      'income'
    );
  }
  incomeAmount.value = '';
  incomeDescription.value = '';
});

function addTransactions(description, category = '', amount, type) {
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
  // add delete functionality
  //   document
  //     .getElementById('row#' + noOfTransactions)
  //     .addEventListener('click', (element) => {
  //       console.log(element.closest('tr').rowIndex);
  //       transRow.remove();
  //       updateSummary();
  //     });

  deleteBtn.addEventListener('click', (element) => {
    // console.log(element.target.parentNode.parentNode.rowIndex);
    const rowNumber = element.target.parentNode.parentNode.rowIndex;
    if (rowNumber > 0) {
      if (rowNumber === 1) {
        transactionHistory.deleteRow(-1);
      } else transactionHistory.deleteRow(rowNumber - 1);
    }

    updateSummary();
  });

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

  totalIncome.textContent = totIncome;
  totalExpenses.textContent = totExpense;
  balance.textContent = runningBal;
}
