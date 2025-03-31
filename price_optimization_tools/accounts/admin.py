from django.contrib import admin
from .models import CustomUser
from django.contrib.auth.admin import UserAdmin

# Register your models here.
# This file is used to configure the Django admin interface for the `CustomUser` model.

class CustomUserAdmin(UserAdmin):
    """
    Custom admin class for managing the `CustomUser` model in the Django admin interface.
    - This class extends `UserAdmin` to customize how the `CustomUser` model is displayed and interacted with in the admin interface.
    """
    model = CustomUser  # Specifies the model this admin configuration applies to.

    # Display these fields in the list view in the admin interface
    # The `role` field is added to the list of displayed fields
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'role')

    # Add filters for `is_staff`, `is_active`, and `role` in the admin list view
    # This allows easy filtering of users based on their role or status
    list_filter = ('is_staff', 'is_active', 'role')

    # Define the layout and fields for the user edit forms in the admin interface
    fieldsets = (
        (None, {'fields': ('username', 'password')}),  # Username and password are grouped together
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email')}),  # Personal info fields
        ('Permissions', {'fields': ('is_staff', 'is_active', 'groups', 'user_permissions')}),  # Permissions and roles
        ('Additional Info', {'fields': ('role',)}),  # Include the `role` field in the admin form for user management
    )
    
    # Define the fields shown in the "Add User" form in the admin interface
    # Includes the `role`, `is_staff`, and `is_active` fields for new user creation
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'is_staff', 'is_active'),
        }),
    )

    # Define the fields to search within the admin interface (username, email, and role)
    search_fields = ('username', 'email', 'role')

    # Define the default ordering for the user list view (order by `username`)
    ordering = ('username',)

# Register the `CustomUser` model with the custom `CustomUserAdmin` configuration
admin.site.register(CustomUser, CustomUserAdmin)
