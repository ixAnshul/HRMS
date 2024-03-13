/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, Select } from "antd";
import React, { useState } from "react";
import userProfile from "../../assets/employeeProfile.png";
import managerProfile from "../../assets/managerIcon.png";
import adminProfile from "../../assets/adminProfile.png";
import hrsmbg from "../../assets/bgimage.png";
import { IoMailOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { LiaEyeSlashSolid, LiaEyeSolid } from "react-icons/lia";
import { useDispatch } from "react-redux";
import { login } from "../../Actions/authActions";
import { decryptPassword, encryptPassword } from "../../utils/encryptionUtils";
import { Link } from "react-router-dom";
import { getEmployeeByKey } from "../../services/indexedDBService";

const Login: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [roles, setRoles] = useState<string>("User");
  const profiles: string[] = [userProfile, managerProfile, adminProfile];

  const handleSelectChange = (selectedValue: string) => {
    const selectedOption = options.find(
      (option) => option.value === selectedValue
    );
    if (selectedOption) {
      setRoles(selectedValue);
      setCount(selectedOption.count);
    }
  };

  const options = [
    { value: "User", label: "User", count: 0 },
    { value: "Manager", label: "Manager", count: 1 },
  ];
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    const secretKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode("DtSBnF3XvB"),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
    console.log(values);
    const encriptPass = await encryptPassword("Anshul", secretKey);

    const users = [
      { username: 'Anshul', password: encriptPass, role: "Manager" },
    ];

    localStorage.setItem('users', JSON.stringify(users));
    if(values.userRole === "Manager"){
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const user = storedUsers.find(
      (u: any) => u.username === values.username && u.role === roles
    );
    let decryptedPassword = "";

    if (user?.password) {
      decryptedPassword = await decryptPassword(user.password, secretKey);
    }

    if (user && decryptedPassword === values.Password) {
      console.log("Login successful!");
      setError(null);
      dispatch(login(user.role,user.username));
    } else {
      console.log("Login failed!");
      setError("Invalid username or password");
    }
    }else{
      const employee = await getEmployeeByKey(values.username);
      console.log(employee.password,"gfn")
      let decryptedPassword = "";
      if (employee?.password) {
        decryptedPassword = await decryptPassword(employee.password, secretKey);
      }
      console.log(decryptedPassword,"pass")

      if (employee && decryptedPassword === values.Password) {
        console.log("Login successful!");
        setError(null);
        dispatch(login("User",employee.email));
      } else {
        console.log("Login failed!");
        setError("Invalid username or password");
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <div
        style={{
          backgroundColor: "#71b3b1",
          width: "100%",
          height: "100vh",
        }}
      ></div>
      <div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-3xl flex flex-wrap "
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px",
          background:
            "radial-gradient(circle, rgba(255,242,220,1) 0%, rgba(254,234,199,1) 100%)",
        }}
      >
        <div
          className="flex flex-row justify-center items-center "
          style={{ height: "80vh" }}
        >
          <div className="w-full flex flex-col" style={{ width: "30rem" }}>
            <div className="flex flex-col justify-center m-4">
              <h1 className="font-serif text-4xl text-center text-orange-400">
                HRMS
              </h1>
              <div className="flex justify-center m-4">
                <img
                  src={profiles[count]}
                  alt="User"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <div className="mx-8 flex justify-center">
              <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <div style={{ width: "25rem" }}>
                  <div className="flex flex-row justify-between items-center h-9 mb-4">
                    <div className="flex flex-col font ">
                      <span className="flex font-mono font-medium text-2xl">
                        Sign In
                      </span>
                      <u
                        className="h-1 bg-yellow-400"
                        style={{ width: "5.8rem" }}
                      ></u>
                    </div>
                    <div className="flex flex-row">
                      <span className="m-1 text-gray-600 opacity-50">
                        Login As :
                      </span>
                      <Form.Item name="userRole">
                        <Select
                          defaultValue="User"
                          style={{ width: 100 }}
                          onChange={handleSelectChange}
                          options={options}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div
                    className="flex flex-row h-8 mb-7 mt-9 shadow-lg rounded-3xl m-auto bg-white"
                    style={{ width: "16rem" }}
                  >
                    <div className="h-8 w-10 bg-gradient-to-r from-orange-500 to-yellow-500 flex justify-center rounded-s-full rounded-br-full">
                      <IoMailOutline className="mt-1" size={23} color="white" />
                    </div>
                    <Form.Item
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Username!",
                        },
                      ]}
                    >
                      <Input
                        variant="borderless"
                        className="border-none rounded-s-none "
                        placeholder="Username"
                        style={{ width: "13rem" }}
                      />
                    </Form.Item>
                  </div>
                  <div
                    className="flex flex-row h-8 mb-4 shadow-lg rounded-3xl m-auto bg-white"
                    style={{ width: "16rem" }}
                  >
                    <div className="h-8 w-10 bg-gradient-to-r from-orange-500 to-yellow-500 flex justify-center rounded-s-full rounded-br-full">
                      <CiLock className="mt-1" size={23} color="white" />
                    </div>
                    <Form.Item
                      name="Password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Password",
                        },
                      ]}
                    >
                      <Input.Password
                        variant="borderless"
                        className="border-none rounded-s-none rounded-e-full"
                        placeholder="Password"
                        iconRender={(visible) =>
                          visible ? <LiaEyeSolid /> : <LiaEyeSlashSolid />
                        }
                        style={{ width: "13rem" }}
                      />
                    </Form.Item>
                  </div>
                  {error && <div style={{ color: "red" }}>{error}</div>}
                  <Form.Item className="flex justify-center mt-8">
                    <Button
                      htmlType="submit"
                      shape="round"
                      className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white "
                      size="large"
                    >
                      Sign In
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
          <div
            className="w-full h-full rounded-e-3xl justify-center items-center hidden md:flex"
            style={{ width: "30rem" }}
          >
            <div>
              <img src={hrsmbg} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
