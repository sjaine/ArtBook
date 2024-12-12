import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from "chart.js";

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement);

  // Plugin to draw images and labels
  const customPlugin = {
    id: "customLabels",
    afterDatasetsDraw: (chart) => {
      const { ctx } = chart;
      // const dataset = chart.data.datasets[0];

      chart.getDatasetMeta(0).data.forEach((bar, index) => {
        const { x, y } = bar; // Bar position
        const dept = reorderedDepartments[index]; // Get department data

        if (!dept) return;

        // Draw circular image with stroke
        const img = new Image();
        img.src = dept.image;

        img.onload = () => {
          ctx.strokeStyle = "#FF594B"; // Set stroke color
          ctx.lineWidth = 3; // Set stroke width
          ctx.beginPath();
          ctx.arc(x - 38 + 75/2, y - 60 + 75/2, 37.5, 0, 2 * Math.PI); // Draw circle around the image
          ctx.stroke();

          ctx.save();
          ctx.beginPath();
          ctx.arc(x - 38 + 37.5, y - 60 + 37.5, 37.5, 0, 2 * Math.PI); // Draw circle clip path
          ctx.clip();
          ctx.drawImage(img, x - 38, y - 60, 75, 75); // Draw clipped image
          ctx.restore();

          // Draw rank circle with stroke
          ctx.strokeStyle = "#fff"; // Set stroke color
          ctx.lineWidth = 3; // Set stroke width
          ctx.beginPath();
          ctx.arc(x, y + 10, 15, 0, 2 * Math.PI);
          ctx.stroke();

          ctx.fillStyle = "#FF594B"; // Set fill color
          ctx.beginPath();
          ctx.arc(x, y + 10, 14, 0, 2 * Math.PI); // Adjust circle size slightly to fit within stroke
          ctx.fill();

          ctx.fillStyle = "#fff";
          ctx.font = "bold 16px Archivo";
          ctx.textAlign = "center";
          ctx.fillText(dept.id, x, y + 15); // Draw rank number inside the circle
        };

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
        ctx.fillText(`${dept.count} artworks`, x, y + 50);
      });
    },
  };

  ChartJS.register(customPlugin);

function Chart({ value }) {
  // Ensure data is an array
  const departments = Array.isArray(value) ? value : [];
  console.log(departments);

  // Dynamically reorder data: 1st place in the center, 2nd on the left, and 3rd on the right
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
    labels: reorderedDepartments.map((dept) => dept.name), // Use department names for labels
    datasets: [
      {
        label: "Saves",
        data: reorderedDepartments.map((dept) => dept.count), // Use save counts for data
        backgroundColor: ["#F7F7F7", "#F7F7F7", "#F7F7F7"], // Bar colors
        borderRadius: 20,
        barThickness: 110,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false, // Disable default tooltips
      },
    },
    scales: {
      x: {
        // https://stackoverflow.com/questions/55624343/how-to-remove-the-chart-js-x-axis-bottom-line
        border: { display: false },
        grid: { display: false }, // Remove x-axis gridlines
        ticks: { display: false }, // Remove x-axis labels
      },
      y: {
        // https://stackoverflow.com/questions/55624343/how-to-remove-the-chart-js-x-axis-bottom-line
        border: { display: false },
        grid: { display: false }, // Remove y-axis gridlines
        ticks: { display: false }, // Remove y-axis labels
      },
    },
    layout: {
      padding: { top: 70 },
    },
  };

  return (
    <div className="chart_component">
      {/* https://stackoverflow.com/questions/59325426/how-to-resize-chart-js-element-in-react-js */}
      <Bar height={"100%"} data={data} options={options} plugins={[customPlugin]} />
    </div>
  );
}

export default Chart;