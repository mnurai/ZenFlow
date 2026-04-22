from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError
from .models import Task, DailyCheckIn, Film, Book


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        if User.objects.filter(username=data['username']).exists():
            raise ValidationError("This username is already taken.")
        return data

    def save(self):
        user = User.objects.create_user(
            username=self.validated_data['username'],
            email=self.validated_data['email'],
            password=self.validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if not user:
            raise ValidationError("Invalid credentials")
        data['user'] = user
        return data


class CheckInSummarySerializer(serializers.Serializer):
    score         = serializers.FloatField(read_only=True)
    capacity_tier = serializers.CharField(read_only=True)
    sleep_hours   = serializers.FloatField(read_only=True)
    mood          = serializers.IntegerField(read_only=True)


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'quadrant', 'is_done', 'created_at']
        read_only_fields = ['created_at']


class CheckInSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyCheckIn
        fields = ['id', 'sleep_hours', 'mood', 'food_quality', 'energy_level', 'score', 'date', 'notes']
        read_only_fields = ['score', 'date']


class FilmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Film
        fields = ['id', 'title', 'director', 'genre', 'status', 'rating', 'added_at']
        read_only_fields = ['added_at']

    def validate_rating(self, value):
        if value is not None and not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate_title(self, value):
        if len(value.strip()) < 1:
            raise serializers.ValidationError("Title cannot be empty.")
        return value


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'year', 'mood_tag', 'genre', 'status', 'added_at']
        read_only_fields = ['added_at']

    def validate_title(self, value):
        if len(value.strip()) < 1:
            raise serializers.ValidationError("Title cannot be empty.")
        return value
