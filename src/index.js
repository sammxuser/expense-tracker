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
    expenseDescription.value !== '' ||
    // expenseCategory.value !== '' ||
    expenseAmount.value !== ''
  ) {
    addTransactions(
      expenseDescription.value,
      expenseCategory.value,
      expenseAmount.value,
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
  addTransactions(
    incomeDescription.value,
    'income',
    incomeAmount.value,
    'income'
  );
  incomeAmount.value = '';
  incomeDescription.value = '';
});

function addTransactions(description, category = '', amount, type) {
  const transRow = document.createElement('tr');
  const descColumn = document.createElement('td');
  descColumn.textContent = description;
  const categColumn = document.createElement('td');
  categColumn.textContent = category;
  const amountColumn = document.createElement('td');
  amountColumn.textContent = amount;
  const typeColumn = document.createElement('td');
  typeColumn.textContent = type;
  const actionColumn = document.createElement('td');
  actionColumn.textContent = 'Edit/Delete';

  transRow.appendChild(descColumn);
  transRow.appendChild(categColumn);
  transRow.appendChild(amountColumn);
  transRow.appendChild(typeColumn);
  transRow.appendChild(actionColumn);

  transactionHistory.appendChild(transRow);
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

// clearAll button
clearAllBtn.addEventListener('click', () => {
  while (transactionHistory.rows.length > 0) {
    transactionHistory.deleteRow(0);
  }
  totalExpenses.textContent = 0;
  totalIncome.textContent = 0;
  balance.textContent = 0;
});
