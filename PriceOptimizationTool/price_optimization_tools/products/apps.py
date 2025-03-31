from django.apps import AppConfig


class ProductsConfig(AppConfig):
    """
    Configuration class for the `products` application.
    - Sets default behavior for the app.
    - Registers app-specific signals during initialization.
    """

    # Specifies the default field type for auto-generated primary keys
    default_auto_field = 'django.db.models.BigAutoField'

    # Name of the application
    name = 'products'

    def ready(self):
        """
        This method is called when the application is ready.
        - Used to perform app-specific initialization.
        - Registers the signal handlers for the `products` app.
        """
        import products.signals  # Ensures the signals module is imported and signals are connected
