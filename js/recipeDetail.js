google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  // Set Data
  const data = google.visualization.arrayToDataTable([
    ["Category", "Percentage"],
    ["Fat", 38.3],
    ["Carbohydrate", 48.9],
    ["Protein", 12.8],
  ]);

  // Set Options with customized colors
  const options = {
    pieSliceText: "percentage", // Hiển thị phần trăm trong các phân đoạn
    colors: ["#DB4965", "#EA9F77", "#1AB394"], // Màu sắc cho các phân đoạn
    legend: { position: "bottom", alignment: "center" }, // Vị trí của phần giải thích
  };

  // Draw the chart
  const chart = new google.visualization.PieChart(
    document.getElementById("myChart")
  );
  chart.draw(data, options);
}
