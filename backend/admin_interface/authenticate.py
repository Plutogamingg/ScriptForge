from rest_framework_simplejwt import authentication as jwt_authentication
from rest_framework import authentication, exceptions as rest_exceptions
from django.conf import settings

def enforce_csrf(request):
    check = authentication.CSRFCheck(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise rest_exceptions.PermissionDenied('CSRF Failed: %s' % reason)


class CustomAuthentication(jwt_authentication.JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE']) or None

        if header is None:
            return None
        else:
            raw_token = self.raw_token_get(header)

        if raw_token is None:
            return None
        
        validated_token = self.get_raw_token(raw_token)
        enforce_csrf(request)
        return self.get_user(validated_token), validated_token