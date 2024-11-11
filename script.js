let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let expenseChart;

function addTransaction() {
    const type = document.getElementById("transactionType").value;
    const date = document.getElementById("transactionDate").value;
    const description = document.getElementById("transactionDescription").value.trim();
    const category = document.getElementById("transactionCategory").value;
    const amount = parseFloat(document.getElementById("transactionAmount").value);

    if (!date || !description || isNaN(amount) || amount <= 0) {
        alert("Please enter valid data for all fields.");
        return;
    }

    const transaction = { type, date, description, category, amount };
    transactions.push(transaction);

    saveTransactions();
    updateTransactionTable();
    updateSummary();
    updateChart();

    document.getElementById("transactionDate").value = "";
    document.getElementById("transactionDescription").value = "";
    document.getElementById("transactionAmount").value = "";
}

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveTransactions();
    updateTransactionTable();
    updateSummary();
    updateChart();
}

function updateTransactionTable() {
    const tableBody = document.getElementById("transactionTableBody");
    tableBody.innerHTML = "";

    transactions.forEach((transaction, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td>${transaction.category}</td>
            <td>$${transaction.amount.toFixed(2)}</td>
            <td>${transaction.type}</td>
            <td><button onclick="deleteTransaction(${index})">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function updateSummary() {
    const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((total, t) => total + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === "expense")
        .reduce((total, t) => total + t.amount, 0);

    const netIncome = totalIncome - totalExpense;

    document.getElementById("totalIncome").innerText = totalIncome.toFixed(2);
    document.getElementById("totalExpense").innerText = totalExpense.toFixed(2);
    document.getElementById("netIncome").innerText = netIncome.toFixed(2);
}

function updateChart() {
    const expenseData = transactions
        .filter(t => t.type === "expense")
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    const categories = Object.keys(expenseData);
    const amounts = Object.values(expenseData);

    if (expenseChart) {
        expenseChart.destroy();
    }

    const ctx = document.getElementById("expenseChart").getContext("2d");
    expenseChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]
            }]
        }
    });
}

function init() {
    updateTransactionTable();
    updateSummary();
    updateChart();
}

// Initialize app
init();
