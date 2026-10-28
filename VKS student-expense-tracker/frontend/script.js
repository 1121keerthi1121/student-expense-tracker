const API_URL = 'http://localhost:5000/api/expenses';
let monthlyBudget = 500;
let expenses = [];

// DOM Elements
const expenseForm = document.getElementById('expense-form');
const expensesTbody = document.getElementById('expenses-tbody');
const totalSpentEl = document.getElementById('total-spent');
const monthlyBudgetEl = document.getElementById('monthly-budget');
const remainingBudgetEl = document.getElementById('remaining-budget');
const expenseCountEl = document.getElementById('expense-count');
const emptyStateEl = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const filterCategory = document.getElementById('filter-category');
const budgetInput = document.getElementById('budget-input');
const updateBudgetBtn = document.getElementById('update-budget');
const formMessage = document.getElementById('form-message');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const spinner = submitBtn.querySelector('.spinner');

// Edit Modal Elements
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const closeModal = document.querySelector('.close-modal');
const editId = document.getElementById('edit-id');
const editTitle = document.getElementById('edit-title');
const editAmount = document.getElementById('edit-amount');
const editCategory = document.getElementById('edit-category');
const editDate = document.getElementById('edit-date');

// Initialize Date input to today
document.getElementById('date').valueAsDate = new Date();

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchExpenses);
expenseForm.addEventListener('submit', handleAddExpense);
searchInput.addEventListener('input', renderExpenses);
filterCategory.addEventListener('change', renderExpenses);
updateBudgetBtn.addEventListener('click', handleUpdateBudget);

closeModal.addEventListener('click', () => editModal.classList.add('hidden'));
window.addEventListener('click', (e) => {
    if (e.target === editModal) editModal.classList.add('hidden');
});
editForm.addEventListener('submit', handleUpdateExpense);

// Fetch Expenses from Backend
async function fetchExpenses() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch expenses');
        expenses = await response.json();
        renderExpenses();
    } catch (error) {
        console.error('Error:', error);
        showFormMessage('Could not connect to server. Make sure backend is running.', 'error');
    }
}

// Add Expense
async function handleAddExpense(e) {
    e.preventDefault();
    setLoading(true);

    const newExpense = {
        title: document.getElementById('title').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        date: document.getElementById('date').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newExpense)
        });

        if (!response.ok) throw new Error('Failed to add expense');

        const savedExpense = await response.json();
        expenses.unshift(savedExpense);
        renderExpenses();
        expenseForm.reset();
        document.getElementById('date').valueAsDate = new Date();
        showFormMessage('Expense added successfully!', 'success');
    } catch (error) {
        console.error('Error:', error);
        showFormMessage('Error adding expense. Please try again.', 'error');
    } finally {
        setLoading(false);
    }
}

// Delete Expense
async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete expense');

        expenses = expenses.filter(exp => exp.id !== id);
        renderExpenses();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete expense.');
    }
}

// Open Edit Modal
async function openEditModal(id) {
    const expense = expenses.find(exp => exp.id === id);
    if (!expense) return;

    editId.value = expense.id;
    editTitle.value = expense.title;
    editAmount.value = expense.amount;
    editCategory.value = expense.category;
    editDate.value = expense.date ? expense.date.split('T')[0] : '';

    editModal.classList.remove('hidden');
}

// Update Expense
async function handleUpdateExpense(e) {
    e.preventDefault();
    const id = editId.value;

    const updatedData = {
        title: editTitle.value,
        amount: parseFloat(editAmount.value),
        category: editCategory.value,
        date: editDate.value
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) throw new Error('Failed to update expense');

        const updatedExpense = await response.json();
        expenses = expenses.map(exp => exp.id === id ? updatedExpense : exp);
        renderExpenses();
        editModal.classList.add('hidden');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update expense.');
    }
}

// Render Expenses & Statistics
function renderExpenses() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = filterCategory.value;

    const filtered = expenses.filter(exp => {
        const matchesSearch = exp.title.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    expensesTbody.innerHTML = '';
    expenseCountEl.textContent = `${filtered.length} items`;

    if (filtered.length === 0) {
        emptyStateEl.classList.remove('hidden');
    } else {
        emptyStateEl.classList.add('hidden');
        filtered.forEach(exp => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${escapeHtml(exp.title)}</strong></td>
                <td><span class="badge">${escapeHtml(exp.category)}</span></td>
                <td>${formatDate(exp.date)}</td>
                <td>$${parseFloat(exp.amount).toFixed(2)}</td>
                <td class="actions-cell">
                    <button class="icon-btn edit-btn" onclick="openEditModal('${exp.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn delete-btn" onclick="deleteExpense('${exp.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            expensesTbody.appendChild(tr);
        });
    }

    updateStats();
}

// Update Dashboard Statistics
function updateStats() {
    const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    const remaining = monthlyBudget - totalSpent;

    totalSpentEl.textContent = `$${totalSpent.toFixed(2)}`;
    monthlyBudgetEl.textContent = `$${monthlyBudget.toFixed(2)}`;
    remainingBudgetEl.textContent = `$${remaining.toFixed(2)}`;

    if (remaining < 0) {
        remainingBudgetEl.style.color = '#ef4444';
    } else {
        remainingBudgetEl.style.color = 'inherit';
    }
}

// Handle Budget Update
function handleUpdateBudget() {
    const newBudget = parseFloat(budgetInput.value);
    if (isNaN(newBudget) || newBudget < 0) {
        alert('Please enter a valid budget amount.');
        return;
    }
    monthlyBudget = newBudget;
    updateStats();
    alert('Monthly budget updated successfully!');
}

// Utility Functions
function setLoading(isLoading) {
    if (isLoading) {
        btnText.classList.add('hidden');
        spinner.classList.remove('hidden');
        submitBtn.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.classList.remove('hidden');
    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 4000);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
