from django.db import models
from django.conf import settings

class Story(models.Model):
    """
    Represents a narrative project.
    
    Attributes:
        title (CharField): The title of the story.
        description (TextField): A detailed description of the story.
        created_at (DateTimeField): The creation timestamp of the story.
        updated_at (DateTimeField): The timestamp of the last update to the story.
    """
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Character(models.Model):
    """
    Represents a fictional character.
    
    Attributes:
        name (CharField): The name of the character.
        traits (ManyToManyField): The traits of the character.
        backstory (TextField): The background story of the character.
        stories (ManyToManyField): The stories this character is associated with.
    """
    name = models.CharField(max_length=100)
    traits = models.ManyToManyField('Trait', related_name='characters')
    backstory = models.TextField()
    stories = models.ManyToManyField(Story, through='StoryCharacter', related_name='characters')

class Trait(models.Model):
    """
    Represents a characteristic or quality defining a fictional character.
    
    Attributes:
        description (CharField): A brief description of the trait.
    """
    description = models.CharField(max_length=100)
    
    def __str__(self):
        return self.description

class StoryCharacter(models.Model):
    """
    Intermediate model for associating characters with stories.
    
    Attributes:
        story (ForeignKey): The story to which the character is associated.
        character (ForeignKey): The character associated with the story.
        role (CharField): The role of the character within the story.
    """
    story = models.ForeignKey(Story, on_delete=models.CASCADE, null=True)
    character = models.ForeignKey(Character, on_delete=models.CASCADE)
    role = models.CharField(max_length=100, blank=True)

class Script(models.Model):
    """
    Represents a script within a story.
    
    Attributes:
        story (ForeignKey): The story this script is part of.
        title (CharField): The title of the script.
        created_at (DateTimeField): The creation timestamp of the script.
        updated_at (DateTimeField): The timestamp of the last update to the script.
    """
    story = models.ForeignKey(Story, related_name='scripts', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Relationship(models.Model):
    """
    Represents a relationship between two characters within a story.
    
    Attributes:
        from_character (ForeignKey): The character from whose perspective the relationship is defined.
        to_character (ForeignKey): The character towards whom the relationship is directed.
        story (ForeignKey): The story within which the relationship exists.
        score (IntegerField): A numeric value representing the strength or nature of the relationship.
        relationship_type (CharField): The type of relationship, such as friends, lovers, or enemies.
    """
    from_character = models.ForeignKey(Character, related_name='relationships_from', on_delete=models.CASCADE)
    to_character = models.ForeignKey(Character, related_name='relationships_to', on_delete=models.CASCADE)
    story = models.ForeignKey(Story, on_delete=models.CASCADE, null=True)
    score = models.IntegerField(default=5)
    relationship_type = models.CharField(max_length=100)

# Other models like Trait remain unchanged
