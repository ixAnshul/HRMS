import { useEffect, useState } from "react";
import AdminCards from "../common/adminCards";
import { GiCutDiamond } from "react-icons/gi";
import { LuBoxes } from "react-icons/lu";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import ChartConfig from "../common/ChartConfig";
import { Link } from "react-router-dom";
import { getAllEmployees } from "../../services/indexedDBService";
import { getAllTasks } from "../../services/TaskDBService";
import { getAllProjects } from "../../services/projectDBService";
import { BiCalendarExclamation } from "react-icons/bi";
import { getAllLeaves } from "../../services/leaveDBService";

const ManagerDashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [tasksData, setTasksData] = useState<any[]>([]);
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [LeavesData, setLeavesData] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const employee = await getAllEmployees();
        const tasks = await getAllTasks();
        const project = await getAllProjects();
        const leaves = await getAllLeaves();
        leaves.filter((item) => item.status === "pending").map((data)=> setLeavesData(prevData => [...prevData,data]))
        // setLeavesData(leaves)
        setTasksData(tasks);
        setEmployeeData(employee);
        setProjectsData(project);
      } catch (error) {
        console.error("Error fetching data from IndexedDB:", error);
      }
    };

    fetchData();
  }, []);
  const cardData = [
    {
      logo: <LuBoxes size={30} color="orange" />,
      title: "Projects",
      totalNumber: projectsData.length,
      to: "/Projects",
    },
    {
      logo: <BiCalendarExclamation size={30} color="orange" />,
      title: "Leave Applications",
      totalNumber: LeavesData.length,
      to: "/leaveManager",
    },
    {
      logo: <GiCutDiamond size={30} color="orange" />,
      title: "Tasks",
      totalNumber: tasksData.length,
      to: "/TasksTracker",
    },
    {
      logo: <FaUserTie size={30} color="orange" />,
      title: "Employees",
      totalNumber: employeeData.length,
      to: "/employees",
    },
  ];

  return (
    <>
      <div className="text-3xl m-5 font-serif">Welcome Manager!</div>
      <div className="flex justify-center flex-wrap my-5">
        {cardData.map((card) => (
          <Link to={card.to}>
            <AdminCards {...card} key={card.title} />
          </Link>
        ))}
      </div>
      <div>
        <ChartConfig />
      </div>
    </>
  );
};

export default ManagerDashboard;
