"""NexDex Flask application factory."""
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def create_app(config=None):
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # Load config from environment
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URI",
        "sqlite:///nexdex.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")

    if config:
        app.config.update(config)

    db.init_app(app)

    with app.app_context():
        from app import models  # noqa: F401
        db.create_all()

    return app
