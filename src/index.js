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
});

function addTransactions(description, category = '', amount, type) {
  const transactionHistory = document.getElementById('transaction-history');
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
  let runningBal = 0;
  if (type === 'income') {
    totalIncome.textContent = amount;
    runningBal += amount;
  } else if (type === 'expense') {
    totalExpenses.textContent = amount;
    runningBal -= amount;
  }
  balance.textContent = runningBal;
}
