
function getData() {

    const formData = new FormData();
    formData.append("action", "getData");
    formData.append("csrfmiddlewaretoken", $('input[name=csrfmiddlewaretoken]').val());

    $.ajax({

        url: "/admin_budget_details/",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
        $("#tableData tr:gt(0)").remove();
        for(var i = 0; i < response.length; i++) {
            var j = i + 1;
            $("#tableData").append('<tr><td>'+j+'</td><td style="display: none;">'+response[i].bd_id+'</td><td>'+response[i].bd_created_by+'</td><td>'+response[i].bd_name+'</td><td>'+response[i].bd_income+'</td><td>'+formatDate(response[i].bd_start_date)+'</td><td>'+formatDate(response[i].bd_end_date)+'</td></tr>');
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
getData();