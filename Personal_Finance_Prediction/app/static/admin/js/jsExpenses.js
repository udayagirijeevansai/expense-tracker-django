
function getData() {

    const formData = new FormData();
    formData.append("action", "getData");
    formData.append("csrfmiddlewaretoken", $('input[name=csrfmiddlewaretoken]').val());

    $.ajax({

        url: "/admin_expenses_details/",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
        $("#tableData tr:gt(0)").remove();
        for(var i = 0; i < response.length; i++) {
            var j = i + 1;
            $("#tableData").append('<tr><td>'+j+'</td><td style="display: none;">'+response[i].tn_id+'</td><td>'+response[i].tn_created_by+'</td><td>'+formatDate(response[i].tn_date)+'</td><td>'+response[i].tn_category+'</td><td>'+response[i].tn_amount+'</td><td>'+response[i].tn_description+'</td></tr>');
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

function exportTableToExcel(tableID, filename = '') {
  const table = document.getElementById(tableID);
  const html = table.outerHTML.replace(/ /g, '%20');

  const dataType = 'application/vnd.ms-excel';
  filename = filename ? filename + '.xls' : 'excel_data.xls';

  const downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);

  downloadLink.href = 'data:' + dataType + ', ' + html;
  downloadLink.download = filename;
  downloadLink.click();
  document.body.removeChild(downloadLink);
}


$(".export-btn").click(function () {
    let table = document.getElementsByTagName("table");
    TableToExcel.convert(table[0], {
      name: 'report.xlsx',
      sheet: {
        name: 'Sheet 1'
      }
    });
  });