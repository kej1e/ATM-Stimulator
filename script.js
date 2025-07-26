// ATM State Management
let currentScreen = 'main';
let currentInput = '';
let pin = '';
let balance = 1250.00;
let currentAction = '';

// Transaction history array
let transactions = [
    { type: 'deposit', amount: 500.00, date: '2024-01-15' },
    { type: 'withdraw', amount: 250.00, date: '2024-01-14' },
    { type: 'deposit', amount: 1000.00, date: '2024-01-10' }
];

// Display Functions
function updateBalance() {
    document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
}

function showScreen(screen) {
    // Hide all screens
    document.getElementById('mainScreen').classList.add('hidden');
    document.getElementById('pinScreen').classList.add('hidden');
    document.getElementById('amountScreen').classList.add('hidden');
    
    // Show target screen
    document.getElementById(screen + 'Screen').classList.remove('hidden');
    
    // Update state
    currentScreen = screen;
    currentInput = '';
    updateInputDisplay();
}

function updateInputDisplay() {
    if (currentScreen === 'pin') {
        document.getElementById('pinDisplay').textContent = '*'.repeat(currentInput.length);
    } else if (currentScreen === 'amount') {
        const amount = currentInput ? parseFloat(currentInput) : 0;
        document.getElementById('amountDisplay').textContent = `$${amount.toFixed(2)}`;
    }
}

// Keypad Functions
function appendNumber(num) {
    if (currentScreen === 'pin' && currentInput.length < 4) {
        currentInput += num;
    } else if (currentScreen === 'amount' && currentInput.length < 8) {
        currentInput += num;
    }
    updateInputDisplay();
}

function clearInput() {
    currentInput = '';
    updateInputDisplay();
}

function enterAction() {
    if (currentScreen === 'pin') {
        handlePinVerification();
    } else if (currentScreen === 'amount') {
        handleAmountEntry();
    }
}

// PIN Verification
function handlePinVerification() {
    if (currentInput === '1234') {
        showScreen('main');
        showMessage('PIN accepted', 'success');
    } else {
        showMessage('Invalid PIN', 'error');
        clearInput();
    }
}

// Amount Entry
function handleAmountEntry() {
    const amount = parseFloat(currentInput);
    if (amount > 0) {
        if (currentAction === 'deposit') {
            deposit(amount);
        } else if (currentAction === 'withdraw') {
            withdraw(amount);
        }
    }
}

// Transaction Functions
function showDeposit() {
    currentAction = 'deposit';
    showScreen('amount');
    showMessage('Enter deposit amount', 'success');
}

function showWithdraw() {
    currentAction = 'withdraw';
    showScreen('amount');
    showMessage('Enter withdrawal amount', 'success');
}

function deposit(amount) {
    balance += amount;
    addTransaction('deposit', amount);
    updateBalance();
    updateTransactionHistory();
    showScreen('main');
    showMessage(`Deposited $${amount.toFixed(2)}`, 'success');
    clearInput();
}

function withdraw(amount) {
    if (amount > balance) {
        showMessage('Insufficient funds', 'error');
        return;
    }
    
    balance -= amount;
    addTransaction('withdraw', amount);
    updateBalance();
    updateTransactionHistory();
    showScreen('main');
    showMessage(`Withdrawn $${amount.toFixed(2)}`, 'success');
    clearInput();
}

// Transaction Management
function addTransaction(type, amount) {
    transactions.unshift({
        type: type,
        amount: amount,
        date: new Date().toISOString().split('T')[0]
    });
}

function updateTransactionHistory() {
    const history = document.getElementById('transactionHistory');
    history.innerHTML = '';
    
    transactions.slice(0, 5).forEach(transaction => {
        const div = document.createElement('div');
        div.className = `transaction ${transaction.type}`;
        div.innerHTML = `
            <span>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span>
            <span>${transaction.type === 'deposit' ? '+' : '-'}$${transaction.amount.toFixed(2)}</span>
        `;
        history.appendChild(div);
    });
}

// Message Display
function showMessage(message, type = 'success') {
    const messageEl = document.querySelector('.message');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    
    // Auto-clear message after 3 seconds
    setTimeout(() => {
        messageEl.className = 'message';
    }, 3000);
}

// Keyboard Support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === 'Enter') {
        enterAction();
    } else if (key === 'Escape' || key === 'Backspace') {
        clearInput();
    }
});

// Initialize ATM
function initATM() {
    updateBalance();
    updateTransactionHistory();
}

// Start the ATM when page loads
document.addEventListener('DOMContentLoaded', initATM);