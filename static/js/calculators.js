// Grade letter to percentage conversion
const letterGrades = {
    'A+': 97, 'A': 93, 'A-': 90,
    'B+': 87, 'B': 83, 'B-': 80,
    'C+': 77, 'C': 73, 'C-': 70,
    'D+': 67, 'D': 63, 'D-': 60,
    'F': 0
};

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

    // Initialize tab switching for average calculator
    const gradeTypeTabs = document.querySelectorAll('.grade-type-tabs .tab-btn');
    gradeTypeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            gradeTypeTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding content
            const tabType = this.getAttribute('data-calculator-tab');
            document.querySelectorAll('.calculator-tab').forEach(content => {
                content.style.display = 'none';
            });
            document.getElementById(`${tabType}-tab`).style.display = 'block';
        });
    });

    // Add initial rows for each tab type
    addGradeRow('percentage');
    addGradeRow('letters');
    addGradeRow('points');

    // Bind event listeners
    document.querySelector('button[onclick="resetGrades()"]').onclick = resetGrades;
    document.querySelector('button[onclick="addGradeRow()"]').onclick = () => addGradeRow();

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
});

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
let gradeCount = {
    percentage: 0,
    letters: 0,
    points: 0
};

function addGradeRow(forceType = null) {
    const activeTab = document.querySelector('.grade-type-tabs .tab-btn.active');
    const tabType = forceType || (activeTab ? activeTab.getAttribute('data-calculator-tab') : 'percentage');
    const container = document.getElementById(`${tabType}-grades`);

    if (!container) return;

    gradeCount[tabType]++;
    const row = document.createElement('div');
    row.className = 'row grade-row';

    if (tabType === 'letters') {
        row.innerHTML = `
            <div class="col-2">${gradeCount[tabType]}</div>
            <div class="col-5">
                <select class="form-select text-center" onchange="calculateAverage()">
                    ${Object.keys(letterGrades).map(grade => 
                        `<option value="${grade}">${grade}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="col-5">
                <input type="number" class="form-control text-center" min="0" max="100" value="100" onchange="calculateAverage()">
            </div>
        `;
    } else if (tabType === 'points') {
        row.innerHTML = `
            <div class="col-2">${gradeCount[tabType]}</div>
            <div class="col-5">
                <input type="number" class="form-control text-center" min="0" onchange="calculateAverage()">
            </div>
            <div class="col-5">
                <input type="number" class="form-control text-center" min="0" onchange="calculateAverage()">
            </div>
        `;
    } else {
        row.innerHTML = `
            <div class="col-2">${gradeCount[tabType]}</div>
            <div class="col-5">
                <input type="number" class="form-control text-center" min="0" max="100" onchange="calculateAverage()">
            </div>
            <div class="col-5">
                <input type="number" class="form-control text-center" min="0" max="100" value="100" onchange="calculateAverage()">
            </div>
        `;
    }

    container.appendChild(row);
    calculateAverage();
}

function resetGrades() {
    const activeTab = document.querySelector('.grade-type-tabs .tab-btn.active');
    if (!activeTab) return;

    const tabType = activeTab.getAttribute('data-calculator-tab');
    const container = document.getElementById(`${tabType}-grades`);

    if (!container) return;

    container.innerHTML = '';
    gradeCount[tabType] = 0;
    document.getElementById('average-result').textContent = '-';
    addGradeRow(tabType);
}

function calculateAverage() {
    const activeTab = document.querySelector('.grade-type-tabs .tab-btn.active');
    if (!activeTab) return;

    const tabType = activeTab.getAttribute('data-calculator-tab');
    const container = document.getElementById(`${tabType}-grades`);

    if (!container) return;

    const rows = container.getElementsByClassName('grade-row');
    let sum = 0;
    let totalWeight = 0;
    let validGrades = 0;

    for (let row of rows) {
        const inputs = row.getElementsByTagName('input');
        const selects = row.getElementsByTagName('select');

        let grade, weight;

        if (tabType === 'points') {
            grade = parseFloat(inputs[0].value);
            const maxGrade = parseFloat(inputs[1].value);
            if (!isNaN(grade) && !isNaN(maxGrade) && maxGrade > 0) {
                grade = (grade / maxGrade) * 100;
                weight = 1;
                validGrades++;
            }
        } else if (tabType === 'letters') {
            const letterGrade = selects[0].value;
            grade = letterGrades[letterGrade];
            weight = parseFloat(inputs[0].value) || 0;
            if (!isNaN(weight) && weight > 0) {
                validGrades++;
            }
        } else {
            grade = parseFloat(inputs[0].value);
            weight = parseFloat(inputs[1].value) || 0;
            if (!isNaN(grade) && !isNaN(weight) && weight > 0) {
                validGrades++;
            }
        }

        if (!isNaN(grade) && !isNaN(weight) && weight > 0) {
            sum += grade * weight;
            totalWeight += weight;
        }
    }

    let result = '-';
    if (validGrades > 0) {
        const average = totalWeight > 0 ? sum / totalWeight : 0;
        result = tabType === 'letters' ? getLetterGrade(average) : `${average.toFixed(2)}%`;
    }

    document.getElementById('average-result').textContent = result;
}

function getLetterGrade(percentage) {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
}

// Final Grade Calculator
function calculateFinalGrade() {
    const isLetterGrade = document.getElementById('final-letters').classList.contains('active');
    let currentGrade, desiredGrade;

    if (isLetterGrade) {
        currentGrade = letterGrades[document.getElementById('current-letter').value];
        desiredGrade = letterGrades[document.getElementById('desired-letter').value];
        weight = parseFloat(document.getElementById('final-letter-weight').value);
    } else {
        currentGrade = parseFloat(document.getElementById('current-grade').value);
        desiredGrade = parseFloat(document.getElementById('desired-grade').value);
        weight = parseFloat(document.getElementById('final-weight').value);
    }

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

    const result = isLetterGrade ? getLetterGrade(neededGrade) : `${neededGrade.toFixed(2)}%`;
    document.getElementById('final-grade-result').textContent = result;
}

function resetFinal() {
    const inputs = document.querySelectorAll('#final-calculator input');
    inputs.forEach(input => input.value = '');
    document.getElementById('final-grade-result').textContent = '-';
}