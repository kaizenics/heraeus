from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .serializers import PostSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from django.contrib.auth import logout
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomTokenObtainPairSerializer

import random
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp.util import random_hex
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
import logging

from .serializers import UserSerializer

# AUTHENTICATION OPERATIONS
class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request):
        username_or_email = request.data.get('username')
        password = request.data.get('password')

        is_email = '@' in username_or_email

        if is_email:
            user = authenticate(request, email=username_or_email, password=password)
        else:
            user = authenticate(request, username=username_or_email, password=password)

        if user is not None:
        # If the user is valid, generate JWT tokens
            refresh = RefreshToken.for_user(user)
            data = {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
            return Response(data, status=status.HTTP_200_OK)
        else:
            # If the user is not valid, return an error response
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            user = self.user
            response.data['user_id'] = user.id
            response.data['username'] = user.username
        return response

    
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
    
# OTP OPERATIONS
logger = logging.getLogger(__name__)
class SendOTPView(APIView):
    @csrf_exempt
    def post(self, request):
        try:
            email = request.data.get('email', '')

            # Validate email format
            try:
                validate_email(email)
            except ValidationError:
                return JsonResponse({'error': 'Invalid email format'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the user exists
            user = User.objects.filter(email=email).first()
            if not user:
                return JsonResponse({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            # Generate OTP
            otp = random.randint(100000, 999999)

            # Save OTP to the user's TOTPDevice
            device, created = TOTPDevice.objects.get_or_create(user=user)
            device.key = random_hex()
            device.save()
            device.totp_token = str(otp)
            device.save()

            # Compose the email subject and body
            subject = 'One-Time Password (OTP) | Forgot Password'
            body = (
                f'Hello! from Heraeus Interactive\n\n'
                f'Your One-Time Password (OTP) for resetting your password is: {otp}.\n\n'
                f'This OTP is valid for 5 minutes. Do not share it with anyone.\n\n'
                f'If you did not request this OTP, please ignore this email.\n\n'
            )

            # Send OTP to the user's email
            send_mail(
                subject,
                body,
                'from@example.com',
                [email],
                fail_silently=False,
            )


            return JsonResponse({'message': 'OTP sent successfully'})
        except Exception as e:
            # Log the error for debugging purposes
            logger.error(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class VerifyOTPView(APIView):
    def post(self, request):
        try:
            email = request.data.get('email', '')
            otp_entered = request.data.get('otp', '')

            user = get_object_or_404(User, email=email)
            device = get_object_or_404(TOTPDevice, user=user)

            if device.verify_token(otp_entered):
                # Mark the device as confirmed to prevent replay attacks
                device.confirmed = True
                device.save()
                
                return JsonResponse({'message': 'OTP verification successful'})
            else:
                return JsonResponse({'error': 'Invalid OTP'})
        except Exception as e:
            # Log the error for debugging purposes
            logger.error(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChangePasswordView(APIView):
    def post(self, request):
        if request.method == 'POST':
            email = request.data.get('email', '')
            new_password = request.data.get('new_password', '')

            user = get_object_or_404(User, email=email)
            user.set_password(new_password)
            user.save()

            return JsonResponse({'message': 'Password changed successfully'})
        else:
            return JsonResponse({'error': 'Invalid request method'})
    
# CRUD OPERATIONS
class PostViewSet(ModelViewSet):  
    serializer_class = PostSerializer

    def get_queryset(self):
        return self.serializer_class.Meta.model.objects.all()
    
    def post(self, request, *args, **kwargs): 
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, pk=None, *args, **kwargs): 
        if pk is not None:
            try:
                post_instance = self.serializer_class.Meta.model.objects.get(id=pk)
                serializer = PostSerializer(post_instance)
                return Response(serializer.data)
            except self.serializer_class.Meta.model.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk=None, *args, **kwargs):
        if pk is not None:
            try:
                post_instance = self.serializer_class.Meta.model.objects.get(id=pk)
                serializer = self.get_serializer(post_instance, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except self.serializer_class.Meta.model.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk=None, *args, **kwargs):
        if pk is not None:
            try:
                post_instance = self.serializer_class.Meta.model.objects.get(id=pk)
                serializer = self.get_serializer(post_instance, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except self.serializer_class.Meta.model.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk=None, *args, **kwargs):
        if pk is not None:
            try:
                post_instance = self.serializer_class.Meta.model.objects.get(id=pk)
                post_instance.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            except self.serializer_class.Meta.model.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)