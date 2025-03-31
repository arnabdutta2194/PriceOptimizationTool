from rest_framework import serializers
from .models import PricingOptimization

class PricingOptimizationSerializer(serializers.ModelSerializer):
    """
    Serializer for the PricingOptimization model.
    - Converts `PricingOptimization` model instances into JSON format for API responses.
    - Converts incoming JSON data into validated Python objects for creating or updating `PricingOptimization` model instances.
    """

    class Meta:
        """
        Meta class defines the model and fields included in the serializer.
        - `model`: Specifies the `PricingOptimization` model to be serialized.
        - `fields`: Specifies the fields to include in the serialized data.
          Using `'__all__'` includes all fields from the `PricingOptimization` model.
        """
        model = PricingOptimization
        fields = '__all__'  # Serialize all fields from the PricingOptimization model.
