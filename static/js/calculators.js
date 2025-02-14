// EZ Grader Calculator functions
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
            }
        });
    });

    // Add initial grade row
    addGradeRow();

    // Event listeners for EZ Grader
    document.getElementById('show-chart')?.addEventListener('change', function() {
        document.getElementById('grading-chart').style.display = this.checked ? 'block' : 'none';
        if (this.checked) {
            updateGradingChart();
        }
    });

    // Auto-calculate when inputs change
    ['total-questions', 'wrong-answers'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calculateEZGrade);
    });

    // Bind event listeners for Average Calculator
    document.querySelector('button[onclick="resetGrades()"]').onclick = resetGrades;
    document.querySelector('button[onclick="addGradeRow()"]').onclick = () => addGradeRow();
});

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
        updateGradingChart();
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

// Final Grade Calculator
function calculateFinalGrade() {
    const currentGrade = parseFloat(document.getElementById('current-grade').value);
    const desiredGrade = parseFloat(document.getElementById('desired-grade').value);
    const weight = parseFloat(document.getElementById('final-weight').value);

    if (isNaN(currentGrade) || isNaN(desiredGrade) || isNaN(weight) ||
        weight < 0 || weight > 100) {
        document.getElementById('final-grade-result').textContent = '-';
        return;
    }

    const currentWeight = 100 - weight;
    const neededGrade = (desiredGrade - (currentGrade * currentWeight / 100)) / (weight / 100);

    if (neededGrade > 100) {
        document.getElementById('final-grade-result').textContent = 'Not possible';
        return;
    }

    document.getElementById('final-grade-result').textContent = `${neededGrade.toFixed(2)}%`;
}

function resetFinal() {
    const inputs = document.querySelectorAll('#final-calculator input');
    inputs.forEach(input => input.value = '');
    document.getElementById('final-grade-result').textContent = '-';
}