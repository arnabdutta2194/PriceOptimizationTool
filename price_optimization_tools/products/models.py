from django.db import models

class Product(models.Model):
    """
    Model to represent a product in the system.
    - Stores information such as name, category, pricing, stock, and sales.
    - Includes timestamps for tracking creation and updates.
    """

    # Name of the product (e.g., "Notebook")
    name = models.CharField(max_length=255)

    # Category the product belongs to (e.g., "Stationary", "Electronics")
    category = models.CharField(max_length=255)

    # Cost price of the product (used for pricing calculations)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)

    # Selling price of the product (price offered to customers)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)

    # Description providing additional details about the product
    description = models.TextField()

    # Number of units currently available in stock
    stock_available = models.PositiveIntegerField()

    # Total units sold to date (used for demand forecasting)
    units_sold = models.PositiveIntegerField(default=0)

    # Timestamp indicating when the product was created
    create_timestamp = models.DateTimeField(auto_now_add=True)  # Automatically set at creation

    # Timestamp indicating the last update to the product's information
    updated_timestamp = models.DateTimeField(auto_now=True)  # Automatically updated on save

    # Customer rating for the product (optional field, supports null values)
    customer_rating = models.FloatField(null=True, blank=True)

    def __str__(self):
        """
        String representation of the Product instance.
        - Returns the product's name for easier identification in queries and logs.
        """
        return self.name
