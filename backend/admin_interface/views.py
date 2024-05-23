from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt import tokens, views as jwt_views, serializers as jwt_serializers, exceptions as jwt_exceptions
from rest_framework import decorators as rest_decorators, response, exceptions as rest_exceptions
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
from django.middleware import csrf
from rest_framework import exceptions as rest_exceptions, response, decorators as rest_decorators, permissions as rest_permissions
from .models import User
from django.conf import settings
from rest_framework import permissions, status
from rest_framework.exceptions import ParseError
from admin_interface import serializers, models
from .serializers import UserSerializer
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
import jwt

def get_user_tokens(user):
    refresh = tokens.RefreshToken.for_user(user)
    return {
        "refresh_token": str(refresh),
        "access_token": str(refresh.access_token)
    }


@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([])
def login_view(request):
    """
    API view to handle user login. Validates credentials and returns JWT tokens if authentication is successful.
    """
    # Deserialize and validate incoming data using the LoginSerializer.
    serializer = serializers.LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # Extract credentials from the validated data.
    email = serializer.validated_data["email"]
    password = serializer.validated_data["password"]

    # Attempt to authenticate the user with the provided credentials.
    user = authenticate(email=email, password=password)

    if user:
        # Generate JWT tokens for the authenticated user.
        tokens = get_user_tokens(user)

        # Create a response object to set cookies and return tokens.
        res = response.Response()

        # Helper function to set JWT cookies.
        def set_jwt_cookie(key, token, lifetime):
            res.set_cookie(
                key=key,
                value=token,
                expires=lifetime,
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )

        # Set cookies for access and refresh tokens.
        set_jwt_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'], tokens["access_token"], settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'])
        set_jwt_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'], tokens["refresh_token"], settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'])

        # Include the tokens in the response data.
        res.data = tokens

        # Set CSRF token for the session to protect against CSRF attacks.
        res["X-CSRFToken"] = csrf.get_token(request)

        return res

    # Raise an exception if authentication fails.
    raise rest_exceptions.AuthenticationFailed("Email or Password is incorrect!")


@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([])
def register_view(request):
    """
    API view to handle user registration. Processes input data by combining 'first_name' and 'last_name' 
    into a single 'name' field, validates the data, and if valid, creates a new user record.
    """
    # Safely modify the incoming data by copying the mutable QueryDict
    data = request.data.copy()

    # Extract first_name and last_name, combine them into 'name', and strip to handle extra spaces
    data['name'] = f"{data.pop('first_name', '').strip()} {data.pop('last_name', '').strip()}".strip()

    # Create and validate the user serializer with the modified data
    serializer = serializers.UserSerializer(data=data)
    serializer.is_valid(raise_exception=True)

    # Save the new user to the database
    user = serializer.save()

    # Return a success response if the user is successfully created
    if user:
        return response.Response({"message": "Registered successfully!"}, status=201)

    # This point should not normally be reached; return a generic failure response as a fallback
    return response.Response({"error": "Registration failed unexpectedly."}, status=400)



@rest_decorators.api_view(['POST'])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def logout_view(request):
    """
    API view to log out a user. It attempts to blacklist the user's refresh token,
    clears authentication and CSRF cookies, and returns an appropriate response.
    """
    # Extract the refresh token from the cookies.
    refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])

    if not refresh_token:
        # Return a 400 Bad Request if the refresh token is missing.
        return response.Response({"detail": "No refresh token provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Attempt to blacklist the refresh token to prevent its further use.
        token = RefreshToken(refresh_token)
        token.blacklist()
    except (TokenError, InvalidToken) as e:
        # Specific handling for token-related errors
        return response.Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        # General catch-all for any other exceptions
        return response.Response({"detail": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Create a response object for a successful logout
    res = response.Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)

    # Delete authentication and CSRF tokens cookies
    cookies_to_delete = [settings.SIMPLE_JWT['AUTH_COOKIE'], settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'], "X-CSRFToken", "csrftoken"]
    for cookie in cookies_to_delete:
        res.delete_cookie(cookie)

    return res


class CookieReSer(jwt_serializers.TokenRefreshSerializer):
    """
    Serializer for handling JWT token refresh requests that expects the refresh token to be provided via cookies.
    This overrides the standard behavior to work with tokens stored in cookies.
    """
    # Disable handling of 'refresh' field from POST data by setting it to None.
    refresh = None

    def validate(self, attrs):
        """
        Extracts the refresh token from a cookie and validates it.
        Raises an exception if the token is missing or invalid.
        """
        # Retrieve the refresh token from cookies
        refresh_token = self.context['request'].COOKIES.get('refresh')
        if not refresh_token:
            # Raise an exception if the refresh token is missing
            raise jwt_exceptions.InvalidToken('No valid refresh token found in cookie.')

        # Assign the retrieved token to attrs for further validation by superclass
        attrs['refresh'] = refresh_token
        return super().validate(attrs)

class CookieReView(jwt_views.TokenRefreshView):
    """
    A view that refreshes JWT tokens using a token retrieved from cookies.
    It customizes the final response to safely return new tokens and manage CSRF tokens.
    """
    serializer_class = CookieReSer

    def finalize_response(self, request, response, *args, **kwargs):
        """
        Customizes the response to securely handle token and CSRF token transmission.
        Sets the new refresh token in a cookie and updates the CSRF token.
        """
        refresh_token = response.data.get('refresh')
        if refresh_token:
            # Update the refresh token cookie with secure settings
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=refresh_token,
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
            # Remove the refresh token from the response data to enhance security
            del response.data['refresh']

        # Update the CSRF token in the response
        csrf_token = request.COOKIES.get('csrftoken')
        if csrf_token:
            response["X-CSRFToken"] = csrf_token

        # Return the modified response
        return super().finalize_response(request, response, *args, **kwargs)


@rest_decorators.api_view(["GET"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def user_detail_view(request):
    """
    Retrieves and returns the authenticated user's details using the custom AuthSerializer.
    Returns HTTP 404 if the user is not found in the database.
    """
    User = get_user_model()
    try:
        # Attempt to retrieve the authenticated user based on the user ID from the request
        user = User.objects.get(id=request.user.id)
    except User.DoesNotExist:
        # Return a 404 Not Found response if no user is found with the authenticated ID
        return response.Response(status=status.HTTP_404_NOT_FOUND)

    # Serialize the retrieved user data
    serializer = serializers.AuthSerializer(user)
    
    # Return the serialized user data in the response
    return response.Response(serializer.data)
