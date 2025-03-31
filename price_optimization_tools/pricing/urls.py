from django.urls import path
from .views import DemandForecastView, PricingOptimizationView

# Define the URL patterns for the demand forecast and pricing optimization API views
urlpatterns = [
    # Endpoint for fetching demand forecast data for multiple products
    # - POST request that accepts product IDs in the request body.
    # - Returns the demand forecast for each specified product.
    path('demand-forecast/', DemandForecastView.as_view(), name='demand-forecast'),

    # Endpoint for fetching product details along with pricing optimization information
    # - GET request that retrieves the product details and their optimized price.
    # - Includes details such as product name, category, cost price, selling price, and optimized price.
    path('pricing-optimization/', PricingOptimizationView.as_view(), name='pricing-optimization'),
]