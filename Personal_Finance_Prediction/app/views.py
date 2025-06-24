from django.shortcuts import render
from app.models import AdminMaster
from app.models import Register
from app.models import Contact
from app.models import Transaction
from app.models import Budget
from django.http import HttpResponse
from django.contrib.auth.models import Permission
from django.http import JsonResponse
from rest_framework import serializers
import json
import datetime
from django.db.models import Sum
from django.db.models import Func, F, FloatField
from django.utils.dateparse import parse_date
from django.db import models
from .models import Transaction, Budget
from sklearn.linear_model import LinearRegression
import pandas as pd
from dateutil.relativedelta import relativedelta
from datetime import datetime



def openLogin(request):
    return render(request, "admin/admin_login.html", {})

def webIndex(request):
    web_email = request.session.get("web_email")
    return render(request, "web/index.html", {"web_email": web_email})

def about(request):
    web_email = request.session.get("web_email")
    return render(request, "web/about.html", {"web_email": web_email})

def contact(request):
    web_email = request.session.get("web_email")
    return render(request, "web/contact.html", {"web_email": web_email})

def loginUser(request):
    return render(request, "web/login.html", {})

def register(request):
    return render(request, "web/register.html", {})

def profile(request):
    return render(request, "web/profile.html", {})

def expenses(request):
    return render(request, "web/expenses.html", {})

def budget(request):
    return render(request, "web/budget.html", {})

def report(request):
    return render(request, "web/report.html", {})

def adminExpenses(request):
    return render(request, "admin/admin_expenses.html", {})

def adminBudget(request):
    return render(request, "admin/admin_budget.html", {})

def adminReport(request):
    return render(request, "admin/admin_report.html", {})

def adminProfile(request):
    return render(request, "admin/admin_profile.html", {})

def webLogin(request):
    if Register.objects.filter(
        rg_email=request.POST["txtEmail"],
        rg_password=request.POST["txtPassword"],
    ).count():
        request.session["web_email"] = request.POST["txtEmail"]
        return HttpResponse("1")
    else:
        return HttpResponse("0")

def adminProfileDetails(request):
    dataValue = AdminMaster.objects.filter(
            ad_email=request.session["email"]
        ).values()
    data = list(dataValue)
    return JsonResponse(data, safe=False)

def adminUpdateProfileDetails(request):
    data = AdminMaster.objects.filter(ad_email=request.session["email"]).update(
        ad_name=request.POST["txtName"],
        ad_mobile=request.POST["txtMobile"],
        ad_password=request.POST["txtPassword"],
    )

    return HttpResponse();

def webLogout(request):
    del request.session["web_email"]
    return render(request, "web/index.html")

def adminLogout(request):
    if "email" in request.session:
        del request.session["email"]
    return render(request, "admin/admin_login.html")

def newRegister(request):
    if Register.objects.filter(
        rg_email=request.POST["txtEmail"], rg_mobile=request.POST["txtMobileNo"]
    ).count():
        return HttpResponse("10")
    else:
        lclID = Register.objects.count()
        status = "0"
        lclNewID = lclID + 1

        Register.objects.create(
            rg_id=lclNewID,
            rg_name=request.POST["txtName"],
            rg_mobile=request.POST["txtMobileNo"],
            rg_email=request.POST["txtEmail"],
            rg_password=request.POST["txtPassword"],
        )

        return HttpResponse("0")

def saveContact(request):
    lclID = Contact.objects.count()
    status = "0"
    lclNewID = lclID + 1

    Contact.objects.create(
        co_id=lclNewID,
        co_name=request.POST["txtName"],
        co_email=request.POST["txtEmail"],
        co_mobile=request.POST["txtMobileNo"],
        co_subject=request.POST["txtSubject"],
        co_message=request.POST["txtMessage"],
        co_status=status,
    )

    return HttpResponse()

def loginAdmin(request):
    if AdminMaster.objects.filter(
        ad_email=request.POST["txtEmail"], ad_password=request.POST["txtPassword"]
    ).count():
        dataValue = AdminMaster.objects.filter(
            ad_email=request.POST["txtEmail"]
        ).values()
        data = list(dataValue)
        dictValue = data[0]
        request.session["email"] = dictValue["ad_email"]
        request.session["role"] = dictValue["ad_role"]
        request.session["name"] = dictValue["ad_name"]
        return HttpResponse(dictValue["ad_role"])
    else:
        return HttpResponse("10")


def logoutAdmin(request):
    request.session.delete()
    return render(request, "index.html", {})


# admin details
def adminMaster(request):
    return render(request, "admin/admin_master.html", {})


def expensesDetails(request):
    if request.POST["action"] == "add":
        try:
            data = request.POST
            tn_date = parse_date(data["selDate"])
            tn_category = data["selCategory"]
            tn_amount = float(data["txtAmount"])
            tn_description = data["txtDescription"]
            created_by = request.session.get("web_email")

            # Check for active budget
            try:
                active_budget = Budget.objects.get(
                    bd_created_by=created_by,
                    bd_start_date__lte=tn_date,
                    bd_end_date__gte=tn_date,
                    bd_status="0"
                )
            except Budget.DoesNotExist:
                return JsonResponse({
                    "status": False,
                    "message": "No active budget found for the selected date."
                }, status=400)

            # Sum all transactions within the budget date range
            total_spent = Transaction.objects.filter(
                tn_created_by=created_by,
                tn_date__gte=active_budget.bd_start_date,
                tn_date__lte=active_budget.bd_end_date
            ).aggregate(
                total=models.Sum(
                    models.ExpressionWrapper(
                        models.F("tn_amount"),
                        output_field=models.FloatField()
                    )
                )
            )["total"] or 0.0

            # Get budget income (convert to float just in case)
            budget_income = float(active_budget.bd_income)

            # Check if adding this transaction exceeds budget
            if (total_spent + tn_amount) > budget_income:
                return JsonResponse({
                    "status": False,
                    "message": f"Transaction exceeds your budget limit. Total spent: {total_spent}, Budget: {budget_income}"
                })

            # Save the transaction
            txn = Transaction.objects.create(
                tn_date=tn_date,
                tn_category=tn_category,
                tn_amount=tn_amount,
                tn_description=tn_description,
                tn_created_by=created_by
            )

            return JsonResponse({
                "status": True,
                "message": "Transaction added successfully!",
                "transaction": {
                    "id": txn.tn_id,
                    "date": txn.tn_date,
                    "category": txn.tn_category,
                    "amount": txn.tn_amount,
                    "description": txn.tn_description
                },
                "total_spent": total_spent + tn_amount,
                "budget": budget_income
            })

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": f"An error occurred: {str(e)}"
            })

    elif request.POST["action"] == "getData":
        data = Transaction.objects.filter(tn_status="0", tn_created_by = request.session["web_email"]).values()
        data = list(data)
        values = JsonResponse(data, safe=False)
        return values

    elif request.POST["action"] == "update":
        Transaction.objects.filter(tn_id=request.POST["id"]).update(
            tn_date=request.POST["selDate1"],
            tn_category=request.POST["selCategory1"],
            tn_amount=request.POST["txtAmount1"],
            tn_description=request.POST["txtDescription1"]
        )

    elif request.POST["action"] == "delete":
        data = Transaction.objects.filter(tn_id=request.POST["id"]).update(
            tn_status="1"
        )

    return HttpResponse()

def budgetDetails(request):
    if request.POST["action"] == "add":
        Budget.objects.create(
            bd_name=request.POST["txtName"],
            bd_income=request.POST["txtAmount"],
            bd_start_date=request.POST["selStartDate"],
            bd_end_date=request.POST["selEndDate"],
            bd_created_by=request.session["web_email"],
        )

    elif request.POST["action"] == "getData":
        data = Budget.objects.filter(bd_status="0", bd_created_by = request.session["web_email"]).values()
        data = list(data)
        values = JsonResponse(data, safe=False)
        return values

    elif request.POST["action"] == "update":
        Budget.objects.filter(bd_id=request.POST["id"]).update(
            bd_name=request.POST["txtName1"],
            bd_income=request.POST["txtAmount1"],
            bd_start_date=request.POST["selStartDate1"],
            bd_end_date=request.POST["selEndDate1"]
        )

    elif request.POST["action"] == "delete":
        data = Budget.objects.filter(bd_id=request.POST["id"]).update(
            bd_status="1"
        )

    return HttpResponse()

def reportView(request):
    expenses = (
        Transaction.objects
        .filter(tn_created_by=request.session["web_email"])
        .annotate(
            amount_float=Func(
                F('tn_amount'),
                function='CAST',
                template='%(function)s(%(expressions)s AS FLOAT)',
                output_field=FloatField()
            )
        )
        .values('tn_category')
        .annotate(total_amount=Sum('amount_float'))
    )

    data = {
        'categories': [item['tn_category'] for item in expenses],
        'amounts': [float(item['total_amount']) for item in expenses]
    }

    return JsonResponse(data)


def adminDetails(request):
    if request.POST["action"] == "add":
        if (
            AdminMaster.objects.filter(
                ad_mobile=request.POST["txtMobileNo"],
                ad_email=request.POST["txtEmail"],
                ad_status=0,
            ).count()
            == 0
        ):
            AdminMaster.objects.create(
                ad_name=request.POST["txtName"],
                ad_mobile=request.POST["txtMobileNo"],
                ad_email=request.POST["txtEmail"],
                ad_password=request.POST["txtPassword"],
                ad_role=request.POST["selRole"],
            )
        else:
            return HttpResponse("10")

    elif request.POST["action"] == "getData":
        data = AdminMaster.objects.filter(ad_status="0").values()
        data = list(data)
        values = JsonResponse(data, safe=False)
        return values

    elif request.POST["action"] == "update":
        data = AdminMaster.objects.filter(ad_id=request.POST["id"]).update(
            ad_name=request.POST["txtName1"],
            ad_mobile=request.POST["txtMobileNo1"],
            ad_email=request.POST["txtEmail1"],
        )

    elif request.POST["action"] == "delete":
        data = AdminMaster.objects.filter(ad_id=request.POST["id"]).update(
            ad_status="1"
        )

    return HttpResponse()

def adminExpensesDetails(request):
    if request.POST["action"] == "getData":
        data = Transaction.objects.filter(tn_status="0").values()
        data = list(data)
        values = JsonResponse(data, safe=False)
        return values

    return HttpResponse()

def adminBudgetDetails(request):
    if request.POST["action"] == "getData":
        data = Budget.objects.filter(bd_status="0").values()
        data = list(data)
        values = JsonResponse(data, safe=False)
        return values

    return HttpResponse()

def adminReportDetails(request):
    expenses = (
        Transaction.objects
        .filter()
        .annotate(
            amount_float=Func(
                F('tn_amount'),
                function='CAST',
                template='%(function)s(%(expressions)s AS FLOAT)',
                output_field=FloatField()
            )
        )
        .values('tn_category')
        .annotate(total_amount=Sum('amount_float'))
    )

    data = {
        'categories': [item['tn_category'] for item in expenses],
        'amounts': [float(item['total_amount']) for item in expenses]
    }

    return JsonResponse(data)


def predict_next_month_budget(request):
    try:
        user_email = request.session.get("web_email")
        budgets = Budget.objects.filter(bd_created_by=user_email).order_by("bd_start_date")

        # Prepare data
        data = []
        for b in budgets:
            try:
                income = float(b.bd_income)
                month = b.bd_start_date.strftime("%Y-%m")
                data.append({"month": month, "income": income})
            except ValueError:
                continue

        if len(data) < 2:
            return JsonResponse({
                "status": False,
                "message": "Not enough data to predict."
            }, status=400)

        # Create DataFrame
        df = pd.DataFrame(data)
        df["month_idx"] = range(len(df))

        # Train model on the fly
        X = df[["month_idx"]]
        y = df["income"]
        model = LinearRegression()
        model.fit(X, y)

        # Predict next month
        next_idx = [[len(df)]]
        predicted_income = model.predict(next_idx)[0]

        # Format next month as "Month Year"
        last_month = datetime.strptime(df["month"].iloc[-1], "%Y-%m")
        next_month_str = (last_month + relativedelta(months=1)).strftime("%B %Y")

        return JsonResponse({
            "status": True,
            "message": "Prediction successful.",
            "predicted_budget": round(predicted_income, 2),
            "next_month": next_month_str
        })

    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": f"Error: {str(e)}"
        }, status=500)