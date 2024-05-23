from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import CSRFCheck
from rest_framework.exceptions import PermissionDenied
from django.conf import settings

def enforce_csrf(request):
    """
    Enforces CSRF validation for a given request. Raises a PermissionDenied exception
    if the CSRF check fails, providing a detailed reason for the failure.
    """
    csrf_check = CSRFCheck(request)
    failure_reason = csrf_check.process_view(request, None, (), {})
    if failure_reason:
        raise PermissionDenied(f'CSRF Failed: {failure_reason}')

class CustomJWTAuthentication(JWTAuthentication):
    """
    Custom authentication class that prioritizes JWT token retrieval from HTTP headers,
    then falls back to cookies if necessary. Also performs CSRF validation after token
    validation.
    """
    def authenticate(self, request):
        # Retrieve the JWT from the authorization header if present
        token_from_header = self.get_header(request)
        jwt_token = self.parse_raw_token(token_from_header) if token_from_header else None

        # If no token found in header, check the cookie
        if jwt_token is None:
            jwt_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])

        # Return None if no JWT token is found in either location
        if jwt_token is None:
            return None

        # Validate the JWT token
        validated_token = self.get_validated_token(jwt_token)

        # Perform CSRF validation
        enforce_csrf(request)

        # Retrieve and return the user associated with this token
        return self.get_user(validated_token), validated_token
