document.addEventListener('DOMContentLoaded', function() {
    // Unit toggle handlers
    const metricRadio = document.getElementById('metric');
    const imperialRadio = document.getElementById('imperial');
    const metricInputs = document.getElementById('metric-inputs');
    const imperialInputs = document.getElementById('imperial-inputs');

    if (metricRadio && imperialRadio) {
        metricRadio.addEventListener('change', function() {
            metricInputs.style.display = 'block';
            imperialInputs.style.display = 'none';
        });

        imperialRadio.addEventListener('change', function() {
            metricInputs.style.display = 'none';
            imperialInputs.style.display = 'block';
        });
    }

    // Initialize BMI Chart
    const ctx = document.getElementById('bmiChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Underweight', 'Normal', 'Overweight', 'Obese'],
                datasets: [{
                    label: 'BMI Ranges',
                    data: [18.5, 24.9, 29.9, 35],
                    backgroundColor: [
                        'rgba(23, 162, 184, 0.5)',  // Info
                        'rgba(40, 167, 69, 0.5)',   // Success
                        'rgba(255, 193, 7, 0.5)',   // Warning
                        'rgba(220, 53, 69, 0.5)'    // Danger
                    ],
                    borderColor: [
                        'rgb(23, 162, 184)',
                        'rgb(40, 167, 69)',
                        'rgb(255, 193, 7)',
                        'rgb(220, 53, 69)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 40
                    }
                }
            }
        });
    }
});

function calculateBMI(gender) {
    let weight, height;
    const metricRadio = document.getElementById('metric');
    
    if (metricRadio.checked) {
        weight = parseFloat(document.getElementById('weight-kg').value);
        height = parseFloat(document.getElementById('height-cm').value) / 100; // Convert cm to meters
    } else {
        // Convert imperial to metric
        weight = parseFloat(document.getElementById('weight-lb').value) * 0.453592; // Convert lbs to kg
        const feet = parseFloat(document.getElementById('height-ft').value);
        const inches = parseFloat(document.getElementById('height-in').value) || 0;
        height = (feet * 12 + inches) * 0.0254; // Convert feet/inches to meters
    }

    if (!weight || !height || height <= 0) {
        alert('Please enter valid values for weight and height.');
        return;
    }

    const bmi = weight / (height * height);
    const bmiResult = document.getElementById('bmi-result');
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');

    bmiValue.textContent = bmi.toFixed(1);
    
    let category;
    let categoryClass;
    
    if (bmi < 18.5) {
        category = 'Underweight';
        categoryClass = 'text-info';
    } else if (bmi < 25) {
        category = 'Normal Weight';
        categoryClass = 'text-success';
    } else if (bmi < 30) {
        category = 'Overweight';
        categoryClass = 'text-warning';
    } else {
        category = 'Obese';
        categoryClass = 'text-danger';
    }

    bmiCategory.textContent = category;
    bmiCategory.className = `lead ${categoryClass}`;
    bmiResult.style.display = 'block';
}
