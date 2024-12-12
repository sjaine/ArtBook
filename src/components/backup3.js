import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from "chart.js";

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement);

const customPlugin = {
  id: "customLabels",
  afterDatasetsDraw: (chart) => {
    const { ctx } = chart;
    const data = chart.data.datasets[0].data;
    console.log("work");

    chart.getDatasetMeta(0).data.forEach((bar, index) => {
      console.log("it works as well");
      const { x, y } = bar;
      const dept = data[index];

      if (!dept || !dept.image) return;

      const img = new Image();
      img.src = dept.image;

      // Draw circular image with stroke
      ctx.strokeStyle = "#FF594B";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y - 60, 37.5, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y - 60, 37.5, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(img, x - 37.5, y - 97.5, 75, 75);
      ctx.restore();

      // Draw department name and artworks count below the bar
      ctx.fillStyle = "#333";
      ctx.font = "bold 10px Archivo";
      ctx.textAlign = "center";
      ctx.fillText(dept.name, x, y + 35);

      ctx.fillStyle = "#666";
      ctx.fillText(`${dept.count} artworks`, x, y + 50);

      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px Archivo";
      ctx.textAlign = "center";
      ctx.fillText(dept.id, x, y + 15); // Draw rank number inside the circle

      // Draw department name below the bar
      ctx.fillStyle = "#333";
      ctx.font = "bold 10px Archivo";
      ctx.fillText(dept.name, x, y + 35);

      // Draw artworks count below the name
      ctx.fillStyle = "#666";
      ctx.font = "SemiBold 10px Archivo";
      ctx.fillText("artwork", x, y + 50);
    });
  },
};

ChartJS.register(customPlugin);

function Chart({ value }) {
  // Ensure data is an array
  const departments = Array.isArray(value) ? value : [];
  console.log("value: ", departments);

  const reorderedDepartments = [];
  if (departments.length >= 3) {
    reorderedDepartments.push(departments[1]); // Second place (left)
    reorderedDepartments.push(departments[0]); // First place (center)
    reorderedDepartments.push(departments[2]); // Third place (right)
  } else {
    reorderedDepartments.push(...departments); // If less than 3, use data as-is
  }

  // Prepare chart data
  const data = {
    labels: reorderedDepartments.map((dept) => dept.name), 
    datasets: [
      {
        label: "Saves",
        data: reorderedDepartments.map((dept) => dept.count), // Use save counts for data
        backgroundColor: ["#F7F7F7", "#F7F7F7", "#F7F7F7"],
        borderRadius: 20,
        barThickness: 110,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="chart_component">
      <Bar data={data} options={options} />
    </div>
  );
}

export default Chart;


