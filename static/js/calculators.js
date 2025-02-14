// Initialize charts and calculators
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    const calculatorButtons = document.querySelectorAll('.calculator-nav .btn-calculator');
    calculatorButtons.forEach(button => {
        button.addEventListener('click', function() {
            calculatorButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.calculator-section').forEach(section => {
                section.style.display = 'none';
            });

            const calculatorId = this.getAttribute('data-calculator');
            const selectedCalculator = document.getElementById(calculatorId);
            if (selectedCalculator) {
                selectedCalculator.style.display = 'block';
                // Re-initialize charts when calculator is shown
                if (calculatorId === 'ez-grader') {
                    initializeGradingChart();
                }
            }
        });
    });

    // Add initial grade row
    addGradeRow();

    // Event listeners for EZ Grader
    document.getElementById('show-chart')?.addEventListener('change', function() {
        const chartDiv = document.getElementById('grading-chart');
        if (chartDiv) {
            chartDiv.style.display = this.checked ? 'block' : 'none';
            if (this.checked) {
                initializeGradingChart();
            }
        }
    });

    // Auto-calculate when inputs change
    ['total-questions', 'wrong-answers'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calculateEZGrade);
    });
});

// Initialize grading chart
function initializeGradingChart() {
    const chartCanvas = document.getElementById('grade-chart');
    if (!chartCanvas) return;

    // Destroy existing chart if it exists
    const existingChart = Chart.getChart(chartCanvas);
    if (existingChart) {
        existingChart.destroy();
    }

    const total = parseInt(document.getElementById('total-questions').value) || 10;
    const grades = [];
    const labels = [];

    for (let wrong = 0; wrong <= total; wrong++) {
        const correct = total - wrong;
        const percentage = (correct / total) * 100;
        grades.push(percentage);
        labels.push(wrong);
    }

    new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Grade Percentage',
                data: grades,
                borderColor: '#4a90e2',
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Grade Distribution'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Grade (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Wrong Answers'
                    }
                }
            }
        }
    });
}

// EZ Grader Calculator functions
function calculateEZGrade() {
    const total = parseInt(document.getElementById('total-questions').value);
    const wrong = parseInt(document.getElementById('wrong-answers').value);

    if (isNaN(total) || isNaN(wrong) || total <= 0 || wrong < 0 || wrong > total) {
        document.getElementById('ez-grade-result').textContent = '-/-';
        return;
    }

    const correct = total - wrong;
    const percentage = (correct / total) * 100;
    const showDecimals = document.getElementById('show-decimals').checked;

    document.getElementById('ez-grade-result').textContent =
        `${correct}/${total} = ${showDecimals ? percentage.toFixed(2) : Math.round(percentage)}%`;

    if (document.getElementById('show-chart').checked) {
        initializeGradingChart();
    }
}

function updateGradingChart() {
    const total = parseInt(document.getElementById('total-questions').value);
    if (isNaN(total) || total <= 0) return;

    const tbody = document.getElementById('grade-chart-body');
    tbody.innerHTML = '';

    for (let wrong = 0; wrong <= total; wrong++) {
        const correct = total - wrong;
        const percentage = (correct / total) * 100;
        const showDecimals = document.getElementById('show-decimals').checked;

        const row = tbody.insertRow();
        row.insertCell(0).textContent = wrong;
        row.insertCell(1).textContent = showDecimals ? percentage.toFixed(2) + '%' : Math.round(percentage) + '%';
    }
}

// Average Grade Calculator
let gradeCount = 0;

function addGradeRow() {
    gradeCount++;
    const container = document.getElementById('percentage-grades');

    const row = document.createElement('div');
    row.className = 'row grade-row';
    row.innerHTML = `
        <div class="col-2">${gradeCount}</div>
        <div class="col-5">
            <input type="number" class="form-control text-center" min="0" max="100" onchange="calculateAverage()">
        </div>
        <div class="col-5">
            <input type="number" class="form-control text-center" min="0" max="100" value="100" onchange="calculateAverage()">
        </div>
    `;

    container.appendChild(row);
    calculateAverage();
}

function resetGrades() {
    const container = document.getElementById('percentage-grades');
    container.innerHTML = '';
    gradeCount = 0;
    document.getElementById('average-result').textContent = '-';
    addGradeRow();
}

function calculateAverage() {
    const rows = document.getElementsByClassName('grade-row');
    let sum = 0;
    let totalWeight = 0;
    let validGrades = 0;

    for (let row of rows) {
        const inputs = row.getElementsByTagName('input');
        const grade = parseFloat(inputs[0].value);
        const weight = parseFloat(inputs[1].value) || 0;

        if (!isNaN(grade) && !isNaN(weight) && weight > 0) {
            sum += grade * weight;
            totalWeight += weight;
            validGrades++;
        }
    }

    const result = validGrades > 0 ? `${(sum / totalWeight).toFixed(2)}%` : '-';
    document.getElementById('average-result').textContent = result;
}

// Final Grade Calculator logic
function calculateFinalGrade() {
    const currentGrade = parseFloat(document.getElementById('current-grade')?.value);
    const desiredGrade = parseFloat(document.getElementById('desired-grade')?.value);
    const finalWeight = parseFloat(document.getElementById('final-weight')?.value);
    const resultElement = document.getElementById('final-grade-result');

    if (!resultElement) return;

    // Reset result
    resultElement.textContent = '-';
    resultElement.className = 'grade-result';

    // Validate inputs
    if (isNaN(currentGrade) || isNaN(desiredGrade) || isNaN(finalWeight) ||
        currentGrade < 0 || currentGrade > 100 ||
        desiredGrade < 0 || desiredGrade > 100 ||
        finalWeight <= 0 || finalWeight >= 100) {
        return;
    }

    // Calculate needed grade
    const currentWeight = 100 - finalWeight;
    const neededGrade = (desiredGrade - (currentGrade * (currentWeight / 100))) / (finalWeight / 100);

    // Display result with appropriate message
    if (neededGrade > 100) {
        resultElement.textContent = 'Not possible';
        resultElement.className = 'grade-result text-danger';
    } else if (neededGrade < 0) {
        resultElement.textContent = 'Already achieved';
        resultElement.className = 'grade-result text-success';
    } else {
        resultElement.textContent = `${neededGrade.toFixed(1)}%`;
        if (neededGrade > 90) {
            resultElement.className = 'grade-result text-warning';
        }
    }
}

function resetFinal() {
    ['current-grade', 'desired-grade', 'final-weight'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
        }
    });
    const resultElement = document.getElementById('final-grade-result');
    if (resultElement) {
        resultElement.textContent = '-';
        resultElement.className = 'grade-result';
    }
}