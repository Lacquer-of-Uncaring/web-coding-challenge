# Web Coding Challenge

> The coding challenge is about implementing an app that lists shops nearby.

This README will also serve as a checklist during the development process.

## Technical spec

- [x] Your application should be split between a **back-end** and a **web front-end**.

- [ ] The **front-end** should ideally be a single page app with a single index.html linking to external JS/CSS/etc.
  - This criteria is respected excluding the login and signup pages.

**back-end**: Django REST framework

## Functional spec

- [ ] As a User, I can sign up using my email & password
- [ ] As a User, I can sign in using my email & password
- [ ] As a User, I can display the list of shops sorted by distance
- [ ] As a User, I can like a shop, so it can be added to my preferred shops

* Bonus points (those items are optional):

- [ ] As a User, I can dislike a shop, so it won’t be displayed within “Nearby Shops” list during the next 2 hours
- [ ] As a User, I can display the list of preferred shops
- [ ] As a User, I can remove a shop from my preferred shops list

## Start up Guide

### Back-end

Preferably set up a clean python virtual environment, with Python 3, you can use the venv module to create a virtual environment for your project:

```bash
λ python -m venv py
λ workon py
```

cd into the api directory and run:

```bash
(py) λ pip install -r requirements.txt
```

You might still need to install GDAL after this.
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

The Django REST api talks to a Postgis database to allow for loacation related calculations. A [docker container](https://hub.docker.com/r/kartoza/postgis) can be used for easy set up:

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
The api should be up now at `localhost:8000`

## Mockups

![Main Page - List of shops neaby my location sorted by distance](https://d2mxuefqeaa7sj.cloudfront.net/s_42947E7C35A750A25D07D7432619573EA3862052B5357BE997A071FD6789712E_1510745488079_Assignment+-+FullStack+Web.png)

![My Preferred Shop page - List of already preferred shops](https://d2mxuefqeaa7sj.cloudfront.net/s_42947E7C35A750A25D07D7432619573EA3862052B5357BE997A071FD6789712E_1510745502935_Assignment+-+FullStack+Web+copy.png)
