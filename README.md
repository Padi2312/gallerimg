# Gallerimg

Gallerimg is a simple image gallery website. It allows a user to upload images and view them in a gallery. The user can also delete images from the gallery.

## Installation

TBD

## Data Paths

- `data/db.sqlite` - SQLite database file
- `data/images` - Image uploads directory

## Environment Variables

| Env variable     | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| `SQLITE_PATH`    | Path to the SQLite database file. _(default: data/db.sqlite)_ |
| `AUTH_SECRET`    | Secret key for JWT authentication. _(default: secret)_        |
| `ADMIN_USERNAME` | Username for the admin account. _(default: admin)_            |
| `ADMIN_PASSWORD` | Password for the admin account. _(default: admin)_            |



