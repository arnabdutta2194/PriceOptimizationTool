"""price_optimization_tool URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import re_path as url
from django.conf.urls import include

# URL patterns for the project
# These define the routing of requests to the appropriate views for each app

urlpatterns = [
    # Path for the Django admin interface
    # The admin interface is used for managing the project's models
    path('admin/', admin.site.urls),

    # Include the URLs for the `accounts` app
    # This will include all the routes defined in the `accounts.urls` module
    # Typically includes authentication and user management endpoints
    url('accounts/', include('accounts.urls')),

    # Include the URLs for the `products` app
    # This will include all the routes defined in the `products.urls` module
    # Typically includes routes for managing products
    url('products/', include('products.urls')),

    # Include the URLs for the `pricing` app
    # This will include all the routes defined in the `pricing.urls` module
    # Typically includes routes for managing pricing and optimization data
    url('pricing/', include('pricing.urls')),
]

