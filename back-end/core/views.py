from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.db import IntegrityError

from .models import Task, Film, Book, DailyCheckIn
from .serializers import (
    RegisterSerializer, LoginSerializer,
    TaskSerializer, FilmSerializer, BookSerializer,
    CheckInSerializer, CheckInSummarySerializer,
)



@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access':  str(refresh.access_token),
            'username': user.username,
            'email': user.email,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'access':   str(refresh.access_token),
            'refresh':  str(refresh),
            'username': user.username,
            'email': user.email,
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data['refresh_token']
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)




class TaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tasks = Task.objects.filter(user=request.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        task = get_object_or_404(Task, pk=pk)
        if task.user != user:
            raise PermissionDenied()
        return task

    def get(self, request, pk):
        task = self.get_object(pk, request.user)
        return Response(TaskSerializer(task).data)

    def put(self, request, pk):
        task = self.get_object(pk, request.user)
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        task = self.get_object(pk, request.user)
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        task = self.get_object(pk, request.user)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_stats_view(request):
    tasks = Task.objects.filter(user=request.user)
    total     = tasks.count()
    completed = tasks.filter(is_done=True).count()
    completion_rate = round((completed / total * 100), 2) if total > 0 else 0.0

    quadrant_counts = {
        'UI':   tasks.filter(quadrant='UI').count(),
        'UNI':  tasks.filter(quadrant='UNI').count(),
        'NUI':  tasks.filter(quadrant='NUI').count(),
        'NUNI': tasks.filter(quadrant='NUNI').count(),
    }

    return Response({
        'total_tasks':             total,
        'completed_tasks':         completed,
        'completion_rate_percent': completion_rate,
        'tasks_per_quadrant':      quadrant_counts,
    })


class FilmListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        films = Film.objects.filter(user=request.user)
        return Response(FilmSerializer(films, many=True).data)

    def post(self, request):
        serializer = FilmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def film_detail_view(request, pk):
    try:
        film = Film.objects.get(pk=pk)
    except Film.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    if film.user != request.user:
        return Response({'detail': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        return Response(FilmSerializer(film).data)

    if request.method == 'PATCH':
        serializer = FilmSerializer(film, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    film.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)



class BookListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        books = Book.objects.filter(user=request.user)
        return Response(BookSerializer(books, many=True).data)

    def post(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def book_detail_view(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    if book.user != request.user:
        return Response({'detail': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        return Response(BookSerializer(book).data)

    if request.method == 'PATCH':
        serializer = BookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

   
    book.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def checkin_view(request):
    if request.method == 'POST':
        serializer = CheckInSerializer(data=request.data)
        if serializer.is_valid():
            try:
                checkin, created = DailyCheckIn.objects.update_or_create(
                    user=request.user,
                    date=serializer.validated_data.get('date', None) or __import__('datetime').date.today(),
                    defaults={
                        'sleep_hours':  serializer.validated_data['sleep_hours'],
                        'mood':         serializer.validated_data['mood'],
                        'food_quality': serializer.validated_data['food_quality'],
                        'energy_level': serializer.validated_data['energy_level'],
                        'notes':        serializer.validated_data.get('notes', ''),
                    },
                )
               
                checkin.save()
                resp_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
                return Response(CheckInSerializer(checkin).data, status=resp_status)
            except IntegrityError as e:
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    checkins = DailyCheckIn.objects.filter(user=request.user).order_by('-date')
    return Response(CheckInSerializer(checkins, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def checkin_latest_view(request):
    checkin = DailyCheckIn.objects.filter(user=request.user).order_by('-date').first()
    if checkin is None:
        return Response({'detail': 'No check-ins found.'}, status=status.HTTP_404_NOT_FOUND)
    return Response(CheckInSerializer(checkin).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommendation_view(request):
    checkin = DailyCheckIn.objects.filter(user=request.user).order_by('-date').first()
    if checkin is None:
        return Response(
            {'detail': 'No check-in data found. Please submit a check-in first.'},
            status=status.HTTP_404_NOT_FOUND,
        )

    score = checkin.score

    if score >= 65:
        capacity_tier = 'High'
        tasks = Task.objects.filter(user=request.user)
    elif score >= 40:
        capacity_tier = 'Medium'
        tasks = Task.objects.filter(user=request.user, quadrant__in=['UI', 'UNI'])
    else:
        capacity_tier = 'Low'
        tasks = Task.objects.filter(user=request.user, quadrant__in=['UI', 'NUI'])

    suggested_film = (
        Film.objects.filter(user=request.user, genre='comedy')
        .order_by('-rating')
        .first()
    )
    suggested_book = (
        Book.objects.filter(user=request.user, mood_tag='light')
        .first()
    )

    
    return Response({
        'capacity_tier':  capacity_tier,
        'score':          score,
        'tasks':          TaskSerializer(tasks, many=True).data,
        'suggested_film': FilmSerializer(suggested_film).data if suggested_film else None,
        'suggested_book': BookSerializer(suggested_book).data if suggested_book else None,
    })
