from django.urls import path, include
from .views import PostViewSet, UserRegistrationView, LogoutView, UserLoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter


app_name = 'api'

router = DefaultRouter()
router.register('post', PostViewSet, basename='post')

urlpatterns = [
    path('post/', PostViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path('post/<int:pk>/', PostViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    })),
    path('login/', UserLoginView.as_view(), name='login'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
] + router.urls

