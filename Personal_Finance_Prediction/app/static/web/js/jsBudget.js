
function validateEmail(paramEmailID) {
    var filter = /^[0-9a-z.]+\@[a-z0-9]+\.[a-zA-z0-9]{2,4}$/;
    
    if (filter.test(paramEmailID)) {
      return true;
    } else {
      return false;
    }
  }

  

$("#btn_add").click(function (e) {
    if ($("#txtName").val().trim().length < 1) {
        alert("Please Enter Budget Name");
        $("#txtName").focus();
        return false;
    }

    if ($("#txtAmount").val().trim().length < 1) {
        alert("Please Enter Income");
        $("#txtAmount").focus();
        return false;
    }

    if ($("#selStartDate").val().trim().length < 1) {
        alert("Please Select Start Date");
        $("#selStartDate").focus();
        return false;
    }

    if ($("#selEndDate").val().trim().length < 1) {
        alert("Please Select End Date");
        $("#selEndDate").focus();
        return false;
    }


    const formData = new FormData();

    formData.append("txtName", $("#txtName").val());
    formData.append("txtAmount", $("#txtAmount").val());
    formData.append("selStartDate", $("#selStartDate").val());
    formData.append("selEndDate", $("#selEndDate").val());
    formData.append("csrfmiddlewaretoken", $('input[name=csrfmiddlewaretoken]').val());
    formData.append("action", "add");

    $.ajax({
    beforeSend: function () {
        $(".btn .spinner-border").show();
        $("#btn_add").attr("disabled", true);
    },
    url: "/budget_details/",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (result) {

        alert("Budget Added Successfully");
        location.reload();
        $("#add_modal").modal('hide');
        
    },
    error: function (request, error) {
        console.error(error);
    },
    complete: function () {
        $(".btn .spinner-border").hide();
        $("#btn_add").attr("disabled", false);
    },
    });
});
$(document).ready(function () {
  

$(document).on("click", "#btn_update", function () {

    if ($("#txtName1").val().trim().length < 1) {
        alert("Please Enter Budget Name");
        $("#txtName1").focus();
        return false;
    }

    if ($("#txtAmount1").val().trim().length < 1) {
        alert("Please Enter Income");
        $("#txtAmount1").focus();
        return false;
    }

    if ($("#selStartDate1").val().trim().length < 1) {
        alert("Please Select Start Date");
        $("#selStartDate1").focus();
        return false;
    }

    if ($("#selEndDate1").val().trim().length < 1) {
        alert("Please Select End Date");
        $("#selEndDate1").focus();
        return false;
    }
  
  const formData = new FormData();
  formData.append("txtName1", $("#txtName1").val());
  formData.append("txtAmount1", $("#txtAmount1").val());
  formData.append("selStartDate1", $("#selStartDate1").val());
  formData.append("selEndDate1", $("#selEndDate1").val());
  formData.append("id", $("#edit_id").val());
  formData.append("action", "update");
  formData.append("csrfmiddlewaretoken", $('input[name=csrfmiddlewaretoken]').val());

  $.ajax({
    beforeSend: function () {
      $(".btn .spinner-border").show();
      $("#btn_update").attr("disabled", true);
    },
    url: "/budget_details/",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (result) {
      alert("Budget Details Updated Succesfully");
      location.reload();
      $("#edit_modal").modal('hide');
    },
    error: function (request, error) {
      console.error(error);
    },
    complete: function () {
      $(".btn .spinner-border").hide();
      $("#btn_update").attr("disabled", false);
    },
  });
});

$(document).on("click", "#btn_delete", function () {

  const formData = new FormData();
  formData.append("id", $("#delete_id").val());
  formData.append("action", "delete");
  formData.append("csrfmiddlewaretoken", $('input[name=csrfmiddlewaretoken]').val());

  $.ajax({
    beforeSend: function () {
      $(".btn .spinner-border").show();
    },

    url: "/budget_details/",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function () {
      alert("Budget Details deleted succesfully");
      location.reload();
      $("#delete_modal").modal('hide');
    },
    error: function (request, error) {
      console.error(error);
    },
    complete: function () {
      $(".btn .spinner-border").hide();
      $(".close").click();
    },
  });
});

$(document).on("click", "#add_user", function () {

        $("#txtName").val('');
        $("#txtEmail").val('');
        $("#txtMobileNo").val('');
        $("#txtPassword").val('');

    });
});

function getData() {

var formData = new FormData();
formData.append("action", "getData");
formData.append("csrfmiddlewaretoken", $('input[name=csrfmiddlewaretoken]').val());

$.ajax({

    url: "/budget_details/",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      $("#tableData tr:gt(0)").remove();
      for(var i = 0; i < response.length; i++) {
        var j = i + 1;
        $("#tableData").append('<tr><td>'+j+'</td><td style="display: none;">'+response[i].bd_id+'</td><td>'+response[i].bd_name+'</td><td>'+response[i].bd_income+'</td><td>'+formatDate(response[i].bd_start_date)+'</td><td>'+formatDate(response[i].bd_end_date)+'</td><td><button type="button" class="btn btn-lg btn-warning" data-bs-toggle="modal" data-bs-target="#editModal" onclick=getRowsUpdate(); style="background: #ffc107">Update</button><button type="button" class="btn btn-lg btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick=getRowsDelete(); style="background: #dc3545">Delete</button></td></td></tr>');
      }
    },
    error: function (request, error) {
      console.error(error);
    },
    complete: function () {

    },
  });

}

function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
}

function formatDateToYYYYMMDD(dateStr) {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
}
getData();
function getRowsUpdate() {
    $("#tableData tr").click(function() {
        var currentRow = $(this).closest("tr");
        var lclID = currentRow.find("td:eq(1)").text();
        var lclName = currentRow.find("td:eq(2)").text();
        var lclIncome = currentRow.find("td:eq(3)").text();
        var lclStartDate = currentRow.find("td:eq(4)").text();
        var lclEndDate = currentRow.find("td:eq(5)").text();
        $("#txtName1").val(lclName);
        $("#txtAmount1").val(lclIncome);
        $("#selStartDate1").val(formatDateToYYYYMMDD(lclStartDate));
        $("#selEndDate1").val(formatDateToYYYYMMDD(lclEndDate));
        $("#edit_id").val(lclID);

    });
}


function getRowsDelete() {
    $("#tableData tr").click(function() {
        var currentRow = $(this).closest("tr");
        var lclID = currentRow.find("td:eq(1)").text();
        $("#delete_id").val(lclID);

    });
}