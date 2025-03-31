from django.urls import re_path as url
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from django.urls import path

# Define the URL patterns for the user authentication API views
urlpatterns = [
    # URL for user registration
    # - Maps to the `RegisterView` to handle user registration requests.
    # - URL name: 'register'
    url('register/', views.RegisterView.as_view(), name="register"),

    # URL for user login
    # - Maps to the `LoginAPIView` to handle user login using JWT authentication.
    # - URL name: 'login'
    url('login/', views.LoginAPIView.as_view(), name="login"),

    # URL for user logout
    # - Maps to the `LogoutAPIView` to handle user logout and refresh token invalidation.
    # - URL name: 'logout'
    url('logout/', views.LogoutAPIView.as_view(), name="logout"),

    # URL for email verification
    # - Maps to the `VerifyEmailView` to handle the GET request for email verification.
    # - Expects two parameters in the URL: `uidb64` (user ID) and `token` (verification token).
    # - URL name: 'verify-email'
    path('verify-email/<uidb64>/<token>/', views.VerifyEmailView.as_view(), name='verify-email'),

    # URL for refreshing the JWT token
    # - Maps to `TokenRefreshView` from `rest_framework_simplejwt` to refresh the user's JWT token.
    # - URL name: 'token_refresh'
    url('token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
]
