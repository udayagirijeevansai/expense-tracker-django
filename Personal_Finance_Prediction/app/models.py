from django.db import models
from django.utils import timezone
# Create your models here.


class AdminMaster(models.Model):
    ad_id = models.AutoField(primary_key=True, unique=True)
    ad_name = models.CharField(max_length=100)
    ad_mobile = models.CharField(max_length=100)
    ad_email = models.CharField(max_length=100)
    ad_password = models.CharField(max_length=100)
    ad_role = models.CharField(max_length=100)
    ad_status = models.CharField(max_length=100, default="0")
    ad_created_by = models.CharField(max_length=100)


class Register(models.Model):
    rg_id = models.AutoField(primary_key=True, unique=True)
    rg_name = models.CharField(max_length=100)
    rg_mobile = models.CharField(max_length=100)
    rg_email = models.CharField(max_length=100)
    rg_password = models.CharField(max_length=100)
    rg_address = models.CharField(max_length=100, default="")
    rg_secret_key = models.CharField(max_length=100, default="")
    rg_status = models.CharField(max_length=100, default="0")


class Contact(models.Model):
    co_id = models.AutoField(primary_key=True, unique=True)
    co_name = models.CharField(max_length=100)
    co_mobile = models.CharField(max_length=100)
    co_email = models.CharField(max_length=100)
    co_subject = models.CharField(max_length=100)
    co_message = models.CharField(max_length=100)
    co_status = models.CharField(max_length=100)

class Transaction(models.Model):
    tn_id = models.AutoField(primary_key=True, unique=True)
    tn_date = models.DateField(default=timezone.now)
    tn_category = models.CharField(max_length=100)
    tn_amount = models.CharField(max_length=100)
    tn_description = models.CharField(max_length=100)
    tn_status = models.CharField(max_length=100, default="0")
    tn_created_by = models.CharField(max_length=100, default="")


class Budget(models.Model):
    bd_id = models.AutoField(primary_key=True, unique=True)
    bd_name = models.CharField(max_length=100, default="")
    bd_income = models.CharField(max_length=100)
    bd_start_date = models.DateField(default=timezone.now)
    bd_end_date = models.DateField(default=timezone.now)
    bd_status = models.CharField(max_length=100, default="0")
    bd_created_by = models.CharField(max_length=100, default="")

    
