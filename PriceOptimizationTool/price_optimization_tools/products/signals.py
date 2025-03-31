from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Product
from pricing.models import PricingOptimization

def calculate_optimized_price(cost_price, selling_price, stock_available, demand_forecast):
    """
    Calculate the optimized price for a product based on cost price, selling price, 
    available stock, and demand forecast.
    - Uses a stock factor to adjust the price dynamically based on inventory and demand.
    - Ensures a balance between profitability and competitiveness.
    """
    # Stock factor reduces price as stock increases, and increases price as demand grows
    stock_factor = 1 - (stock_available / (stock_available + demand_forecast + 1))
    optimized_price = float(selling_price) * (1 - stock_factor) + float(cost_price) * stock_factor
    return round(optimized_price, 2)

def calculate_demand_forecast(units_sold, stock_available, selling_price):
    """
    Calculate the demand forecast for a product based on:
    - Historical units sold.
    - Available stock.
    - Selling price (higher prices lower demand).
    """
    # Price factor reduces demand as selling price increases, with a minimum threshold of 0.1
    price_factor = max(1 - (float(selling_price) / 100), 0.1)
    # Demand forecast is a combination of sales history and stock availability
    demand_forecast = units_sold * price_factor + (stock_available / 10)
    return round(demand_forecast)

@receiver(post_save, sender=Product)
def create_or_update_pricing_optimization(sender, instance, created, **kwargs):
    """
    Signal to handle the creation or update of `PricingOptimization` whenever a `Product` is added or updated.
    - Triggered automatically after a `Product` instance is saved.
    - Creates or updates the associated `PricingOptimization` entry with calculated or provided values.
    """

    # Retrieve demand forecast and optimized price from `kwargs` (optional values)
    demand_forecast = kwargs.get('demand_forecast', None)
    optimized_price = kwargs.get('optimized_price', None)

    # Ensure at least one of the key values is provided
    if demand_forecast is None and optimized_price is None:
        print("Error: Either `demand_forecast` or `optimized_price` must be provided.")
        return


    if created:
        # If the product is newly created, create a `PricingOptimization` entry
        PricingOptimization.objects.get_or_create(
            product=instance,
            demand_forecast=demand_forecast,
            optimized_price=optimized_price,
        )
    else:
        # If the product is updated, update the existing `PricingOptimization` entry
        try:
            # Attempt to retrieve the existing `PricingOptimization` for the product
            pricing_optimization = PricingOptimization.objects.get(product=instance)
            pricing_optimization.demand_forecast = demand_forecast
            pricing_optimization.optimized_price = optimized_price
            pricing_optimization.save()
        except PricingOptimization.DoesNotExist:
            # If no existing entry exists, create a new one
            PricingOptimization.objects.create(
                product=instance,
                demand_forecast=demand_forecast,
                optimized_price=optimized_price,
            )
