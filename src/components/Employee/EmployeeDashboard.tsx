import React, { ReactNode, useEffect, useState } from "react";
import WeatherCard from "../common/weatherCard";
import { useSelector } from "react-redux";
import { AuthState } from "../../Actions/authTypes";
import { getEmployeeByEmail } from "../../hooks/getEmployeeByEmail";
import { IoSunnyOutline } from "react-icons/io5";

const getGreeting = (): ReactNode => {
  const currentHour = new Date().getHours();
  if (currentHour >= 5 && currentHour < 12) {
    return <div className="flex flex-row mr-2 items-center"><IoSunnyOutline color="orange"/>Good Morning</div>;
  } else if (currentHour >= 12 && currentHour < 18) {
    return <div>Good Afternoon</div>;
  } else {
    return "Good Evening";
  }
};

const EmployeeDashboard: React.FC = () => {

  const [employeeData , setEmployeeData] = useState({});
  const greeting = getGreeting();
  const userId = useSelector((state: { auth: AuthState }) => state.auth.id);

  const fetchData = async () => {
    try {
      const employee = await getEmployeeByEmail(userId);
      setEmployeeData(employee);
      console.log(employee)
    } catch (error) {
      console.error("Error fetching data from IndexedDB:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="border-2">
        <div className="m-2">
          <span className="flex font-serif text-3xl">{greeting} {employeeData.firstname} {employeeData.lastname}</span>
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
