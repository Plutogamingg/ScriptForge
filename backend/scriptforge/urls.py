"""
URL configuration for scriptforge project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('admin_interface.urls')), 
    path('api/', include('script_generation.urls')), 
 # Include admin_interface app URL file
  #  path('script_generation/', include('script_generation.urls')),  # Include script_generation app URL file
  #  path('script_management/', include('script_management.urls')),  # Include script_management app URL file

]
