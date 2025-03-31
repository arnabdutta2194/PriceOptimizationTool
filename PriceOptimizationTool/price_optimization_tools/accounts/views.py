from django.shortcuts import render
from rest_framework import generics
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from django.core.mail import EmailMessage
from django.urls import reverse
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from rest_framework import serializers
import traceback


class RegisterView(APIView):
    """
    API view to handle user registration.
    - Registers a new user by saving the user data and sending a verification email.
    - The user is created with an inactive status, and activation occurs only after email verification.
    """

    # The model and serializer used for user registration
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def send_verification_email(self, user):
        """
        Sends a verification email to the newly created user.
        - Generates a token and a link for email verification.
        - Sends the email using Django's EmailMessage class.
        """
        
        # Generate a unique UID and token for the user
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        
        # Build the verification link
        verification_link = self.request.build_absolute_uri(
            reverse('verify-email', kwargs={'uidb64': uid, 'token': token})
        )
        
        # Prepare the email content
        subject = 'Verify Your Email Address'
        message = render_to_string('email_verification.html', {'verification_link': verification_link, 'user_name': user.username})
        
        # Create the email message
        email = EmailMessage(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [user.email],
        )
        email.content_subtype = "html"  # Set the content type to HTML
        email.send()  # Send the email

    def perform_create(self, serializer):
        """
        This method saves the user instance and sends the verification email.
        - The user is saved with `is_active=False`, meaning the user will not be able to log in until email verification.
        """
        user = serializer.save(is_active=False)  # User is inactive until email is verified
        
        # Send the email verification after saving the user
        self.send_verification_email(user)

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for user registration.
        - Accepts the user data, validates it, and creates the user.
        - Sends a verification email upon successful registration.
        """
        
        # Serialize the incoming data (user registration data)
        serializer = self.serializer_class(data=request.data)
        
        # Validate the serialized data
        if serializer.is_valid():

            try:
                # Save the user and send verification email
                self.perform_create(serializer)
                return Response(
                    {'message': "To activate your account, please check your email."},
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                # Log the error and return a bad request response
                return Response(
                    {'message': f"Error: {str(e)}", 'data': serializer.data},
                    status=status.HTTP_400_BAD_REQUEST
                )
        # Return invalid data response if serializer validation fails
        return Response(
            {'message': "Invalid data", 'data': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )


class VerifyEmailView(APIView):
    """
    API view to handle email verification for user activation.
    - Verifies the token and activates the user's account if the token is valid.
    - Renders success or failure pages based on the token validity.
    """
    
    def get(self, request, uidb64, token):
        """
        Handles GET requests for email verification.
        - Decodes the UID and token to find the user.
        - Verifies the token and activates the user if the token is valid.
        """
        try:
            # Decode the UID and retrieve the user
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            # If user is not found or there's an issue decoding the UID
            return Response({"message": "Invalid user ID or user does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        # If user is already active, return failure response
        if user.is_active:
            return render(request, "activate_failure.html")  # Optionally can return a specific failure page

        # Check if the token is valid
        if default_token_generator.check_token(user, token):
            # If valid, activate the user
            user.is_active = True
            user.save()
            return render(request, "activate_success.html")  # Render success page
        else:
            # If invalid, return failure response
            return render(request, "activate_failure.html")  # Render failure page


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer for JWT token obtainment.
    - Extends the default `TokenObtainPairSerializer` to add custom fields like user role.
    """
    
    def validate(self, attrs):
        """
        Validate the incoming request and add custom fields to the response.
        - Adds user role, username, and email to the response along with the token.
        """
        data = super().validate(attrs)
        
        # Check if the user's email is verified
        if not self.user.is_active:
            raise serializers.ValidationError("Email not verified. Please verify your email before logging in.")
        
        # Add additional user info to the response data
        data['username'] = self.user.username
        data['role'] = self.user.role  # Include user role
        data['email'] = self.user.email  # Include email
        return data


class LoginAPIView(TokenObtainPairView):
    """
    API view to handle user login using JWT.
    - Uses custom serializer to include user role, email, and username in the response.
    - Accessible to all users (using `AllowAny` permission).
    """
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer  # Use custom serializer for login


class LogoutAPIView(APIView):
    """
    API view to handle user logout.
    - Blacklists the refresh token to invalidate it upon logout.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Handles POST requests for logging out a user by blacklisting the refresh token.
        """
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the token to invalidate it
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
