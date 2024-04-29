from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt import tokens, views as jwt_views, serializers as jwt_serializers, exceptions as jwt_exceptions
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, LoginSerializer
from django.middleware import csrf
from rest_framework import exceptions as rest_exceptions, response, decorators as rest_decorators, permissions as rest_permissions
from .models import User
from django.conf import settings
from rest_framework import permissions, status
from rest_framework.exceptions import ParseError
import jwt


# Create your views here.
class RegisterView(APIView):
    def post(self, request):
        # I'm creating a UserSerializer with the data sent in the request.
        serializer = UserSerializer(data=request.data)
        # I'm checking if the data is valid. If it's not, an exception will be raised.
        serializer.is_valid(raise_exception=True)
        # Data is valid, so I save the user to the database.
        serializer.save()
        # Finally, I return the serialized user data in the response.
        return Response(serializer.data)

def get_user_tokens(user):
    refresh = tokens.RefreshToken.for_user(user)
    return {
        "refresh_token": str(refresh),
        "access_token": str(refresh.access_token)
    }
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # serializer.validated_data will be a User object directly
        user = serializer.validated_data

       

        # Create the response object
        if user is not None:
            tokens = get_user_tokens(user)
            res = response.Response()
            res.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=tokens["access_token"],
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )

            res.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=tokens["refresh_token"],
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )

            res.data = tokens
            res["X-CSRFToken"] = csrf.get_token(request)
            return res

     

    
class UserView(APIView):
    def get(self, request):
        # I retrieve the JWT from the cookies sent with the request.
        token = request.COOKIES.get('jwt')

        # If there's no token found, I raise an authentication failed exception.
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            # I decode the token using the same secret key and algorithm used for encoding it.
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            # If the token has expired, I raise an exception to indicate that the user is unauthenticated.
            raise AuthenticationFailed('Unauthenticated!')

        # I look up the user by the ID included in the token's payload.
        user = User.objects.filter(id=payload['user_id']).first()

        # If no user is found with this ID, I raise an exception indicating the user was not found.
        if not user:
            raise AuthenticationFailed('User not found!')

        # I serialize the user object to return it as a response.
        serializer = UserSerializer(user)

        return Response(serializer.data)
    
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            token = RefreshToken(refresh_token)
            token.blacklist()

            response = Response(status=status.HTTP_205_RESET_CONTENT)
            response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
            response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            response.delete_cookie("X-CSRFToken")
            response.delete_cookie("csrftoken")
            response["X-CSRFToken"] = None
            
            return response
        except Exception as e:  # It's a good practice to catch specific exceptions
            raise ParseError("Invalid token") from e
        

class CookieTokenRefreshSerializer(jwt_serializers.TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get('refresh')
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise jwt_exceptions.InvalidToken(
                'No valid token found in cookie \'refresh\'')


class CookieTokenRefreshView(jwt_views.TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("refresh"):
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=response.data['refresh'],
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )

            del response.data["refresh"]
        response["X-CSRFToken"] = request.COOKIES.get("csrftoken")
        return super().finalize_response(request, response, *args, **kwargs)
