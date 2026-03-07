from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory data storage
tasks = [
    {"id": 1, "title": "Complete Physics Assignment", "completed": False, "deadline": "2026-03-10", "priority": "high", "category": "academics"},
    {"id": 2, "title": "Study for Math Test", "completed": False, "deadline": "2026-03-08", "priority": "medium", "category": "academics"}
]

opportunities = [
    {
        "id": 1,
        "title": "MIT Research Internship",
        "type": "internship",
        "field": "STEM",
        "deadline": "2026-04-15",
        "description": "Summer research program at MIT",
        "url": "https://urop.mit.edu"
    },
    {
        "id": 2,
        "title": "Goldman Sachs Summer Analyst",
        "type": "internship",
        "field": "Business",
        "deadline": "2026-03-30",
        "description": "Investment banking internship",
        "url": "https://goldmansachs.com/careers"
    },
    {
        "id": 3,
        "title": "National Science Olympiad",
        "type": "competition",
        "field": "STEM",
        "deadline": "2026-05-01",
        "description": "Team science competition",
        "url": "https://soinc.org"
    },
    {
        "id": 4,
        "title": "Debate Championship",
        "type": "extracurricular",
        "field": "Humanities",
        "deadline": "2026-04-20",
        "description": "National debate tournament",
        "url": "https://debate.org"
    },
    {
        "id": 5,
        "title": "Harvard Research Fellowship",
        "type": "research",
        "field": "STEM",
        "deadline": "2026-06-01",
        "description": "Summer research at Harvard",
        "url": "https://prise.harvard.edu"
    }
]

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
    return jsonify(tasks)


@app.route('/tasks', methods=['POST'])
def add_task():
    global task_id_counter
    data = request.json
    
    new_task = {
        "id": task_id_counter,
        "title": data.get("title", "Untitled Task"),
        "completed": False,
        "deadline": data.get("deadline"),
        "priority": data.get("priority", "medium"),
        "category": data.get("category", "general"),
        "roadmapId": data.get("roadmapId")
    }
    
    task_id_counter += 1
    tasks.append(new_task)
    return jsonify(new_task), 201


@app.route('/tasks/<int:task_id>', methods=['PATCH'])
def update_task(task_id):
    task = next((t for t in tasks if t["id"] == task_id), None)
    
    if not task:
        return jsonify({"error": "Task not found"}), 404
    
    data = request.json
    
    # Update fields
    if "completed" in data:
        task["completed"] = data["completed"]
    if "deadline" in data:
        task["deadline"] = data["deadline"]
    if "priority" in data:
        task["priority"] = data["priority"]
    if "category" in data:
        task["category"] = data["category"]
    
    return jsonify(task)


@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    task = next((t for t in tasks if t["id"] == task_id), None)
    
    if not task:
        return jsonify({"error": "Task not found"}), 404
    
    tasks = [t for t in tasks if t["id"] != task_id]
    return jsonify({"message": "Task deleted", "id": task_id})


# ==================== OPPORTUNITIES ENDPOINTS ====================

@app.route('/opportunities', methods=['GET'])
def get_opportunities():
    filtered = opportunities.copy()
    
    # Filter by type
    opp_type = request.args.get('type')
    if opp_type:
        filtered = [o for o in filtered if o["type"].lower() == opp_type.lower()]
    
    # Filter by field
    field = request.args.get('field')
    if field:
        filtered = [o for o in filtered if o["field"].lower() == field.lower()]
    
    # Search by keyword
    search = request.args.get('search')
    if search:
        search_lower = search.lower()
        filtered = [o for o in filtered if 
                   search_lower in o["title"].lower() or 
                   search_lower in o["description"].lower()]
    
    return jsonify(filtered)


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
    completed_tasks = len([t for t in tasks if t["completed"]])
    
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


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5050))
    app.run(host='0.0.0.0', port=port, debug=True)
