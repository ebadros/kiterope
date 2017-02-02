from rest_framework import permissions


class UserPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        print(view.action)
        if view.action == 'list':
            return request.user.is_authenticated() and request.user.is_admin
        elif view.action == 'create':
            return True
        elif view.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return True
        else:
            return False

    def has_object_permission(self, request, view, obj):
        if view.action == 'retrieve':
            return request.user.is_authenticated() and (obj == request.user or request.user.is_admin)
        elif view.action in ['update', 'partial_update']:
            return request.user.is_authenticated() and (obj == request.user or request.user.is_admin)
        elif view.action == 'destroy':
            return request.user.is_authenticated() and request.user.is_admin
        else:
            return False

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `author`.
        return obj.author == request.user
SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS']

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return True

        # Instance must have an attribute named `author`.
        else:
            return obj.user == request.user

SAFE_ALL_ACCESS_POST_METHODS = ['POST', 'HEAD', 'OPTIONS']
SAFE_ADMIN_METHODS = ['GET', 'UPDATE', 'PATCH', 'HEAD', 'OPTIONS', 'PUT', 'POST']

class AllAccessPostingOrAdminAll(permissions.BasePermission):
    def has_permission(self, request, view):
        if (request.method in SAFE_ALL_ACCESS_POST_METHODS):
            return True
        elif (request.method in SAFE_ADMIN_METHODS):
            return request.user.is_authenticated() and (request.user.is_superuser)
        else:
            False

