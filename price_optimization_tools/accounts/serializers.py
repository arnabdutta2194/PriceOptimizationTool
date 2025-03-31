from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model.
    - Converts `CustomUser` model instances into JSON format for API responses.
    - Converts incoming JSON data into validated Python objects for creating or updating `CustomUser` model instances.
    - Specifically handles user registration and the secure handling of the password field.
    """

    class Meta:
        """
        Meta class defines the model and fields included in the serializer.
        - `model`: Specifies the `CustomUser` model to be serialized.
        - `fields`: Specifies the fields to be included in the serialized data. 
          - The `CustomUser` model's `id`, `username`, `email`, `role`, and `password` fields are included.
        - `extra_kwargs`: Specifies additional settings for specific fields.
          - For the `password` field, it is marked as `write_only`, meaning it will not be included in responses but can be used for input during user creation.
        """
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'password']  # Fields to be serialized
        extra_kwargs = {'password': {'write_only': True}}  # Password should only be used for writing (input), not output

    def create(self, validated_data):
        """
        Handles user creation during registration.
        - The `create_user` method from the `CustomUserManager` is used to securely create a user.
        - The `validated_data` contains the data validated by the serializer (including the password).
        - The password is securely hashed during the user creation process.
        """
        user = CustomUser.objects.create_user(**validated_data)  # Create the user and hash the password
        return user
