import {
    Card,
    CardBody,
    CardHeader,
    Typography,
  } from "@material-tailwind/react";
  import Chart from "react-apexcharts";
  import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
  
  const chartConfig = {
    type: "bar",
    height: 240,
    series: [
      {
        name: "Present",
        data: [30, 35, 30, 32, 50],
      },
      {
        name: "Remote",
        data: [20, 40, 30, 20, 5],
      },
      {
        name: "On Leave",
        data: [0, 4, 3, 3, 5],
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: true,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: true,
      },
      colors: ["#4CAF50", "#2196F3", "#d00000"],
      plotOptions: {
        bar: {
          columnWidth: "60%",
          borderRadius: 2,
        }
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: [
          "Mon",
          "Tues",
          "Wed",
          "Thurs",
          "Fri",
        ],
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: false,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };
  
  const ChartConfig: React.FC = () => {
    return (
      <Card>
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
        >
          <div className="w-max rounded-lg bg-gray-900 text-white">
            
          </div>
          <div>
            <Typography variant="h6" color="blue-gray">
              Attendance
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="px-2 pb-0">
          <Chart {...chartConfig} />
        </CardBody>
      </Card>
    );
  };
  
  export default ChartConfig;
  