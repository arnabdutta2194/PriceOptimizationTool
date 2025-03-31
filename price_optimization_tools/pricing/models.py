from django.db import models
from products.models import Product

class PricingOptimization(models.Model):
    """
    Model to represent the pricing optimization for a product.
    - Stores the demand forecast and optimized price for a product.
    - This model is related to the `Product` model via a one-to-one relationship.
    """

    # One-to-one relationship with the Product model
    # Each product can have exactly one pricing optimization entry.
    # If the associated product is deleted, this record will also be deleted.
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name="pricing_optimization")

    # The forecasted demand for the product (optional field, supports null values)
    # This value is used to adjust the pricing strategy.
    demand_forecast = models.PositiveIntegerField(null=True, blank=True)

    # The optimized price for the product, based on the demand forecast and other factors
    # This is the price that should be used for selling the product after optimization.
    # It is stored as a decimal with up to 10 digits, 2 of which are after the decimal point.
    optimized_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        """
        String representation of the PricingOptimization instance.
        - Returns a readable format for identifying the product associated with the pricing optimization.
        """
        return f"Pricing Optimization for {self.product.name}"
