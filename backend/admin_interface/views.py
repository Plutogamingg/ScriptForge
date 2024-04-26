from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer, LoginSerializer
from .models import User
from django.conf import settings
import jwt, datetime
import jwt as pyjwt

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
    
class LoginView(APIView):
    def post(self, request):
        # I'm creating a LoginSerializer with the data sent in the request to handle the login process.
        serializer = LoginSerializer(data=request.data)
        # I check if the credentials provided are valid. If they're not, an exception will be raised and the process will stop here.
        serializer.is_valid(raise_exception=True)
        # Once validated, I get the user object from the serializer's validated data.
        user = serializer.validated_data
        # I prepare a payload for the JWT that includes the user's ID and the token's expiration and issued at times.
        payload = {
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }
        # I encode the payload into a JWT using my secret key and the HS256 algorithm.
        token = pyjwt.encode(payload, settings.JWT_SECRET_KEY, algorithm='HS256')

        # I create a response object and set a cookie named 'jwt' with the token, marking it as HttpOnly.
        response = Response()
        response.set_cookie(
            key='jwt',
            value=token,
            httponly=True,
            secure=True,  # use secure=True in production
            samesite='lax'  # or 'Strict' depending on your CSRF protection needs
)
        # I include the JWT in the response data as well, mainly for debugging or direct API use cases.
        response.data = {
            'jwt': token
        }

        return response

    
class UserView(APIView):
    def get(self, request):
        # I retrieve the JWT from the cookies sent with the request.
        token = request.COOKIES.get('jwt')

        # If there's no token found, I raise an authentication failed exception.
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            # I decode the token using the same secret key and algorithm used for encoding it.
            payload = pyjwt.decode(token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
        except pyjwt.ExpiredSignatureError:
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
    def post(self, request):
        # I create a response object to perform actions like deleting the cookie.
        response = Response()
        # I delete the 'jwt' cookie, effectively logging the user out.
        response.delete_cookie('jwt')
        # I set the response data to indicate that the operation was successful.
        response.data = {
            'message': 'success'
        }

        return response
