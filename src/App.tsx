import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import EmployeeProfile from "./components/Employee/EmployeeProfile";
import { Navbar } from './components/Navbar';
import "./index.css";
// import EmployeeDashboard from './components/Employee/EmployeeDashboard';
import TaskManager from "./components/common/TaskManager";
import Login from "./components/login/Login";
import { useSelector } from "react-redux";
import { AuthState } from "./Actions/authTypes";
import { openDB } from "./services/indexedDBService";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ManagerDashboard from "./components/Manager/ManagerDashboard";
import CreateEmployee from "./components/Manager/CreateEmployee";
import TaskTracker from "./components/Manager/TaskTracker";
import AllCalendar from "./components/common/AllCalendar";
import LeaveApplication from "./components/common/LeaveApplication";
import ProjectManager from "./components/Manager/ProjectManager";
import LeaveManager from "./components/Manager/leaveManager";
import EmployeeDashboard from "./components/Employee/EmployeeDashboard";

const App: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: { auth: AuthState }) => state.auth.isAuthenticated
  );
  const userRole = useSelector(
    (state: { auth: AuthState }) => state.auth.role
  );
  console.log(userRole)
  const [db, setDb] = useState<IDBDatabase>(null!);

  useEffect(() => {
    const initializeDB = async () => {
      const database = await openDB();
      setDb(database);
    };

    initializeDB();
  }, []);
  return (
    <>
      {/* <Navbar /> */}
      {/* <EmployeeDashboard /> */}{" "}
      {isAuthenticated ? (
        <div>
          <Navbar />
          {/* <AdminDashboard/> */}
          {/* <ManagerDashboard/> */}
          {userRole=="User"?(
            <Routes>
            <Route path="/">
              <Route path="*" element={< EmployeeDashboard/>} />
              <Route path="/task" element={<TaskManager />} />
              <Route path="/employees" element={<CreateEmployee />} />
              <Route path="/TasksTracker" element={<TaskTracker />} />
              <Route path="/Projects" element={<ProjectManager />} />
              <Route path="/Calender" element={<AllCalendar />} />
              <Route path="/LeaveTracker" element={<LeaveApplication />} />
              <Route path="/LeaveManager" element={<LeaveManager />} />
              <Route path="/profile" element={<EmployeeProfile db={db} />} />
              
            </Route>
          </Routes>
          ):(
            <Routes>
            <Route path="/">
              <Route path="*" element={< ManagerDashboard/>} />
              <Route path="/task" element={<TaskManager />} />
              <Route path="/employees" element={<CreateEmployee />} />
              <Route path="/TasksTracker" element={<TaskTracker />} />
              <Route path="/Projects" element={<ProjectManager />} />
              <Route path="/Calender" element={<AllCalendar />} />
              <Route path="/LeaveTracker" element={<LeaveApplication />} />
              <Route path="/LeaveManager" element={<LeaveManager />} />
              <Route path="/profile" element={<EmployeeProfile db={db} />} />
              
            </Route>
          </Routes>
          )}
          
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default App;
