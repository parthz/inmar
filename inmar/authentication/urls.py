# Author : Partha
from django.conf.urls import url, include
from rest_framework_nested import routers

from services.views import SearchAddView
from .views import user_login, user_logout
from django.views.decorators.csrf import csrf_exempt
from .viewsets import UserViewSet

router = routers.SimpleRouter()
router.register(r'user', UserViewSet)

urlpatterns = [
    url(r'^auth/login/$', user_login), 
    url(r'^auth/logout/$', user_logout),
    url(r'^auth/user/(?P<dispatch>[\w-]+)/$',
        csrf_exempt(SearchAddView.as_view(template="authentication/users.html"))),
    url(r'^api/v1/', include(router.urls)),    
]
