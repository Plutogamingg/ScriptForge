"""
Django settings for scriptforge project.

Generated by 'django-admin startproject' using Django 4.2.6.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
import dj_database_url
from datetime import timedelta
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-8kupx7q=zhs_koou@mnej*av6zoft6-yd-&o0se8hd5j)u)@6w'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['scriptforge-backend-aa91ce867da3.herokuapp.com', 
                 'localhost', 
                 '127.0.0.1',  
                 'http://localhost:3000',
                 'http://localhost:5000/',
                 ]

CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
                 'https://scriptforge-cccdcc8042f1.herokuapp.com',
                 'http://localhost:3000', 
                 'https://scriptforge-backend-aa91ce867da3.herokuapp.com' # For React development server
]
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTP_ONLY = True
CSRF_TRUSTED_ORIGINS = [
                 'https://scriptforge-cccdcc8042f1.herokuapp.com',
                 'http://localhost:3000', 
                 'https://scriptforge-backend-aa91ce867da3.herokuapp.com'
]
CORS_EXPOSE_HEADERS = ["Content-Type", "X-CSRFToken"]
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SAMESITE = "None"

# Application definition
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'admin_interface.authenticate.CustomJWTAuthentication',
    ),
     "DEFAULT_PERMISSION_CLASSES": [
        'rest_framework.permissions.AllowAny',
    ]
}

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'rest_framework',
    'admin_interface',
    'script_generation',
    'script_management',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'scriptforge.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'scriptforge.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

BASE_DIR = Path(__file__).resolve().parent.parent

# Default configuration for local development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
        'OPTIONS': {
            'timeout': 20,  # Set timeout to 20 seconds
        },
    }
}

# Override with Heroku's database configuration if DATABASE_URL is present
DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL:
    DATABASES['default'] = dj_database_url.config(default=DATABASE_URL, conn_max_age=600, ssl_require=True)



# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

APPEND_SLASH = False

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'admin_interface.User'

# Attempt to get the JWT secret key from an environment variable
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

# Fall back to a less secure default key, but only if running in a local development environment
# IMPORTANT: Remove or ensure this fallback is not used in production!
if not JWT_SECRET_KEY:
    print("Warning: Using a default secret key for local development only.")
    JWT_SECRET_KEY = 'local_default_secret_key'


SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,  # Use your Django project's secret key
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),

    # Custom settings for JWT Authentication cookies
    'AUTH_COOKIE': 'access',  # Name of the cookie to hold the access token
    'AUTH_COOKIE_REFRESH': 'refresh',  # Name of the cookie to hold the refresh token

    # Domain for the cookies; use None for standard domain cookie.
    'AUTH_COOKIE_DOMAIN': None,

    # Security settings for the cookies
    'AUTH_COOKIE_SECURE': True,  # Secure flag (set to True if using HTTPS)
    'AUTH_COOKIE_HTTP_ONLY': True,  # HTTPOnly flag (not accessible via JavaScript)

    # Cookie path; defines the path for which the cookie is valid.
    'AUTH_COOKIE_PATH': '/',

    # SameSite flag restricts how cookies are sent with requests from external sites.
    # Can be 'Lax', 'Strict', or 'None'. (Requires Secure=True if set to 'None')
    'AUTH_COOKIE_SAMESITE': 'Lax',

}


