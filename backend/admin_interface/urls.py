from django.urls import path
from admin_interface import views

urlpatterns = [
    path('login', views.login_view),
    path('register', views.register_view),
    path('refresh-token', views.CookieReView.as_view()),
    path('logout', views.logout_view),
    path("user", views.user_detail_view),
]
