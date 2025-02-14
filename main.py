from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/terms')
def terms():
    return render_template('legal/terms.html')

@app.route('/privacy')
def privacy():
    return render_template('legal/privacy.html')

@app.route('/disclaimer')
def disclaimer():
    return render_template('legal/disclaimer.html')

@app.route('/request')
def request_calculator():
    return render_template('request.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)