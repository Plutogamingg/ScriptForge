from django.db import models
from django.conf import settings

class Story(models.Model):
    """
    Represents a collaborative story project within the application.
    
    Attributes:
        title (CharField): Title of the story.
        description (TextField): A detailed description of the story's theme, setting, or purpose.
        collaborators (ManyToManyField): Users who can collaborate on this story.
        created_at (DateTimeField): Timestamp for when the story was created.
        updated_at (DateTimeField): Timestamp for the last update to the story.
    """
    title = models.CharField(max_length=200)
    description = models.TextField()
    collaborators = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='collaborating_stories')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
   


class Script(models.Model):
    """
    Represents a narrative script within the application.

    Attributes:
        story (ForeignKey): Reference to the story this script belongs to.
        user (ForeignKey): Reference to the user who created or owns the script.
        title (CharField): Title of the script.
        genre (CharField): Genre of the narrative (e.g., fantasy, sci-fi).
        setting (CharField): The setting where the script's story occurs.
        time_period (CharField): Historical or futuristic context of the story.
        story_type (CharField): The type of narrative (e.g., quest, adventure).
        pace (CharField): Describes the pacing of the script (e.g., slow, fast-paced).
        story_tone (CharField): Emotional tone of the script (e.g., dark, humorous).
        writing_style (CharField): Writing style of the script (e.g., descriptive, concise).
        created_at (DateTimeField): Timestamp for when the script was created.
        updated_at (DateTimeField): Timestamp for the last update to the script.
    """
    story = models.ForeignKey(Story, related_name='scripts', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='scripts')
    title = models.CharField(max_length=200)
    genre = models.CharField(max_length=100)
    setting = models.CharField(max_length=200)
    time_period = models.CharField(max_length=100)
    story_type = models.CharField(max_length=100)
    pace = models.CharField(max_length=100)
    story_tone = models.CharField(max_length=100)
    writing_style = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Trait(models.Model):
    """
    Represents a trait of a character, such as 'brave', 'clever', 'loyal', etc.
    """
    description = models.CharField(max_length=100)

    def __str__(self):
        return self.description

class Character(models.Model):
    """
    Represents a character within a script.

    Attributes:
        story (ForeignKey): Reference to the story this character belongs to.
        name (CharField): The name of the character.
        traits (ManyToManyField): Multiple traits of the character.
        backstory (TextField): Background story of the character providing depth to their motivations and actions.
        script (ForeignKey): Reference to the script this character belongs to, allowing multiple characters per script.
        character_type (CharField): Specifies the type of character as a simple string.
    """
    story = models.ForeignKey(Story, related_name='characters', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    traits = models.ManyToManyField(Trait, related_name='characters')
    backstory = models.TextField()
    script = models.ForeignKey('Script', related_name='characters', on_delete=models.CASCADE)
    character_type = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Relationship(models.Model):
    """
    Tracks the relationships between characters in the narratives.

    Attributes:
        from_character (ForeignKey): Character from which the relationship perspective is defined.
        to_character (ForeignKey): Character to whom the relationship is directed.
        score (IntegerField): A numeric score representing the relationship strength and nature (0-10).
        relationship_type (CharField): Type of relationship, such as friends, lovers, enemies, or neutral.
    """
    from_character = models.ForeignKey(Character, related_name='relationships_from', on_delete=models.CASCADE)
    to_character = models.ForeignKey(Character, related_name='relationships_to', on_delete=models.CASCADE)
    score = models.IntegerField(default=5)  # Neutral by default, scale 0-10
    relationship_type = models.CharField(max_length=100)  
    

    def __str__(self):
        return f"{self.from_character.name} - {self.to_character.name} : {self.relationship_type} ({self.score})"