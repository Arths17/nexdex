# NexDex – SQL Schema Summary

Quick reference for building API endpoints. ORM: Flask-SQLAlchemy.

---

## Tables

### `users`

| Column        | Type         | Constraints              |
|---------------|--------------|--------------------------|
| `id`          | INTEGER      | PRIMARY KEY              |
| `username`    | VARCHAR(80)  | UNIQUE, NOT NULL         |
| `email`       | VARCHAR(120) | UNIQUE, NOT NULL         |
| `password_hash` | VARCHAR(256) | NOT NULL               |
| `created_at`  | DATETIME     | DEFAULT current timestamp |

**Relations:** One user has many **tasks** (one-to-many).

---

### `tasks`

| Column        | Type         | Constraints              |
|---------------|--------------|--------------------------|
| `id`          | INTEGER      | PRIMARY KEY              |
| `title`       | VARCHAR(200) | NOT NULL                 |
| `description` | TEXT         | nullable                 |
| `completed`   | BOOLEAN      | NOT NULL, default `false`|
| `created_at`  | DATETIME     | DEFAULT current timestamp|
| `user_id`     | INTEGER      | NOT NULL, FK → `users.id`|

**Relations:** Many tasks belong to one **user** (many-to-one).

---

## Relationship

```
users (1) ─────────────< tasks (many)
   id                        user_id
```

- **User → Task:** one-to-many; delete user → cascade delete their tasks.
- **Task → User:** many-to-one; every task has a required `user_id`.

---

## Endpoint hints

- **Users:** CRUD on `users`; auth uses `username`/`email` and `password_hash` (never expose hash).
- **Tasks:** CRUD on `tasks`; filter/list by `user_id` (and optionally `completed`); enforce that `user_id` matches the authenticated user.
