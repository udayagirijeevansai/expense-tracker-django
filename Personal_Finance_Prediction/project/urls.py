"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app import views

urlpatterns = [
    path("", views.webIndex, name="web"),
    path("about/", views.about, name="web"),
    path("contact/", views.contact, name="web"),
    path("login_admin/", views.loginAdmin, name="web"),
    path("login/", views.loginUser, name="web"),
    path("register/", views.register, name="web"),
    path("profile/", views.profile, name="web"),
    path("web_login/", views.webLogin, name="web"),
    path("web_logout/", views.webLogout, name=""),
    path("add_register/", views.newRegister, name="home"),
    path("save_contact/", views.saveContact, name="home"),
    path("expenses/", views.expenses, name="home"),
    path("expense_details/", views.expensesDetails, name="home"),
    path("budget/", views.budget, name="home"),
    path("budget_details/", views.budgetDetails, name="home"),
    path("report/", views.report, name="home"),
    path("report_view/", views.reportView, name="home"),
    path("predict_next_month_budget/", views.predict_next_month_budget, name="home"),
    path("admin_master/", views.adminMaster, name="home"),
    path("admin_expenses/", views.adminExpenses, name="home"),
    path("admin_budget/", views.adminBudget, name="home"),
    path("admin_report/", views.adminReport, name="home"),
    path("admin_profile/", views.adminProfile, name="home"),

    path("admin_details/", views.adminDetails, name="home"),
    path("admin_expenses_details/", views.adminExpensesDetails, name="home"),
    path("admin_budget_details/", views.adminBudgetDetails, name="home"),
    path("admin_report_details/", views.adminReportDetails, name="home"),
    path("get_admin_profile/", views.adminProfileDetails, name="home"),
    path("admin_update_profile/", views.adminUpdateProfileDetails, name="home"),
    path("admin_login/", views.adminLogout, name=""),
    path("admin_logout/", views.adminLogout, name=""),
]
