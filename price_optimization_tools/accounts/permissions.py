from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Custom permission class to check if the user has an 'admin' role.
    - Grants access only to users whose role is 'admin'.
    """
    def has_permission(self, request, view):
        """
        Checks if the user has the 'admin' role.
        - Returns True if the user is an admin, otherwise returns False.
        """
        return request.user.role == 'admin'  # Check if the user's role is 'admin'

class IsSupplier(permissions.BasePermission):
    """
    Custom permission class to check if the user has a 'supplier' role.
    - Grants access only to users whose role is 'supplier'.
    """
    def has_permission(self, request, view):
        """
        Checks if the user has the 'supplier' role.
        - Returns True if the user is a supplier, otherwise returns False.
        """
        return request.user.role == 'supplier'  # Check if the user's role is 'supplier'

class IsBuyer(permissions.BasePermission):
    """
    Custom permission class to check if the user has a 'buyer' role.
    - Grants access only to users whose role is 'buyer'.
    """
    def has_permission(self, request, view):
        """
        Checks if the user has the 'buyer' role.
        - Returns True if the user is a buyer, otherwise returns False.
        """
        return request.user.role == 'buyer'  # Check if the user's role is 'buyer'
