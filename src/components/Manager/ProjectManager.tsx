import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import {
  Button,
  ColorPicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { Card as AntCard } from "antd";
import form from "antd/es/form";
import { GoDotFill } from "react-icons/go";
import { LuBoxes } from "react-icons/lu";
import tinycolor from "tinycolor2";
import { addProject, getAllProjects } from "../../services/projectDBService";

const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});
const getRandomColor = () => {
  return tinycolor.random().toHexString();
};

const projectColor = ["#ff8f00", "#00897b", "#1e88e5", "#d81b60", "#020617"];

const ProjectManager = () => {
  const [projectData, setProjectData] = useState<any[]>([]);
  const [projectGraphData, setProjectGraphData] = useState<any[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [defaultColor, setDefaultColor] = useState<string>(
    getRandomColor().toString()
  );
  const chartConfig = {
    type: "pie",
    width: 200,
    height: 200,
    series: projectGraphData,
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: "DOE",
      },
      dataLabels: {
        enabled: false,
      },
      colors: projectColor, 
      legend: {
        show: false,
      },
    },
  };
  const [form] = Form.useForm();
  const handleOnCancel = () => {
    setIsAddModalVisible(false);
  };
  const handleColorChange = (color) => {
    const hexColor = tinycolor(color).toHexString();
    setDefaultColor(hexColor);
  };
  const handleAddTaskClick = async () => {
    // Additional logic if needed
    form.resetFields();
    const newColor = getRandomColor();
    setDefaultColor(newColor.toString());
    setIsAddModalVisible(true);
  };
  const fetchData = async () => {
    try {
      const getAllProject = await getAllProjects();
      setProjectData(getAllProject);
      getAllProject.map((data) =>
        setProjectGraphData((prevproject) => [...prevproject, data.totalTasks])
      );
      console.log(projectGraphData, "project");
    } catch (error) {
      console.error("Error fetching data from IndexedDB:", error);
    }
  };
  useEffect(() => {
    fetchData();
    console.log(projectData, "datap");
  }, []);
  const addProjects = async (value: any) => {
    try {
      const newProject = {
        createdAt: formattedDate,
        totalTasks: 4,
        pendingTasks: 0,
        completedTasks: 0,
        ...value,
      };
      await addProject(newProject);
      // await addTask(newTask);
      setProjectData((prevData) => [...prevData, newProject]);
      setIsAddModalVisible(false);
      setProjectGraphData((prevproject) => [
        ...prevproject,
        newProject.totalTasks,
      ]);
      // projectData.map((data) => projectGraphData.push(data.totaltask));
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <span className="font-serif text-2xl mx-4 flex items-center">
          <LuBoxes size={20} color="orange" className="mr-2" />
          Projects
        </span>
        <div className="flex m-2">
          <Input
            placeholder="Search Tasks.."
            // onChange={(e) => handleOnSearch(e.target.value)}
          />
        </div>
        <div className="mx-3 flex justify-around">
          <Button
            type="text"
            className="bg-yellow-500 hover:bg-yellow-600 items-center"
            shape="square"
            icon={
              <div className="flex justify-center items-center hover:text-yellow-600">
                <span>Add Project</span>
              </div>
            }
            size="middle"
            style={{
              width: "7rem",
            }}
            onClick={handleAddTaskClick}
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-center">
        <div className="">
          <Card>
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
            >
              <div>
                <Typography variant="h6" color="blue-gray">
                  Projects Report
                </Typography>
              </div>
            </CardHeader>
            <CardBody className="mt-4 px-2">
              <Chart {...chartConfig} />
            </CardBody>
          </Card>
        </div>
        <div className="flex flex-wrap justify-center m-4">
          {projectData.map((project, idx) => (
            <AntCard
            title={
              <div className="flex justify-between">
                <span className="font-serif">{project.name}</span>
              </div>
            }
            className="m-4"
            style={{ width: 300, backgroundColor: projectColor[idx] }}
            hoverable
          >
            <div className="flex flex-col">
              <span className="bg-white w-[6rem]">
                Total Task: {project.totalTasks}
              </span>
              <span>Pending Task: {project.pendingTasks}</span>
              <span>Completed Task: {project.completedTasks}</span>
              <span>Total Member: {project.totalMember}</span>
              <span>Sprint : {project.sprint}</span>
              <span>End Date : {project.duedate}</span>
            </div>
          </AntCard>
          ))}
        </div>
      </div>
      <Modal
        title="Add Project"
        open={isAddModalVisible}
        onCancel={handleOnCancel}
        footer={null}
      >
        <Form form={form} onFinish={addProjects}>
          <Form.Item label="Project Name :" name="name">
            <Input width={"5rem"} maxLength={20} />
          </Form.Item>
          <div className="flex justify-between">
            <Form.Item
              label="Current Sprint :"
              className="w-[10rem]"
              name="sprint"
            >
              <Input type="number" maxLength={1} min={1} max={9} />
            </Form.Item>
            <Form.Item label="Death Line :" name="duedate">
              <Input type="date" />
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Project
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProjectManager;
