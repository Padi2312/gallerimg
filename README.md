# Gallerimg

Gallerimg is a simple image gallery website. It allows a user to upload images and view them in a gallery. The user can also delete images from the gallery.

## Installation

TBD

## Data Paths

- `data/db.sqlite` - SQLite database file
- `data/images` - Image uploads directory

## Environment Variables

| Env variable     | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
| `AUTH_SECRET`    | Secret key for JWT authentication. _(default: secret)_             |
| `ADMIN_USERNAME` | Username for the admin account. _(default: admin)_                 |
| `ADMIN_PASSWORD` | Password for the admin account. _(default: admin)_                 |
| `LOG_LEVEL`      | Logging level for the application. (default: 0)                    |
| `MAIL_HOST`      | SMTP server host for sending emails. (default: none)               |
| `MAIL_PORT`      | SMTP server port for sending emails. (default: none)               |
| `MAIL_USER`      | SMTP server username for sending emails. (default: none)           |
| `MAIL_PASS`      | SMTP server password for sending emails. (default: none)           |
| `MAIL_FROM`      | Email address for the "From" field in sent emails. (default: none) |


