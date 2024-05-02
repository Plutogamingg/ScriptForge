from rest_framework import serializers
from django.db import transaction
from .models import Script, Character, Relationship, Story, Trait

class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = '__all__'

class ScriptSerializer(serializers.ModelSerializer):
    characters = serializers.SerializerMethodField()

    class Meta:
        model = Script
        fields = '__all__'

    def get_characters(self, obj):
        # This method will serialize the characters data to include it in the script serialization
        characters = obj.characters.all()
        return CharacterSerializer(characters, many=True).data


class TraitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trait
        fields = ['id', 'description']

class CharacterSerializer(serializers.ModelSerializer):
    traits = TraitSerializer(many=True, required=False)
    storyId = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Character
        fields = '__all__'

    def create(self, validated_data):
        traits_data = validated_data.pop('traits', [])
        story_id = validated_data.pop('storyId', None)

        # Create the character instance
        character = Character.objects.create(**validated_data)

        # Add traits to the character
        for trait_data in traits_data:
            description = trait_data.get('description', '')
            trait, created = Trait.objects.get_or_create(description=description)
            character.traits.add(trait)

            # Print success message
            print(f"Successfully added trait '{trait.description}' to character '{character.name}'.")

        # Associate story if provided
        if story_id:
            story = Story.objects.get(id=story_id)
            character.stories.add(story)

        return character

    def update(self, instance, validated_data):
        traits_data = validated_data.pop('traits', [])

        # Clear existing traits (Important!)
        instance.traits.clear() 

        # Add traits to the character
        for trait_data in traits_data:
            description = trait_data.get('description', '')
            trait, created = Trait.objects.get_or_create(description=description)
            instance.traits.add(trait)

        # Associate story if provided
        if 'storyId' in validated_data:
            story_id = validated_data.pop('storyId')
            if story_id:
                story = Story.objects.get(id=story_id)
                instance.stories.add(story)

        # Update and return the instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance





class RelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Relationship
        fields = '__all__'