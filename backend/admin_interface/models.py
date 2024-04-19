from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_migrate
from django.dispatch import receiver

class User(AbstractUser):
    # If I need to add extra fields specific to my users, I can do so here.
    # For example, a link to a subscription model or profile information.
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=255, null=True)
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    pass

class Role(models.Model):
    # This model represents different user roles in the application, like 'Free User' or 'Paid User'.
    # Each role can have multiple permissions associated with it.
    name = models.CharField(max_length=255, unique=True)
    permissions = models.ManyToManyField('Permission', related_name='roles')

    def __str__(self):
        # A string representation to easily identify the role in the admin interface or logs.
        return self.name

class Permission(models.Model):
    # Permissions define specific actions that roles can perform, like 'access_free_content'.
    name = models.CharField(max_length=255, unique=True)  # Human-readable name of the permission.
    codename = models.CharField(max_length=100, unique=True)  # Machine-readable name used in code.

    def __str__(self):
        # A string representation to easily identify the permission.
        return self.name

class UserRole(models.Model):
    # This model links users and roles to assign a role to a user.
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Reference to the User.
    role = models.ForeignKey(Role, on_delete=models.CASCADE)  # Reference to the Role.

    class Meta:
        unique_together = ('user', 'role')  # Ensures that a user-role pair is unique.

    def __str__(self):
        # String representation showing which role is assigned to which user.
        return f"{self.user.username} - {self.role.name}"

# This signal function initializes default roles and permissions after all migrations are done.
@receiver(post_migrate)
def create_default_roles_and_permissions(sender, **kwargs):
    # Check if this function is being called from the correct app to avoid conflicts.
    if sender.name == 'admin_interface':  # The name of the app which models is currently in
        # Create default permissions if they don't already exist.
        perm_free_content, _ = Permission.objects.get_or_create(name='Access Free Content', codename='access_free_content')
        perm_premium_content, _ = Permission.objects.get_or_create(name='Access Premium Content', codename='access_premium_content')

        # Create default roles and assign them the created permissions.
        role_free_user, _ = Role.objects.get_or_create(name='Free User')
        role_free_user.permissions.add(perm_free_content)  # Free users can access free content.

        role_paid_user, _ = Role.objects.get_or_create(name='Paid User')
        role_paid_user.permissions.add(perm_free_content, perm_premium_content)  # Paid users can access both free and premium content.
