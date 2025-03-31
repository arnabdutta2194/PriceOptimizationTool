from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdmin, IsSupplier, IsBuyer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import PricingOptimization
from products.models import Product

# Demand Forecast
class DemandForecastView(APIView):
    """
    View to handle fetching the demand forecast for multiple products.
    - Only authenticated users with appropriate permissions (Admin, Supplier, Buyer) can access.
    - The forecast is calculated based on the product's data from the PricingOptimization model.
    """

    # Permissions for accessing this view: User must be authenticated
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        Handles POST requests to fetch the demand forecast for multiple products based on product IDs.
        - Expects a list of product IDs in the request body.
        - Returns the forecast data for each product.
        """
        # Check if the user has the required permissions
        if not (request.user.is_authenticated and 
                (IsAdmin().has_permission(request, self) or 
                 IsSupplier().has_permission(request, self) or 
                 IsBuyer().has_permission(request, self))):
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        # Get product IDs from request data
        product_ids = request.data.get("ids", [])
        
        # If no product IDs are provided, return a bad request error
        if not product_ids:
            return Response({"error": "No product IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Retrieve products matching the provided IDs
        products = Product.objects.filter(id__in=product_ids)
        
        # If no products were found, return an error
        if not products.exists():
            return Response({"error": "One or more products not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Prepare the forecast data for each product
        forecast_data = []
        for product in products:
            forecast_data.append({
                "product_name": product.name,
                "product_category": product.category,
                "product_cost_price": product.cost_price,
                "product_selling_price": product.selling_price,
                "product_available_stock": product.stock_available,
                "product_units_sold": product.units_sold,
                "product_added_year": product.create_timestamp.year,
                "demand_forecast": product.pricing_optimization.demand_forecast,
            })
        
        # Return the forecast data as a JSON response
        return Response(forecast_data, status=status.HTTP_200_OK)
    

class PricingOptimizationView(APIView):
    """
    View to handle fetching the optimized pricing information for products.
    - Returns the product details along with the optimized price from the PricingOptimization model.
    - Only accessible by authenticated users with appropriate permissions.
    """
    
    # Permissions for accessing this view: User must be authenticated
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Handles GET requests to fetch product details and their optimized prices.
        - Retrieves product information along with optimized price from the PricingOptimization model.
        """
        pricing_data = []

        # Check if the user has the required permissions
        if not (request.user.is_authenticated and 
                (IsAdmin().has_permission(request, self) or 
                 IsSupplier().has_permission(request, self) or 
                 IsBuyer().has_permission(request, self))):
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        # Retrieve all products along with their pricing optimization
        products = Product.objects.all()

        # Loop through each product and fetch pricing optimization data
        for product in products:
            try:
                # Fetch associated PricingOptimization data for each product
                pricing = PricingOptimization.objects.get(product=product)
                pricing_data.append({
                    "id": product.id,
                    "name": product.name,
                    "category": product.category,
                    "description": product.description,
                    "cost_price": product.cost_price,
                    "selling_price": product.selling_price,
                    "optimized_price": pricing.optimized_price  # Include the optimized price
                })
            except PricingOptimization.DoesNotExist:
                # If no PricingOptimization entry exists for this product, handle the case
                pricing_data.append({
                    "id": product.id,
                    "name": product.name,
                    "category": product.category,
                    "description": product.description,
                    "cost_price": product.cost_price,
                    "selling_price": product.selling_price,
                    "optimized_price": None  # If no optimized price is found
                })

        # Return the pricing data as a JSON response
        return Response(pricing_data, status=status.HTTP_200_OK)
