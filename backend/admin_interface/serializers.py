from rest_framework import serializers
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user objects.
    Manages both serialization and deserialization of user data including secure password handling.
    """
    class Meta:
        # Specifies the model associated with this serializer.
        model = User
        
        # Explicitly defines which fields of the model should be included in the serialization.
        fields = ['id', 'name', 'email', 'password']

        # Additional settings for specific fields to enhance security and data handling:
        # Makes 'password' field write-only to ensure it is not readable in any response.
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def create(self, validated_data):
        """
        Handles creation of a new user instance.
        Populates the user's attributes except for the password, which is set using the set_password method.
        """
        # Extract password from the validated data, if available.
        password = validated_data.pop('password', None)
        # Create a new user instance without the password.
        instance = self.Meta.model(**validated_data)
        # If a password was provided, hash it before saving.
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        """
        Handles updating an existing user instance.
        Updates user attributes and securely handles password changes.
        """
        # Extract password from the validated data, if available.
        password = validated_data.pop('password', None)
        # Iterate over the remaining validated data and update the instance.
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        # If a new password was provided, hash it before saving.
        if password:
            instance.set_password(password)
        instance.save()
        return instance



class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    Manages the serialization of email and password fields specifically for login purposes.
    """
    # Utilizes the EmailField to automatically validate the email format.
    email = serializers.EmailField()

    # Password field marked as write-only to ensure it does not return in any response.
    # Style is set to render this as a password field in forms.
    password = serializers.CharField(
        style={"input_type": "password"}, write_only=True
    )

class AuthSerializer(serializers.ModelSerializer):
    """
    Serializer for user authentication data.
    Utilizes Django's user model and specifies fields for serialization.
    """
    class Meta:
        # Dynamic reference to the currently active user model.
        model = get_user_model()

        # Defines the fields of the user model to be included in the serialization.
        fields = ("name", "email")