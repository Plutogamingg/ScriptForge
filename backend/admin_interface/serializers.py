from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed

class UserSerializer(serializers.ModelSerializer):
    # This inner Meta class tells Django REST Framework about the model and fields I want to serialize.
    class Meta:
        model = User  # Specify that I am using my custom User model.
        # Fields to include in the serializer - id, name, email, and password are the fields I care about.
        fields = ['id', 'name', 'email', 'password']
        # Make password write-only and not required, so it doesn't come back in the response or need to be included on every update.
        extra_kwargs = {'password': {'write_only': True, 'required': False}}
        
    # create method is for creating a new user instance when I post to the User API.
    def create(self, validated_data):
        # Extract the password from the validated data and remove it to handle separately for security.
        password = validated_data.pop('password', None)
        # Create a new User instance using the remaining validated data.
        instance = self.Meta.model(**validated_data)
        if password is not None:  # Check if a password was provided
            instance.set_password(password)  # Use set_password to hash the password properly
        instance.save()  # Save the User instance to the database
        return instance  # Return the newly created User instance
    
    # update method is for updating a user instance when I put or patch to the User API.
    def update(self, instance, validated_data):
        # Extract the password if it's part of the update, so I can handle it securely.
        password = validated_data.pop('password', None)
        # Iterate through the remaining validated data and set each attribute on the instance.
        for attr, value in validated_data.items():
            setattr(instance, attr, value)  # Set each attribute on the instance to the corresponding value from validated_data
        if password is not None:  # If a new password was provided,
            instance.set_password(password)  # hash the new password and set it on the instance
        instance.save()  # Save the updated User instance to the database
        return instance  # Return the updated User instance

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        # Use Django's authenticate method to verify the user's credentials
        user = authenticate(username=data['email'], password=data['password'])
        if user is None:
            # Raise an authentication failed exception if credentials are invalid
            raise AuthenticationFailed('Invalid email or password.')
        
        # If authentication is successful, return the user object
        return user
