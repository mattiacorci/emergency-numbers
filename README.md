# Emergency Numbers

Find the right emergency number for wherever you are, automatically.

The app detects your current location, resolves it to an administrative region, and returns the emergency numbers that actually apply there — falling back gracefully when no local data exists yet (e.g. city → region → country).

**Live demo:** [emergency-numbers.vercel.app](https://emergency-numbers.vercel.app)

## How it works

1. The frontend requests the browser's geolocation.
2. Coordinates are reverse-geocoded via the [OpenStreetMap Nominatim API](https://nominatim.org/) to get an ISO 3166-2 region code (e.g. `IT-VR`).
3. The backend's `EmergencyResolver` looks up that exact region. If no active, non-expired data exists for it, it walks up the hierarchy (`IT-VR` → `IT`) until it finds a region that does.
4. The matched region's emergency numbers, plus an interactive map of the user's position, are rendered on the page.

This cascading resolution means the dataset can be filled in gradually, region by region, without ever returning a dead end for a country that's only partially covered.

## Tech Stack

**Backend**
- Django 6 + Django REST Framework
- PostgreSQL in production (SQLite for local dev), via `dj-database-url`
- `drf-spectacular` for auto-generated OpenAPI schema and Swagger docs
- `django-cors-headers`, `gunicorn`
- Tested with Django's built-in test framework

**Frontend**
- React 19 + TypeScript, built with Vite
- Tailwind CSS v4 + shadcn/ui (Radix-based components)
- React Leaflet for the interactive map
- Vitest + React Testing Library + jsdom for testing

**CI/CD**
- Two independent GitHub Actions workflows (`django.yml`, `frontend.yml`), triggered on push/PR to `main`
- Backend: install dependencies → run Django test suite
- Frontend: install → lint → test → build

## API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health/` | Health check |
| `GET` | `/api/emergency-numbers/<iso_code>/` | Resolves emergency numbers for a given ISO 3166-1 / 3166-2 code |
| `GET` | `/api/schema/` | OpenAPI schema (JSON) |
| `GET` | `/api/docs/` | Interactive Swagger UI |

Example:

```
GET /api/emergency-numbers/IT-VR/
```

```json
{
  "iso_code": "IT",
  "name": "Italy",
  "status": "active",
  "valid_until": null,
  "last_verified": "2026-06-20",
  "source_url": "",
  "numbers": [
    { "number": "112", "number_type": "general", "label": "", "is_primary": true }
  ],
  "requested": "IT-VR",
  "resolved_from": "IT"
}
```

`requested` vs `resolved_from` makes the fallback explicit: the client asked for the Verona province, but the response was resolved at the country level because no province-specific data exists yet.

## Project Structure

```
backend/
  api/
    models.py        # EmergencyRegion (hierarchical, ISO 3166) and EmergencyNumber
    resolvers.py      # EmergencyResolver — cascading lookup logic
    serializers.py
    views.py
    urls.py
    tests/
  config/             # Django project settings, root URLs
  manage.py
  requirements.txt
  Procfile

frontend/
  src/
    features/
      location/       # geolocation, reverse geocoding, map view
      emergency/       # emergency numbers fetching and display
    components/ui/     # shadcn/ui components
    pages/
    config/
    types/
```

## Getting Started

### Prerequisites
- Python 3.13+
- Node.js 24+

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # set SECRET_KEY
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`, with Swagger docs at `http://localhost:8000/api/docs/`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

> From the repo root, `npm run be` and `npm run fe` start the backend and frontend respectively.

## Running Tests

```bash
# Backend
cd backend
python manage.py test api

# Frontend
cd frontend
npm run test:run
```

## License

[Unlicense](LICENSE.md) — public domain.
