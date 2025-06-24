function getData() {
  var formData = new FormData();
  formData.append("action", "getData");
  formData.append("csrfmiddlewaretoken", $('input[name=csrfmiddlewaretoken]').val());

  $.ajax({
    url: "/report_view/",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      const categories = response.categories;
      const amounts = response.amounts;

      const colors = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1'];

      if (window.barChart) window.barChart.destroy();
      if (window.pieChart) window.pieChart.destroy();
      if (window.lineChart) window.lineChart.destroy();

      const barCtx = document.getElementById('expenseBarChart').getContext('2d');
      window.barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [{
            label: 'Expenses (₹)',
            data: amounts,
            backgroundColor: colors,
            borderColor: '#333',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Bar Chart: Expense Breakdown'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Amount (₹)'
              }
            }
          }
        }
      });

      const pieCtx = document.getElementById('expensePieChart').getContext('2d');
      window.pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: categories,
          datasets: [{
            label: 'Expenses',
            data: amounts,
            backgroundColor: colors
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Pie Chart: Expense Distribution'
            }
          }
        }
      });

      const lineCtx = document.getElementById('expenseLineChart').getContext('2d');
      window.lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: categories,
          datasets: [{
            label: 'Expenses (₹)',
            data: amounts,
            backgroundColor: 'rgba(78, 121, 167, 0.2)',
            borderColor: '#4e79a7',
            borderWidth: 2,
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Line Chart: Expenses Over Categories'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Amount (₹)'
              }
            }
          }
        }
      });
    },
    error: function (request, error) {
      console.error("AJAX error:", error);
    }
  });
}

getData();
