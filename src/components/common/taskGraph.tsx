import React from "react";
import ReactApexChart from "react-apexcharts";

interface ChartProps {
  todo: number,
  inprogress: number,
  completed: number,
}

const TaskGraph: React.FC<ChartProps> = ({ todo,inprogress, completed}) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      height: '50%',
    },
    labels:["Todo","Inprogess","Completed"],
    plotOptions: {
      pie: {
        donut: {
          size: "55%",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              fontSize: "15px",
              fontFamily: "mono",
              fontWeight: 600,
              color: "#333",
            },
          },
        },
      },
    },
    colors:[ '#fe8f7c', '#00c1cc', '#2ec4b6'],
    legend: {
      position: "right",
      horizontalAlign: "center",
    },
    responsive: [
      {
        breakpoint: 380,
        options: {
          chart: {
            width: 200,
            height: 150,
          },
          legend: {
            position: "right",
            horizontalAlign: "center",
          },
        },
      },
    ],
  };

  const series: number[] = [todo,inprogress,completed];

  return <ReactApexChart options={options} series={series} type="donut" />;
};

export default TaskGraph;