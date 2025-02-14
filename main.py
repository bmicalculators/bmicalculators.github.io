from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about-us')
def about():
    return render_template('about.html')

@app.route('/what-is-bmi')
def what_is_bmi():
    return render_template('what_is_bmi.html')

@app.route('/resources')
def resources():
    return render_template('resources.html')

@app.route('/bmi-women')
def bmi_women():
    return render_template('bmi_women.html')

@app.route('/bmi-men')
def bmi_men():
    return render_template('bmi_men.html')

@app.route('/articles/healthy-eating')
def healthy_eating():
    return render_template('articles/healthy_eating.html')

@app.route('/articles/physical-activity')
def physical_activity():
    return render_template('articles/physical_activity.html')

@app.route('/articles/nutrition-labels')
def nutrition_labels():
    return render_template('articles/nutrition_labels.html')

@app.route('/terms')
def terms():
    return render_template('legal/terms.html')

@app.route('/privacy')
def privacy():
    return render_template('legal/privacy.html')

@app.route('/disclaimer')
def disclaimer():
    return render_template('legal/disclaimer.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)