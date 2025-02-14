// Grade letter to percentage conversion
const letterGrades = {
    'A+': 97, 'A': 93, 'A-': 90,
    'B+': 87, 'B': 83, 'B-': 80,
    'C+': 77, 'C': 73, 'C-': 70,
    'D+': 67, 'D': 63, 'D-': 60,
    'F': 0
};

// EZ Grader Calculator
function calculateEZGrade() {
    const total = parseInt(document.getElementById('total-questions').value);
    const correct = parseInt(document.getElementById('correct-answers').value);
    
    if (isNaN(total) || isNaN(correct) || total <= 0 || correct < 0 || correct > total) {
        document.getElementById('ez-grade-result').textContent = 'Invalid input';
        return;
    }

    const percentage = (correct / total) * 100;
    document.getElementById('ez-grade-result').textContent = `${percentage.toFixed(2)}%`;
}

// Average Grade Calculator
function calculateAverage() {
    const gradeType = document.getElementById('average-grade-type').value;
    const gradesText = document.getElementById('grades-list').value;
    const grades = gradesText.split('\n').filter(grade => grade.trim() !== '');

    if (grades.length === 0) {
        document.getElementById('average-result').textContent = 'No grades entered';
        return;
    }

    let sum = 0;
    let validGrades = 0;

    for (let grade of grades) {
        grade = grade.trim().toUpperCase();
        let value;

        switch (gradeType) {
            case 'percentage':
                value = parseFloat(grade);
                break;
            case 'points':
                value = parseFloat(grade);
                break;
            case 'letter':
                value = letterGrades[grade];
                break;
        }

        if (!isNaN(value)) {
            sum += value;
            validGrades++;
        }
    }

    if (validGrades === 0) {
        document.getElementById('average-result').textContent = 'Invalid grades';
        return;
    }

    const average = sum / validGrades;
    let result;

    if (gradeType === 'letter') {
        result = getLetterGrade(average);
    } else {
        result = `${average.toFixed(2)}${gradeType === 'percentage' ? '%' : ' points'}`;
    }

    document.getElementById('average-result').textContent = result;
}

// Final Grade Calculator
function calculateFinalGrade() {
    const gradeType = document.getElementById('final-grade-type').value;
    const currentGrade = document.getElementById('current-grade').value;
    const finalWeight = parseFloat(document.getElementById('final-weight').value);
    const desiredGrade = document.getElementById('desired-grade').value;

    if (isNaN(finalWeight) || finalWeight < 0 || finalWeight > 100) {
        document.getElementById('final-grade-result').textContent = 'Invalid weight';
        return;
    }

    let currentValue, desiredValue;

    if (gradeType === 'points') {
        currentValue = parseFloat(currentGrade);
        desiredValue = parseFloat(desiredGrade);
    } else {
        currentValue = letterGrades[currentGrade.toUpperCase()];
        desiredValue = letterGrades[desiredGrade.toUpperCase()];
    }

    if (isNaN(currentValue) || isNaN(desiredValue)) {
        document.getElementById('final-grade-result').textContent = 'Invalid grades';
        return;
    }

    const currentWeight = 100 - finalWeight;
    const neededGrade = (desiredValue - (currentValue * currentWeight / 100)) / (finalWeight / 100);

    if (neededGrade > 100) {
        document.getElementById('final-grade-result').textContent = 'Not possible';
        return;
    }

    let result;
    if (gradeType === 'letter') {
        result = getLetterGrade(neededGrade);
    } else {
        result = `${neededGrade.toFixed(2)} points`;
    }

    document.getElementById('final-grade-result').textContent = result;
}

// Helper function to convert percentage to letter grade
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
