import { useState, useEffect } from 'react';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from "chart.js";

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement);

function Chart({ value }) {
  console.log("valuesdf", value);

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (value && value.length > 0) {
      // `value`가 업데이트되었을 때만 `setDepartments` 호출
      setDepartments([
        {
          id: 1,
          name: value[0]?.name,
          artworks: 60,
          count: value[0]?.count,
          image: value[0]?.image || "/img/img1.png",
        },
        {
          id: 2,
          name: value[1]?.name,
          artworks: 40,
          count: value[1]?.count,
          image: value[1]?.image || "/img/img2.png",
        },
        {
          id: 3,
          name: value[2]?.name,
          artworks: 30,
          count: value[2]?.count,
          image: value[2]?.image || "/img/img3.png",
        },
      ]);
    }
  }, [value]); // `value`가 변경될 때마다 실행

  if (departments.length === 0) {
    // 데이터가 로드되지 않았을 때 로딩 메시지
    return <div>Loading...</div>;
  }

  // Reordered data for custom layout
  const reorderedDepartments = [
    departments[1], // Second place (left)
    departments[0], // First place (center)
    departments[2], // Third place (right)
  ];

  const data = {
    labels: reorderedDepartments.map((dept) => dept.name),
    datasets: [
      {
        label: "Artworks",
        data: reorderedDepartments.map((dept) => dept.artworks),
        backgroundColor: ["#F7F7F7", "#F7F7F7", "#F7F7F7"], // Bar colors
        borderRadius: 20, // Rounded bars
        barThickness: 110, // Bar width
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
        border: {
          display: false
        },
        grid: {
          display: false, // Remove x-axis gridlines
        },
        ticks: {
          display: false, // Remove x-axis labels
        },
      },
      y: {
        // https://stackoverflow.com/questions/55624343/how-to-remove-the-chart-js-x-axis-bottom-line
        border: {
          display: false
        },
        grid: {
          display: false, // Remove y-axis gridlines
        },
        ticks: {
          display: false, // Remove y-axis labels
        },
      },
    },
    layout: {
      padding: {
        top: 70,
      },
    },
  };

  // Plugin to draw images and labels
  const customPlugin = {
    id: "customLabels",
    afterDatasetsDraw: (chart) => {
      const { ctx } = chart;
      // const dataset = chart.data.datasets[0];

      chart.getDatasetMeta(0).data.forEach((bar, index) => {
        const { x, y } = bar; // Bar position
        const dept = reorderedDepartments[index]; // Get department data

        // Draw circular image with stroke
        const img = new Image();
        img.src = dept.image;
        img.onload = () => {
          ctx.strokeStyle = "#FF594B"; // Set stroke color
          ctx.lineWidth = 6; // Set stroke width
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

       // 텍스트 줄바꿈 처리
        const wrapText = (text, maxWidth) => {
          const words = text.split(" ");
          let currentLine = words[0];
          let lines = [];

          for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(`${currentLine} ${word}`).width;
            if (width < maxWidth) {
              currentLine += ` ${word}`;
            } else {
              lines.push(currentLine);
              currentLine = word;
            }
          }

          lines.push(currentLine);
          return lines;
        };

        const maxWidthSingleLine = 120; // 한 줄 유지할 최대 너비
        const maxWidthMultiLine = 90; // 줄바꿈 시 최대 너비
        const lineHeight = 12; // 줄 간격

        // 텍스트 줄바꿈 여부 결정
        let textLines = [];
        if (ctx.measureText(dept.name).width <= maxWidthSingleLine) {
          // 한 줄로 표현 가능할 경우
          textLines = [dept.name];
        } else {
          // 줄바꿈 처리
          textLines = wrapText(dept.name, maxWidthMultiLine);
        }

        ctx.fillStyle = "#333";
        ctx.font = "bold 10px Archivo";
        textLines.forEach((line, i) => {
          ctx.fillText(line, x, y + 40 + i * lineHeight); // 한 줄씩 그리기
        });

        ctx.fillStyle = "#666";
        ctx.font = "SemiBold 10px Archivo";
        ctx.fillText(`${dept.count} artworks`, x, y + 45 + textLines.length * lineHeight);
      });
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
