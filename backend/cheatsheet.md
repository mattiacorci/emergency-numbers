# Django cheat sheet

## Progetto e app

```bash
# Crea nuovo progetto
django-admin startproject nome_progetto

# Crea nuova app dentro il progetto
python manage.py startapp nome_app
```

---

## Server di sviluppo

```bash
python manage.py runserver
python manage.py runserver 8080        # porta custom
python manage.py runserver 0.0.0.0:8000  # raggiungibile da altri dispositivi
```

---

## Migrazioni

```bash
# Genera le migrazioni dai modelli
python manage.py makemigrations

# Genera migrazione per una app specifica
python manage.py makemigrations nome_app

# Genera migrazione vuota (per data migration o seed)
python manage.py makemigrations nome_app --empty --name descrizione

# Applica le migrazioni al DB
python manage.py migrate

# Applica solo fino a una migrazione specifica
python manage.py migrate nome_app 0002

# Rollback all'ultima migrazione applicata prima di una specifica
python manage.py migrate nome_app 0001

# Vedi stato delle migrazioni
python manage.py showmigrations
python manage.py showmigrations nome_app

# Vedi il SQL che verrebbe eseguito senza applicarlo
python manage.py sqlmigrate nome_app 0002
```

---

## Shell e DB

```bash
# Shell interattiva Django (con ORM disponibile)
python manage.py shell

# Svuota il DB e riapplica tutte le migrazioni da zero
python manage.py flush

# Crea superuser per l'admin
python manage.py createsuperuser
```

### Query comuni nella shell

```python
from api.models import EmergencyRegion, EmergencyNumber

# Tutti i record
EmergencyRegion.objects.all()

# Filtro
EmergencyRegion.objects.filter(status='active')

# Singolo record (lancia eccezione se non trovato)
EmergencyRegion.objects.get(iso_code='IT')

# Crea record
EmergencyRegion.objects.create(iso_code='DE', name='Germania')

# Aggiorna
EmergencyRegion.objects.filter(iso_code='IT').update(status='active')

# Elimina
EmergencyRegion.objects.filter(iso_code='XX').delete()

# Con relazioni precaricate (evita N+1 query)
EmergencyRegion.objects.prefetch_related('numbers').get(iso_code='IT')
```

---

## Fixtures (alternativa alle data migration)

```bash
# Esporta dati esistenti in un file JSON
python manage.py dumpdata nome_app --indent 2 > fixture.json

# Importa dati da fixture
python manage.py loaddata fixture.json
```

---

## Dipendenze

```bash
# Congela tutte le dipendenze installate
pip freeze > requirements.txt

# Solo dipendenze dirette (senza sub-dipendenze)
pip install pip-chill
pip-chill > requirements.txt

# Installa da requirements
pip install -r requirements.txt
```

---

## Static files

```bash
# Raccoglie tutti gli static files in STATIC_ROOT (per produzione)
python manage.py collectstatic
```

---

## Testing

```bash
# Esegui tutti i test
python manage.py test

# Test di una app specifica
python manage.py test nome_app

# Test di un file specifico
python manage.py test nome_app.tests.test_views
```

---

## Admin

Registra i modelli in `nome_app/admin.py` per vederli nell'interfaccia `/admin/`:

```python
from django.contrib import admin
from .models import EmergencyRegion, EmergencyNumber

admin.site.register(EmergencyRegion)
admin.site.register(EmergencyNumber)
```

Poi accedi a `http://127.0.0.1:8000/admin/` con le credenziali del superuser.

---

## Struttura file di riferimento

```
progetto/
├── manage.py
├── requirements.txt
├── progetto/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── nome_app/
    ├── migrations/
    │   ├── 0001_initial.py
    │   └── 0002_seed_data.py
    ├── admin.py
    ├── models.py
    ├── serializers.py
    ├── services.py
    ├── views.py
    ├── urls.py
    └── tests.py
```