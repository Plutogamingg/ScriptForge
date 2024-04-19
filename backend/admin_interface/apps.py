from django.apps import AppConfig

class AdminInterfaceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'admin_interface'

    def ready(self):
        # I import the signals here to ensure they are connected when the app is ready.
        # This is necessary because signals should only be connected after all the apps are loaded
        # to avoid missing any signals from models being loaded after the signals are connected.
        import admin_interface.signals  # @UnusedImport
