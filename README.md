# Web Coding Challenge

> The coding challenge is about implementing an app that lists shops nearby.

This README will also serve as a checklist during the development process.

## Technical spec

- [x] Your application should be split between a **back-end** and a **web front-end**.

- [x] The **front-end** should ideally be a single page app with a single index.html linking to external JS/CSS/etc.
  - This criteria is respected excluding the login and signup pages.

**back-end**: Django REST framework

## Functional spec

- [x] As a User, I can sign up using my email & password
- [x] As a User, I can sign in using my email & password
- [x] As a User, I can display the list of shops sorted by distance
- [ ] As a User, I can like a shop, so it can be added to my preferred shops

* Bonus points (those items are optional):

- [ ] As a User, I can dislike a shop, so it won’t be displayed within “Nearby Shops” list during the next 2 hours
- [ ] As a User, I can display the list of preferred shops
- [ ] As a User, I can remove a shop from my preferred shops list

## Start up Guide

Preferably set up a clean python virtual environment, with Python 3, you can use the venv module to create a virtual environment for your project:

```bash
λ python -m venv py
λ workon py
```

cd into the api directory and run:

```bash
(py) λ pip install -r requirements.txt
```

You might still need to install [GDAL](https://django.readthedocs.io/en/2.1.x/ref/contrib/gis/install) after this.
If you're on windows you might also run into [this problem.](https://stackoverflow.com/questions/44140241/geodjango-on-windows-try-setting-gdal-library-path-in-your-settings) In my case I had to modify the `(Python Root)\Lib\site-packages\django\contrib\gis\gdal\libgdal.py` file and my particular version of GDAL (gdal204) into the libnames array below:

```python
if lib_path:
    lib_names = None
elif os.name == 'nt':
    # Windows NT shared libraries
    lib_names = ['gdal204', 'gdal203', 'gdal202', 'gdal201', 'gdal20', 'gdal111']
elif os.name == 'posix':
    # *NIX library names.
    lib_names = ['gdal', 'GDAL', 'gdal2.3.0', 'gdal2.2.0', 'gdal2.1.0', 'gdal2.0.0', 'gdal1.11.0']
else:
    raise ImproperlyConfigured('GDAL is unsupported on OS "%s".' % os.name)
```

The Django REST api talks to a Postgis database to allow for location related calculations. A [docker container](https://hub.docker.com/r/kartoza/postgis) can be used for easy set up:

```bash
(py) λ docker run --name=postgisdb -d -e POSTGRES_USER=admin -e POSTGRES_PASS=admin -e POSTGRES_DBNAME=gis -p 9000:5432 kartoza/postgis
```

Make sure the parameters you pass in the docker command are the same as those in the settings.py file:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'gis',
        'USER': 'admin',
        'PASSWORD': 'admin',
        'HOST': 'localhost',
        'PORT': '9000',
    },
}
```
Now you should be ready to migrate the models:

```bash
(py) λ python manage.py makemigrations
(py) λ python manage.py migrate
(py) λ python manage.py runserver
```
The api should be up now at `localhost:8000`.

## API documentation

A GET request to `(API_ROOT)/shops?lon=-6.8243&lat=33.80086` will return a list of shops sorted by ascending distances (in kilometers) from the specified coordinates. Ommiting the parameters will return an unsorted list. 

```json
GET /shops/?lon=-6.8243&lat=33.80086
HTTP 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

[
    {
        "id": 533,
        "name": "Kiggle",
        "picture": "http://placehold.it/150x150",
        "_id": "5a0c6755fb3aac66aafe26e0",
        "location": "SRID=4326;POINT (-6.8244 33.80087)",
        "email": "leilaware@kiggle.com",
        "city": "Rabat",
        "distance": "0.0"
    },
    {
        "id": 602,
        "name": "Proflex",
        "picture": "http://placehold.it/150x150",
        "_id": "5a0c680afd3eb67969316d0e",
        "location": "SRID=4326;POINT (-6.82649 33.80586)",
        "email": "leilaware@proflex.com",
        "city": "Rabat",
        "distance": "0.6"
    },
    {
        "id": 648,
        "name": "Isosphere",
        "picture": "http://placehold.it/150x150",
        "_id": "5a0c687dfd3eb67969316d3c",
        "location": "SRID=4326;POINT (-6.82254 33.80692)",
        "email": "leilaware@isosphere.com",
        "city": "Rabat",
        "distance": "0.7"
    },
    .
    .
    .
```

You can also query specific shops using their id `(API_ROOT)/shops/602?lon=-6.8243&lat=33.80086`:

```json
GET /shops/602/?lon=-6.8243&lat=33.80086
HTTP 200 OK
Allow: GET, PUT, PATCH, DELETE, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "id": 602,
    "name": "Proflex",
    "picture": "http://placehold.it/150x150",
    "_id": "5a0c680afd3eb67969316d0e",
    "location": "SRID=4326;POINT (-6.82649 33.80586)",
    "email": "leilaware@proflex.com",
    "city": "Rabat",
    "distance": "0.6"
}
```

With pagination enabled the response looks a bit different:

```python
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 15
}
```
```json
GET /shops/?lon=-5.5860465999999995&lat=34.7963763

HTTP 200 OK
Allow: GET, POST, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "count": 342,
    "next": "http://localhost:8000/shops/?lat=34.7963763&limit=15&lon=-5.5860465999999995&offset=15",
    "previous": null,
    "results": [
        {
            "id": 718,
            "name": "Filodyne",
            "picture": "http://placehold.it/150x150",
            "_id": "5a0c6b42fd3eb67969316d82",
            "location": "SRID=4326;POINT (-6.747 33.98196)",
            "email": "leilaware@filodyne.com",
            "city": "Rabat",
            "distance": "139.82"
        },
        {
            "id": 698,
            "name": "Filodyne",
            "picture": "http://placehold.it/150x150",
            "_id": "5a0c6b2dfd3eb67969316d6e",
            "location": "SRID=4326;POINT (-6.747 33.98196)",
            "email": "leilaware@filodyne.com",
            "city": "Rabat",
            "distance": "139.82"
        },
        .
        .
        .
```

The authentication endpoints that are used are `(API_ROOT)/rest-auth/login`, `(API_ROOT)/rest-auth/logout` and `(API_ROOT)/rest-auth/registration`. For more specific information on each, check the [official documentation](https://django-rest-auth.readthedocs.io/en/latest/api_endpoints.html)

## Screenshots
![Imgur](https://i.imgur.com/RtpqvUM.png)
![Imgur](https://i.imgur.com/PURjCdT.png)
![Imgur](https://i.imgur.com/HNklDua.png)
