from flask import Flask, request, jsonify
import random

app = Flask(__name__)

# In-memory storage (replace with database in production)
users = {}
assessments = {}

# Mock scoring logic (simplified)
def calculate_mi_type(scores):
    total = sum(scores.values())
    if total > 60: return "HCT"  # High Change Threshold
    elif total > 40: return "MCT"  # Medium Change Threshold
    else: return "LCT"  # Low Change Threshold

def calculate_mtra(scores):
    sf = scores.get('sf', 0)  # Self-Focus
    tr = scores.get('tr', 0)  # Task Resilience
    er = scores.get('er', 0)  # Emotional Resilience
    return {"sf": sf, "tr": tr, "er": er}

def generate_highertends(ctype):
    highertends = {"HCT": ["Adaptability", "Innovation"],
                   "MCT": ["Balance", "Consistency"],
                   "LCT": ["Stability", "Detail"]} 
    return highertends.get(ctype, [])

def generate_egotends(ctype):
    egotends = {"HCT": ["Overextension", "Impulsivity"],
                "MCT": ["Indecision", "Routine"],
                "LCT": ["Resistance", "Perfectionism"]}
    return egotends.get(ctype, [])

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if username and password and username not in users:
        users[username] = {"password": password, "profile": {}}
        return jsonify({"message": "User registered", "status": "success"})
    return jsonify({"message": "Username taken or invalid", "status": "error"})

@app.route('/submit_assessment', methods=['POST'])
def submit_assessment():
    data = request.json
    username = data.get('username')
    if username in users:
        mi_type_scores = {q: random.randint(1, 10) for q in ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10']}
        mtra_scores = {"sf": random.randint(1, 10), "tr": random.randint(1, 10), "er": random.randint(1, 10)}
        change_threshold = calculate_mi_type(mi_type_scores)
        mtra_result = calculate_mtra(mtra_scores)
        highertends = generate_highertends(change_threshold)
        egotends = generate_egotends(change_threshold)
        profile = {
            "change_threshold": change_threshold,
            "mtra": mtra_result,
            "highertends": highertends,
            "egotends": egotends
        }
        users[username]["profile"] = profile
        assessments[username] = {"mi_type": mi_type_scores, "mtra": mtra_result}
        return jsonify({"message": "Assessment submitted", "profile": profile, "status": "success"})
    return jsonify({"message": "User not found", "status": "error"})

@app.route('/get_profile', methods=['GET'])
def get_profile():
    username = request.args.get('username')
    if username in users and users[username].get("profile"):
        return jsonify({"profile": users[username]["profile"], "status": "success"})
    return jsonify({"message": "Profile not found", "status": "error"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)