from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

# Custom manager for user model to handle user creation and superuser creation
class CustomUserManager(BaseUserManager):
    """
    Custom user manager class that overrides the default user manager to handle user creation.
    - This manager is used to create normal users and superusers with custom fields.
    """
    
    def create_user(self, email, password=None, **extra_fields):
        """
        Method to create a regular user with email and password.
        - Ensures that the email is provided and normalized.
        - Hashes the password before saving the user instance.
        """
        if not email:
            raise ValueError('The Email field must be set')  # Ensure email is provided
        email = self.normalize_email(email)  # Normalize the email to ensure consistency (e.g., lowercased)
        
        # Create a user instance with the provided email and extra fields
        user = self.model(email=email, **extra_fields)
        
        # Set and hash the password before saving the user
        user.set_password(password)
        user.save(using=self._db)  # Save the user to the database
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Method to create a superuser with additional flags set.
        - Ensures the user has `is_staff` and `is_superuser` set to True.
        - This is used for creating a superuser to access the Django admin interface.
        """
        extra_fields.setdefault('is_staff', True)  # Ensure is_staff is True for superuser
        extra_fields.setdefault('is_superuser', True)  # Ensure is_superuser is True for superuser

        return self.create_user(email, password, **extra_fields)  # Call the create_user method


# Custom user model that extends AbstractUser
class CustomUser(AbstractUser):
    """
    Custom user model that extends the base Django user model (AbstractUser).
    - Adds a custom `role` field for user roles (Admin, Buyer, Supplier).
    - The `email` is used as the unique identifier for authentication instead of the username.
    """
    
    # The `username` field is still required by AbstractUser, but we'll make it unique with a default empty string
    username = models.CharField(unique=True, default='')  
    
    # Email field for user identification, made unique so no two users can have the same email
    email = models.EmailField(unique=True)  
    
    # Custom field to assign a role to the user (Admin, Buyer, Supplier)
    role = models.CharField(
        max_length=50,  # Max length of the role field
        choices=[  # The available role choices for the user
            ('admin', 'Admin'),
            ('buyer', 'Buyer'),
            ('supplier', 'Supplier'),
        ], 
        default='buyer'  # Default role is 'buyer'
    )

    # Set `email` as the field for authentication instead of the default `username`
    USERNAME_FIELD = 'email'
    
    # `REQUIRED_FIELDS` is a list of fields that must be provided when creating a superuser
    REQUIRED_FIELDS = ['username', 'role']  # Ensure username and role are provided for superuser creation

    # Assign the custom user manager to manage instances of this model
    objects = CustomUserManager()

    def __str__(self):
        """
        String representation of the CustomUser instance.
        - This returns the user's email address when the user object is printed or logged.
        """
        return self.email
