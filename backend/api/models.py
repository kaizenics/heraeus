from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Post(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255, blank=True, default='')
    post = models.CharField(max_length=9999, blank=True, default='')
    image = models.ImageField(upload_to='uploads/', blank=True, null=True)
    
    class Meta:
        ordering = ['created']

class CustomUser(AbstractUser):
    class Meta:
        verbose_name = 'Custom User'
        verbose_name_plural = 'Custom Users'

# Add related_name to avoid clashes
CustomUser._meta.get_field('groups').remote_field.related_name = 'customuser_groups'
CustomUser._meta.get_field('user_permissions').remote_field.related_name = 'customuser_user_permissions'
