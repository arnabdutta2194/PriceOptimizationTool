from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer class for the Product model.
    - Converts `Product` model instances into JSON format for API responses.
    - Converts incoming JSON data into validated Python objects for creating or updating `Product` model instances.
    """

    class Meta:
        """
        Meta class defines the model and fields included in the serializer.
        - `model`: Specifies the `Product` model to be serialized.
        - `fields`: Specifies the fields to include in the serialized data. 
          Using `'__all__'` includes all fields from the `Product` model.
        - `read_only_fields`: Specifies fields that are not writable during create/update operations.
        """
        model = Product
        fields = '__all__'  # Serialize all fields from the Product model.
        read_only_fields = ['create_timestamp', 'updated_timestamp']  # Prevent these fields from being modified.
