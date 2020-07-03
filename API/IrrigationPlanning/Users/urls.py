# users/urls.py

from django.conf.urls import url
from .views import CreateUserAPIView, authenticate_user, UserRetrieveUpdateAPIView

app_name = 'Users'

urlpatterns = [
    url(r'^create/$', CreateUserAPIView.as_view()),
    url(r'^authenticate/$', authenticate_user, name='authenticate_user'),
    url(r'^update/$', UserRetrieveUpdateAPIView.as_view())
]
