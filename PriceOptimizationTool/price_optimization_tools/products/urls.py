from django.urls import path
from .views import ProductManagementView

# Define the URL patterns for the product management API
urlpatterns = [
    # Endpoint for listing all products or creating a new product
    # - GET: Retrieve a list of all products (supports search and sorting).
    # - POST: Create a new product (requires appropriate permissions).
    path('products/', ProductManagementView.as_view(), name='product-list-create'),

    # Endpoint for retrieving, updating, or deleting a specific product by its primary key (`pk`)
    # - GET: Retrieve details of a specific product (includes pricing optimization data).
    # - PUT: Update details of a specific product (requires appropriate permissions).
    # - DELETE: Delete a specific product (requires appropriate permissions).
    path('products/<int:pk>/', ProductManagementView.as_view(), name='product-detail'),
]