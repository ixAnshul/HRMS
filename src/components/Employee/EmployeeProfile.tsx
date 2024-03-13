import React, { FC, useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Radio, Select } from "antd";
import moment, { Moment } from "moment";
import { addEmployee } from "../../Actions/employeeActions";
import store from "../../store";
import { getEmployeeByEmail } from "../../hooks/getEmployeeByEmail";
import { openDB, updateEmployeeByKey } from "../../services/indexedDBService";
import Employee from "../../types/Employee";
import { useSelector } from "react-redux";
import { AuthState } from "../../Actions/authTypes";
import ReactApexChart from "react-apexcharts";
import TaskGraph from "../common/taskGraph";
import { getAllTasks } from "../../services/TaskDBService";

const defaultSkills = ["JavaScript", "React", "CSS"];
const awards = ["Employee of the Month", "Star Employee"];
interface IndexedDBInsertProps {
  db: IDBDatabase;
}

const EmployeeProfile: FC<IndexedDBInsertProps> = ({ db }) => {
  const [editUsername, setEditUsername] = useState<string>("");
  const [editProfilePhoto, setEditProfilePhoto] = useState<string>("");
  const [editEmail, setEditEmail] = useState<string>("");
  const [editFirstname, setEditFirstname] = useState<string>("");
  const [editLastname, setEditLastname] = useState<string>("");
  const [editDOB, setEditDOB] = useState("");
  const [editMobile, setEditMobile] = useState<number>();
  const [editGender, setEditGender] = useState<string>("");
  const [project, setProject] = useState<string>("");
  const [editAddress, setEditAddress] = useState<string>("");
  const [editJobDescription, setEditJobDescription] = useState<string>("");
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const userId = useSelector((state: { auth: AuthState }) => state.auth.id);
  const userRole = useSelector((state: { auth: AuthState }) => state.auth.role);
  const [todoData, setTodoData] = useState<number>(0);
  const [inprogressData, setInprogressData] = useState<number>(0);
  const [completedData, setCompletedData] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userRole && userRole !== "Manager") {
          const employee = await getEmployeeByEmail(userId);
          console.log(employee);
          if (employee) {
            setEditUsername(employee.username);
            setEditEmail(employee.email);
            setEditFirstname(employee.firstname);
            setEditLastname(employee.lastname);
            setEditDOB(employee.DOB);
            setEditMobile(employee.mobile);
            setEditGender(employee.gender);
            setEditJobDescription(employee.jobdesc);
            setEditSkills(employee.skills);
            setEditProfilePhoto(employee.photo);
            setEditAddress(employee.address);
            setProject(employee.project);
          }
          const taskData = (await getAllTasks()).filter(
            (task) => task.assignto === userId
          );
          taskData.map((data)=> {
              if(data.status === "Inprogress"){
                setInprogressData(prevData => prevData+1);
              }else if(data.status === "Completed"){
                setCompletedData(prevData => prevData+1);
              }else{
                setTodoData(prevData => prevData+1);
              }
          })
        }
      } catch (error) {
        console.error("Error fetching data from IndexedDB:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: string, value: string | null) => {
    if (field === "DOB" && value) {
      // Handle date field separately
      setEditDOB(value);
    } else {
      // Handle other fields
      switch (field) {
        case "username":
          setEditUsername(value as string);
          break;
        case "email":
          setEditEmail(value as string);
          break;
        case "firstname":
          setEditFirstname(value as string);
          break;
        case "lastname":
          setEditLastname(value as string);
          break;
        case "mobile":
          setEditMobile(value as number);
          break;
        case "gender":
          setEditGender(value as string);
          break;
        case "skills":
          setEditSkills(value as string[]);
          break;
        case "address":
          setEditAddress(value as string[]);
          break;
        default:
          break;
      }
    }
  };

  const handleInsert = async () => {
    const data = {
      username: editUsername,
      email: editEmail,
      firstname: editFirstname,
      lastname: editLastname,
      DOB: editDOB,
      mobile: editMobile,
      gender: editGender,
      jobdesc: editJobDescription,
      skills: editSkills,
      address: editAddress,
    };
    const partialEmployee: Partial<Employee> = data;
    await updateEmployeeByKey(userId, partialEmployee);
  };

  return (
    <div className="flex justify-center mt-2 flex-wrap-reverse">
      <div
        className="rounded overflow-hidden shadow-lg m-7 p-2"
        style={{ width: "50rem" }}
      >
        <div className="flex justify-between">
          <span className="text-xl font-semibold">My Profile</span>
          <Button onClick={handleInsert}>Save</Button>
        </div>

        <div>
          <div>
            <span className="text-xs text-zinc-500">USER INFORMATION</span>
          </div>

          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            className="m-4"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                maxWidth: "50rem",
              }}
            >
              <Form.Item className="flex flex-col">
                <span className="font-serif text-base">Username</span>
                <Input
                  disabled
                  size="middle"
                  style={{ width: "15rem" }}
                  placeholder="Username"
                  value={editUsername}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item className="flex flex-col">
                <span className="font-serif text-base">Email</span>
                <Input
                  disabled
                  size="middle"
                  style={{ width: "15rem" }}
                  placeholder="you@email.com"
                  value={editEmail}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </Form.Item>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                maxWidth: "50rem",
              }}
            >
              <Form.Item className="flex flex-col">
                <span className="font-serif text-base">Firstname</span>
                <Input
                  size="middle"
                  style={{ width: "15rem" }}
                  placeholder="First Name"
                  value={editFirstname}
                  onChange={(e) =>
                    handleInputChange("firstname", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item className="flex flex-col">
                <span className="font-serif text-base">Lastname</span>
                <Input
                  size="middle"
                  style={{ width: "15rem" }}
                  placeholder="Last Name"
                  value={editLastname}
                  onChange={(e) =>
                    handleInputChange("lastname", e.target.value)
                  }
                />
              </Form.Item>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                maxWidth: "50rem",
              }}
            >
              <Form.Item className="flex flex-col">
                <span className="font-serif text-base">Date of Birth</span>
                <Input
                  value={editDOB}
                  type="date"
                  onChange={(date) => handleInputChange("DOB", date)}
                />
              </Form.Item>
              <Form.Item className="flex flex-col">
                <span className="font-serif text-base">Gender</span>
                <Radio.Group
                  value={editGender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="flex flex-row"
                >
                  <Radio value="Male">Male</Radio>
                  <Radio value="Female">Female</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                maxWidth: "50rem",
              }}
            >
              <Form.Item className="flex flex-col">
                <span className="font-serif text-base">Address</span>
                <Input
                  size="middle"
                  style={{ width: "15rem" }}
                  placeholder="Address"
                  value={editAddress}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </Form.Item>
              <Form.Item className="flex flex-col">
                <span className="font-serif text-base">Mobile Number</span>
                <Input
                  maxLength={10}
                  style={{ width: "9.5rem" }}
                  value={editMobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                />
              </Form.Item>
            </div>
            {/* <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                maxWidth: "50rem",
              }}
            >
              <div className="flex flex-row border-2 h-9">
                <span className="border-2">DOB</span>
                <Form.Item wrapperCol={{ span: 16 }}>
                  <DatePicker
                    defaultValue={editDOB}
                    onChange={(date) => setEditDOB(date)}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label="Mobile No."
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input
                  maxLength={10}
                  style={{ width: "9.5rem" }}
                  defaultValue={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                />
              </Form.Item>
            </div> */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                maxWidth: "50rem",
              }}
            >
              <Form.Item name="skills">
                <span className="font-serif text-base">Skills</span>
                <Select
                  mode="tags"
                  style={{ width: "20rem" }}
                  placeholder="Add your skills"
                  tokenSeparators={[","]}
                  value={editSkills}
                  onChange={(value) => setEditSkills(value.map(String))}
                />
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
      <div className="rounded overflow-hidden shadow-lg m-7 p-2">
        <div className="photo-wrapper p-2">
          {editProfilePhoto ? (
            <img
              className="w-32 h-32 rounded-full mx-auto"
              src={`data:image/png;base64,${editProfilePhoto}`}
              alt="User Profile"
              style={{ width: "150px", height: "150px" }}
            />
          ) : (
            <img
              className="w-32 h-32 rounded-full mx-auto"
              src="https://media.licdn.com/dms/image/C5603AQER0k23XtZB3A/profile-displayphoto-shrink_200_200/0/1651081073248?e=1714608000&v=beta&t=vLnZhQroBzAwagk8InxHNYMnRe2lfAVj_dqgh6mpD1g"
              alt="Default Profile"
              style={{ width: "40px", height: "40px" }}
            />
          )}
        </div>
        <div>
          <h3
            className="text-center text-xl text-gray-900 font-medium leading-8 m-auto"
            style={{ width: "15rem" }}
          >
            {[editFirstname, " ", editLastname]}
          </h3>
          <div className="text-center text-gray-400 text-xs font-semibold">
            <p>{editJobDescription}</p>
          </div>
          <table className="text-xs" style={{ width: "15rem" }}>
            <tbody>
              <tr>
                <td className="px-2 py-2 text-gray-500 font-semibold">Team</td>
                <td className="px-2 py-2">{project}</td>
              </tr>
              <tr>
                <td className="px-2 py-2 text-gray-500 font-semibold">
                  Address
                </td>
                <td className="px-2 py-2" style={{ width: "12rem" }}>
                  {editAddress}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-2 text-gray-500 font-semibold">Phone</td>
                <td className="px-2 py-2">{editMobile}</td>
              </tr>
              <tr>
                <td className="px-2 py-2 text-gray-500 font-semibold">Email</td>
                <td className="px-2 py-2">{editEmail}</td>
              </tr>
            </tbody>
          </table>
          <div>
            <span>Task Report:</span>

            <TaskGraph todo={todoData} inprogress={inprogressData} completed={completedData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
