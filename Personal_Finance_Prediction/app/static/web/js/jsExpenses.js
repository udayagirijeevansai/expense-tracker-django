
function validateEmail(paramEmailID) {
    var filter = /^[0-9a-z.]+\@[a-z0-9]+\.[a-zA-z0-9]{2,4}$/;
    
    if (filter.test(paramEmailID)) {
      return true;
    } else {
      return false;
    }
  }



$("#btn_add").click(function (e) {
    if ($("#selDate").val().trim().length < 1) {
        alert("Please Select Date");
        $("#selDate").focus();
        return false;
    }

    if ($("#selCategory").val().trim().length < 1) {
        alert("Please Select Category");
        $("#selCategory").focus();
        return false;
    }

    if ($("#txtAmount").val().trim().length < 1) {
        alert("Please Enter Amount");
        $("#txtAmount").focus();
        return false;
    }

    if ($("#txtDescription").val().trim().length < 1) {
        alert("Please Enter Description");
        $("#txtDescription").focus();
        return false;
    }


    const formData = new FormData();

    formData.append("selDate", $("#selDate").val());
    formData.append("selCategory", $("#selCategory").val());
    formData.append("txtAmount", $("#txtAmount").val());
    formData.append("txtDescription", $("#txtDescription").val());
    formData.append("csrfmiddlewaretoken", $('input[name=csrfmiddlewaretoken]').val());
    formData.append("action", "add");

    $.ajax({
    beforeSend: function () {
        $(".btn .spinner-border").show();
        $("#btn_add").attr("disabled", true);
    },
    url: "/expense_details/",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (res) {
      console.log(res);
      if(res.status) {
        alert("Expense Added Successfully");
        location.reload();
        $("#add_modal").modal('hide');
      } else {
        alert("Expense Exceeding the Total Budget reserved for this date");
      }
        
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

    if ($("#selDate1").val().trim().length < 1) {
        alert("Please Select Date");
        $("#selDate1").focus();
        return false;
    }

    if ($("#selCategory1").val().trim().length < 1) {
        alert("Please Select Category");
        $("#selCategory1").focus();
        return false;
    }

    if ($("#txtAmount1").val().trim().length < 1) {
        alert("Please Enter Amount");
        $("#txtAmount1").focus();
        return false;
    }

    if ($("#txtDescription1").val().trim().length < 1) {
        alert("Please Enter Description");
        $("#txtDescription1").focus();
        return false;
    }
  
  const formData = new FormData()
  formData.append("selDate1", $("#selDate1").val());
  formData.append("selCategory1", $("#selCategory1").val());
  formData.append("txtAmount1", $("#txtAmount1").val());
  formData.append("txtDescription1", $("#txtDescription1").val());
  formData.append("id", $("#edit_id").val());
  formData.append("action", "update");
  formData.append("csrfmiddlewaretoken", $('input[name=csrfmiddlewaretoken]').val());

  $.ajax({
    beforeSend: function () {
      $(".btn .spinner-border").show();
      $("#btn_update").attr("disabled", true);
    },
    url: "/expense_details/",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (result) {
      alert("Expense Details Updated Succesfully");
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

    url: "/expense_details/",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function () {
      alert("Expense Details deleted succesfully");
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

    url: "/expense_details/",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      $("#tableData tr:gt(0)").remove();
      for(var i = 0; i < response.length; i++) {
        var j = i + 1;
        $("#tableData").append('<tr><td>'+j+'</td><td style="display: none;">'+response[i].tn_id+'</td><td>'+formatDate(response[i].tn_date)+'</td><td>'+response[i].tn_category+'</td><td>'+response[i].tn_amount+'</td><td>'+response[i].tn_description+'</td><td><button type="button" class="btn btn-lg btn-warning" data-bs-toggle="modal" data-bs-target="#editModal" onclick=getRowsUpdate(); style="background: #ffc107">Update</button><button type="button" class="btn btn-lg btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick=getRowsDelete(); style="background: #dc3545">Delete</button></td></td></tr>');
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
        var lclDate = currentRow.find("td:eq(2)").text();
        var lclCategory = currentRow.find("td:eq(3)").text();
        var lclAmount = currentRow.find("td:eq(4)").text();
        var lclDesc = currentRow.find("td:eq(5)").text();
        $("#selDate1").val(formatDateToYYYYMMDD(lclDate));
        $("#selCategory1").val(lclCategory);
        $("#txtAmount1").val(lclAmount);
        $("#txtDescription1").val(lclDesc);
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