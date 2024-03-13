import React, { useEffect, useState } from "react";
import {
  Button,
  Collapse,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  SelectProps,
} from "antd";
import { GiCutDiamond } from "react-icons/gi";
import { GoDotFill } from "react-icons/go";
import { addTask, getAllTasks } from "../../services/TaskDBService";
import { getAllEmployees } from "../../services/indexedDBService";
import { v4 as uuidv4 } from "uuid";

const options: SelectProps["options"] = [];
// const data = [
//   {
//     key: "1",
//     title: "Task1",
//     status: "Unassign",
//     project: "DOE",
//     priority: "low",
//     desc: "qwer",
//   },
//   {
//     key: "2",
//     title: "Task2",
//     status: "Inprogress",
//     project: "DOE",
//     priority: "low",
//     desc: "sdfg",
//   },
//   {
//     key: "3",
//     title: "Task3",
//     status: "Completed",
//     project: "MOIE",
//     priority: "low",
//     desc: "qwsdfer",
//   },
//   {
//     key: "4",
//     title: "Task4",
//     status: "Unassign",
//     project: "MOIE",
//     priority: "low",
//     desc: "qwweterter",
//   },
// ];
const TaskTracker = () => {
  const [project, setProject] = useState("All");
  const [status, setStatus] = useState("All");
  const [searchTask, setSearchTask] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [taskData, setTaskData] = useState({});
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [tasksData, setTasksData] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getTask = await getAllTasks();
        setTasksData(getTask);
        console.log(getTask, "task");
        const employee = await getAllEmployees();
        console.log(employee, "empl");
        setEmployeeData(employee);
        employee.map((ename) => {
          options.push({
            value: ename.email.toString(),
            label: ename.firstname.toString(),
          });
        });
      } catch (error) {
        console.error("Error fetching data from IndexedDB:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddTaskClick = async () => {
    // Additional logic if needed
    form.resetFields();
    setIsEditModalVisible(true);
  };

  const handleOnCancel = () => {
    setIsEditModalVisible(false);
    setSelectedEmployee(null);
  };
  const getColorBasedOnStatus = (status: string) => {
    switch (status) {
      case "Todo":
        return "red";
      case "Inprogress":
        return "#71b3b1";
      case "Completed":
        return "blue";
      default:
        return "black"; // or any default color
    }
  };
  const genExtra = () => (
    <div className="flex">
      <Button size="small" className="mx-1">
        Edit
      </Button>
      <Button size="small">Delete</Button>
    </div>
  );

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const projectData = ["MOIE", "DOE"];
  const items = tasksData
    .filter(
      (task) =>
        (task.project === project || project === "All") &&
        (task.status === status || status === "All") &&
        task.title.toLowerCase().includes(searchTask.toLowerCase())
    )
    .map((task) => ({
      key: task.key,
      label: (
        <div className="flex flex-row items-center">
          <div className="flex flex-row items-center">
            <GoDotFill color={getColorBasedOnStatus(task.status)} />
            <span className="w-[8rem]">{task.title}</span>
          </div>
          <div className="w-full text-center">
            <span>Project: {task.project}</span>
          </div>
        </div>
      ),
      children: (
        <div className="flex flex-col">
          <div className="flex">
            Status:
            <Select
              defaultValue={task.status}
              className=""
              size="small"
              onChange={(e) => handleStatusClick(e)}
            >
              <Select.Option value="All">
                <div className="flex flex-row items-center">
                  <GoDotFill color="grey" />
                  All
                </div>
              </Select.Option>
              <Select.Option value="Todo">
                <div className="flex flex-row items-center">
                  <GoDotFill color="red" />
                  Todo
                </div>
              </Select.Option>
              <Select.Option value="Inprogress">
                <div className="flex flex-row items-center">
                  <GoDotFill color="#71b3b1" />
                  Inprogress
                </div>
              </Select.Option>
              <Select.Option value="Completed">
                <div className="flex flex-row items-center">
                  <GoDotFill color="blue" />
                  Completed
                </div>
              </Select.Option>
            </Select>
          </div>
          <span>To: {task.assignto}</span>
          <span>Assign Date: {task.assigndate}</span>
          <span>Due Date: {task.duedate}</span>
          <span>Priority: {task.priority}</span>
          <span>Description: {task.desc}</span>
        </div>
      ),
      extra: genExtra(),
    }));

  //   const taskData = {
  //     title: "demo",
  //     comments: "asdf",
  //     employee: "asdf",
  //     assignDate: Date(),
  //     dueDate: Date().toString,
  //   };

  const handleProjectClick = (project: string) => {
    setProject(project);
  };
  const handleStatusClick = (status: string) => {
    setStatus(status);
  };
  const handleOnSearch = (search: string) => {
    console.log(search);
    setSearchTask(search);
  };
  const showdata = async (value: any) => {
    try {
      const newTask = {
        id: uuidv4(),
        assigndate: formattedDate,
        ...value,
      };
      await addTask(newTask);
      setTasksData((prevData) => [...prevData, newTask]);
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  const handleTaskData = (fieldName: string, fieldValue: any) => {
    setTaskData((prevTaskData) => ({
      ...prevTaskData,
      [fieldName]: fieldValue,
    }));
    console.log(taskData);
  };

  return (
    <>
      <div className="flex justify-between flex-wrap items-center my-4 ">
        <span className="font-serif text-2xl mx-4 ">Task Tracker</span>
        <div className="flex m-2">
          <Input
            placeholder="Search Tasks.."
            onChange={(e) => handleOnSearch(e.target.value)}
          />
          <Select
            style={{ width: "8rem" }}
            defaultValue={"All"}
            className=""
            onChange={(e) => handleProjectClick(e)}
          >
            <Select.Option value="All">
              <div className="flex flex-row items-center">All</div>
            </Select.Option>
            {projectData.map((item) => (
              <Select.Option value={item}>
                <div className="flex flex-row items-center">{item}</div>
              </Select.Option>
            ))}
          </Select>
          <Select
            defaultValue={"All"}
            className=""
            onChange={(e) => handleStatusClick(e)}
          >
            <Select.Option value="All">
              <div className="flex flex-row items-center">
                <GoDotFill color="grey" />
                All
              </div>
            </Select.Option>
            <Select.Option value="Todo">
              <div className="flex flex-row items-center">
                <GoDotFill color="red" />
                Todo
              </div>
            </Select.Option>
            <Select.Option value="Inprogress">
              <div className="flex flex-row items-center">
                <GoDotFill color="#71b3b1" />
                Inprogress
              </div>
            </Select.Option>
            <Select.Option value="Completed">
              <div className="flex flex-row items-center">
                <GoDotFill color="blue" />
                Completed
              </div>
            </Select.Option>
          </Select>
        </div>
        <div className="mx-3 flex justify-around">
          <Button
            type="text"
            className="bg-yellow-500 hover:bg-yellow-600 items-center"
            shape="square"
            icon={
              <div className="flex justify-center items-center hover:text-yellow-600">
                <GiCutDiamond size={20} className="mr-2 " />
                <span>Add Task</span>
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
      <div className="m-auto p-4">
        <Collapse expandIconPosition={"end"} items={items} />
      </div>
      <Modal
        title="Add task"
        open={isEditModalVisible}
        onCancel={handleOnCancel}
        footer={null}
      >
        <Form form={form} onFinish={showdata}>
          <Form.Item
            name="title"
            rules={[
              { required: true, message: "Please enter the task title!" },
            ]}
          >
            <Input maxLength={30} placeholder="Task Title" />
          </Form.Item>
          <Form.Item
            name="desc"
            rules={[
              { required: true, message: "Please enter the description!" },
            ]}
          >
            <Input maxLength={100} placeholder="Description" />
          </Form.Item>
          <div className="flex flex-row justify-between">
            <Form.Item
              name="project"
              label="Project"
              rules={[{ required: true, message: "Please Select project" }]}
            >
              <Select style={{ width: "8rem" }} className="">
                {projectData.map((item) => (
                  <Select.Option value={item}>
                    <div className="flex flex-row items-center">{item}</div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="status" initialValue="Todo" label="Status">
              <Select style={{ width: "8rem" }}>
                <Select.Option value="Todo">
                  <div className="flex flex-row items-center">
                    <GoDotFill color="red" />
                    Todo
                  </div>
                </Select.Option>
                <Select.Option value="Inprogress">
                  <div className="flex flex-row items-center">
                    <GoDotFill color="#71b3b1" />
                    Inprogress
                  </div>
                </Select.Option>
                <Select.Option value="Completed">
                  <div className="flex flex-row items-center">
                    <GoDotFill color="blue" />
                    Completed
                  </div>
                </Select.Option>
              </Select>
            </Form.Item>
          </div>
          <div className="flex flex-row justify-between">
            <Form.Item name="priority" label="Priority">
              <Select defaultValue="Medium" style={{ width: "8rem" }}>
                <Select.Option value="High">High</Select.Option>
                <Select.Option value="Medium">Medium</Select.Option>
                <Select.Option value="Low">Low</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="storyPoint"
              label="Story Point"
              rules={[{ required: true, message: "Please assign Story Point" }]}
            >
              <InputNumber min={1} max={10} maxLength={2} />
            </Form.Item>
          </div>
          <div className="flex justify-between">
            <Form.Item
              name="assignto"
              label="Assign TO"
              rules={[{ required: true, message: "Please Select" }]}
            >
              <Select
                showSearch
                style={{ width: 150 }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={options}
              />
            </Form.Item>
            <Form.Item
              name="duedate"
              label="Due Date"
              rules={[{ required: true, message: "Please Select Due Date" }]}
            >
              <Input type="date" />
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="text" className="bg-orange-300 hover:border-orange-300" htmlType="submit">
              Add Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TaskTracker;
