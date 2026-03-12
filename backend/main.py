from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS 
from datetime import datetime
import os

app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"])
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nexdex.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# In-memory data storage
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    tasks = db.relationship('Task', backref='owner', lazy=True)

class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    completed = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

class Opportunity(db.Model):
    __tablename__ = 'opportunities'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50)) 
    field = db.Column(db.String(50)) 
    deadline = db.Column(db.String(50))
    description = db.Column(db.Text)
    url = db.Column(db.String(500))

roadmaps = [
    {
        "id": 1,
        "title": "Path to MIT",
        "targetSchool": "MIT",
        "milestones": [
            {"id": 1, "title": "Take AP Calculus BC", "completed": False, "year": "Junior"},
            {"id": 2, "title": "Join robotics team", "completed": False, "year": "Sophomore"},
            {"id": 3, "title": "Complete science research project", "completed": False, "year": "Junior"},
            {"id": 4, "title": "Score 1500+ on SAT", "completed": False, "year": "Junior"}
        ]
    },
    {
        "id": 2,
        "title": "Path to Stanford",
        "targetSchool": "Stanford",
        "milestones": [
            {"id": 1, "title": "Start a tech startup/project", "completed": False, "year": "Junior"},
            {"id": 2, "title": "Win hackathon", "completed": False, "year": "Sophomore"},
            {"id": 3, "title": "Leadership role in club", "completed": False, "year": "Junior"},
            {"id": 4, "title": "Strong personal essay", "completed": False, "year": "Senior"}
        ]
    }
]

task_id_counter = 3
roadmap_id_counter = 3


# ==================== TASKS ENDPOINTS ====================

@app.route('/tasks', methods=['GET'])
def get_tasks():
    all_tasks = Task.query.all()

    results = []
    for task in all_tasks:
        results.append({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "user_id": task.user_id
        })
    return jsonify(results)


@app.route('/tasks', methods=['POST'])
def add_task():
    global task_id_counter
    data = request.json

    if not data or 'title' not in data or data['title'].strip() == "":
        return jsonify({"error": "Title is required and cannot be empty"}), 400
    
    if 'user_id' not in data:
        return jsonify({"error": "user_id is required to link this task"}), 400
   
    new_task = Task(
        title = data.get("title"),
        description = data.get("description"),
        user_id = data.get("user_id")
    )

    db.session.add(new_task)
    db.session.commit()
    
    return jsonify({"message": "Task created", "id": new_task.id}), 201


@app.route('/tasks/<int:task_id>', methods=['PATCH', 'PUT'])
def update_task(task_id):
    task = Task.query.get(task_id)
    
    if not task:
        return jsonify({"error": "Task not found"}), 404
    
    data = request.json
    
    # Update fields
    if "title" in data:
        task.title = data["title"]
    if "description" in data:
        task.description = data["description"]
    if "completed" in data:
        task.completed = data["completed"]

    db.session.commit()
    
    return jsonify({"message": "Task updated", "id": task.id})


@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    task = Task.query.get(task_id)
    
    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()    
    
    return jsonify({"message": "Task deleted", "id": task_id}), 200


# ==================== OPPORTUNITIES ENDPOINTS ====================

@app.route('/opportunities', methods=['GET'])
def get_opportunities():
    query = Opportunity.query

    opp_type = request.args.get('type')
    field = request.args.get('field')

    if opp_type:
        query = query.filter(Opportunity.type.ilike(opp_type))
    if field:
        query = query.filter(Opportunity.field.ilike(field))

    results = query.all()
    return jsonify([{
        "id": o.id,
        "title": o.title,
        "type": o.type,
        "field": o.field
    } for o in results])
    
# ==================== ROADMAPS ENDPOINTS ====================

@app.route('/roadmaps', methods=['GET'])
def get_roadmaps():
    return jsonify(roadmaps)


@app.route('/roadmaps', methods=['POST'])
def create_roadmap():
    global roadmap_id_counter
    data = request.json
    
    new_roadmap = {
        "id": roadmap_id_counter,
        "title": data.get("title", "New Roadmap"),
        "targetSchool": data.get("targetSchool", ""),
        "milestones": data.get("milestones", [])
    }
    
    roadmap_id_counter += 1
    roadmaps.append(new_roadmap)
    return jsonify(new_roadmap), 201


@app.route('/roadmaps/<int:roadmap_id>/milestones/<int:milestone_id>', methods=['PATCH'])
def toggle_milestone(roadmap_id, milestone_id):
    roadmap = next((r for r in roadmaps if r["id"] == roadmap_id), None)
    
    if not roadmap:
        return jsonify({"error": "Roadmap not found"}), 404
    
    milestone = next((m for m in roadmap["milestones"] if m["id"] == milestone_id), None)
    
    if not milestone:
        return jsonify({"error": "Milestone not found"}), 404
    
    data = request.json
    milestone["completed"] = data.get("completed", not milestone["completed"])
    
    return jsonify(roadmap)


# ==================== AI SUGGESTIONS ENDPOINT ====================

@app.route('/suggest', methods=['GET'])
def get_suggestion():
    completed_tasks = Task.query.filter_by(completed=True).count()
    
    suggestions = [
        "Focus on completing high-priority tasks first!",
        "Break down large tasks into smaller milestones.",
        "Review your progress weekly to stay on track.",
        "Consider researching scholarships for your target schools.",
        "Join study groups to improve collaboration skills."
    ]
    
    suggestion_index = completed_tasks % len(suggestions)
    
    return jsonify({
        "suggestion": suggestions[suggestion_index],
        "tasksCompleted": completed_tasks
    })


# ==================== HEALTH CHECK ====================

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        "status": "running",
        "message": "NexDex Backend (Python/Flask)",
        "endpoints": {
            "tasks": "/tasks",
            "opportunities": "/opportunities",
            "roadmaps": "/roadmaps",
            "suggest": "/suggest"
        }
    })

with app.app_context():
    db.create_all()

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found", "status": 400}), 400

@app.errorhandler(500)
def server_error(error):
    return jsonify({"error:" "Internal server error", "status"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5050))
    app.run(host='0.0.0.0', port=port, debug=True)
