from django.db.models.signals import post_save  # I import post_save to catch the event after a User model instance is saved.
from django.dispatch import receiver  # I import receiver to register my function as a signal handler.
from .models import User, Role, UserRole  # I import the necessary models from my app.

# I use the receiver decorator to link my function with the post_save signal for the User model.
@receiver(post_save, sender=User)
def assign_default_role(sender, instance, created, **kwargs):
    # This function will run every time a User instance is saved.
    if created:  # I check if this is a new instance of User being created (not an update).
        # If it's a new user, I get the 'Free User' role, creating it if it doesn't exist.
        free_user_role, _ = Role.objects.get_or_create(name='Free User')
        
        # Then I create a new UserRole linking the new user to the 'Free User' role.
        # This automatically grants the new user the permissions associated with the 'Free User' role.
        UserRole.objects.create(user=instance, role=free_user_role)
