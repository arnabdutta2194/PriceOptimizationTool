from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdmin, IsSupplier, IsBuyer
from .models import Product
from .serializers import ProductSerializer
from django.db.models.signals import post_save

class ProductManagementView(APIView):
    """
    API view for managing product-related operations, including:
    - GET: Retrieve product(s) data.
    - POST: Create a new product.
    - PUT: Update an existing product.
    - DELETE: Delete an existing product.
    """

    # Permissions required for accessing this view
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        """
        Handles GET requests:
        - If `pk` is provided, retrieves details of a specific product.
        - If `pk` is not provided, retrieves a list of all products.
        - Includes related PricingOptimization data (e.g., demand forecast, optimized price).
        """
        # Retrieve all products with related PricingOptimization data
        products = Product.objects.all().prefetch_related('pricing_optimization')


        # Fetch details for a specific product if `pk` is provided
        if pk:
            try:
                product = Product.objects.prefetch_related('pricing_optimization').get(pk=pk)
                product_data = ProductSerializer(product).data

                # Add PricingOptimization data if it exists
                if hasattr(product, 'pricing_optimization'):
                    product_data['demand_forecast']  = product.pricing_optimization.demand_forecast
                    product_data['optimized_price'] =  product.pricing_optimization.optimized_price

                return Response(product_data, status=status.HTTP_200_OK)
            except Product.DoesNotExist:
                return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Fetch all products and include PricingOptimization data
            product_list = []
            for product in products:
                product_data = ProductSerializer(product).data

                # Add PricingOptimization data if it exists
                if hasattr(product, 'pricing_optimization'):
                    product_data['demand_forecast']  = product.pricing_optimization.demand_forecast
                    product_data['optimized_price'] =  product.pricing_optimization.optimized_price
                product_list.append(product_data)
            return Response(product_list, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Handles POST requests to create a new product.
        - Requires user authentication.
        - Restricted to Admins, Suppliers, or Buyers.
        - Accepts optional demand forecast and optimized price fields.
        """

        # Check if the user has the required permissions
        if not (request.user.is_authenticated and 
                (IsAdmin().has_permission(request, self) or 
                 IsSupplier().has_permission(request, self))):
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)


        # Retrieve optional fields from the request
        demand_forecast = request.data.get('demand_forecast', None)
        optimized_price = request.data.get('optimized_price', None)

        # Serialize and validate the product data
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            # Trigger post_save signal with additional fields
            post_save.send(sender=Product, instance=product, created=True, 
                           demand_forecast=demand_forecast, optimized_price=optimized_price)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        """
        Handles DELETE requests to delete an existing product.
        - Requires user authentication.
        - Restricted to Admins, Suppliers, or Buyers.
        """
        # Check if the user has the required permissions
        if not (request.user.is_authenticated and 
                (IsAdmin().has_permission(request, self) or 
                 IsSupplier().has_permission(request, self))):
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        # Try to fetch and delete the product
        try:
            product = Product.objects.get(pk=pk)
            product.delete()
            return Response({"message": "Product deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk=None):
        """
        Handles PUT requests to update an existing product.
        - Requires user authentication.
        - Restricted to Admins, Suppliers, or Buyers.
        - Accepts optional demand forecast and optimized price fields.
        """
        # Check if the user has the required permissions
        if not (request.user.is_authenticated and 
                (IsAdmin().has_permission(request, self) or 
                 IsSupplier().has_permission(request, self))):
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        # Try to fetch the product for updating
        try:
            demand_forecast = request.data.get('demand_forecast', None)
            optimized_price = request.data.get('optimized_price', None)
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize and validate the updated product data
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            # Trigger post_save signal with additional fields
            post_save.send(sender=Product, instance=product, updated=True, created=False, 
                           demand_forecast=demand_forecast, optimized_price=optimized_price)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)