
function getData() {

    var formData = new FormData();
    formData.append("action", "getData");
    formData.append("csrfmiddlewaretoken", $('input[name=csrfmiddlewaretoken]').val());
    
    $.ajax({
    
        url: "/predict_next_month_budget/",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log(response);
            $("#budgetMonth").html(response.next_month);
            $("#budgetAmount").html("₹ " + response.predicted_budget);
        },
        error: function (request, error) {
          console.error(error);
        },
        complete: function () {
    
        },
      });
    
    }

    getData();