/* eslint-disable @typescript-eslint/no-explicit-any */
// Import necessary dependencies and actions
import { useEffect, useState } from "react";
import {
  Input,
  Card,
  Button,
  Modal,
  Spin,
  Form,
  message,
  Radio,
  Select,
  Upload,
  Avatar,
} from "antd";
import {
  getAllEmployees,
  removeEmployeeByKey,
  updateEmployeeByKey,
} from "../../services/indexedDBService";
import createEmployee from "../../hooks/createEmployee";
import profileImage from "../../assets/loginUserProfile.png";
import femaleProfile from "../../assets/femaleprofile.png";
import { FaAddressCard, FaUserEdit, FaUserTie } from "react-icons/fa";
import { encryptPassword } from "../../utils/encryptionUtils";
import { MdDelete } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaUserAstronaut } from "react-icons/fa6";

const CreateEmployee = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  //   const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { addEmployees, loading } = createEmployee();
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [adminProfile, setAdminProfile] = useState("");
  const fetchData = async () => {
    try {
      // const employee = await getEmployeeByEmail(employeeEmail);
      const employee = await getAllEmployees();
      setEmployeeData(employee);
      console.log(employeeData, "employeeData");
    } catch (error) {
      console.error("Error fetching data from IndexedDB:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onChange = (name: string) => {
    // addEmployees(data);
    setSearchQuery(() => {
      return name; // Setting the state to the new value
    });
  };
  const deleteEmployee = (id: string) => {
    removeEmployeeByKey(id);
    setEmployeeData((prevData) => prevData.filter((item) => item.email !== id));
  };
  const handleAddTodo = async (values: any) => {
    try {
      const secretKey = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode("DtSBnF3XvB"),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
      );
      const encriptPass = await encryptPassword(values.password, secretKey);
      const data = {
        username: values.username,
        email: values.email,
        password: encriptPass,
        firstname: values.firstname,
        lastname: values.lastname,
        DOB: values.DOB,
        project: values.project,
        mobile: values.mobile,
        gender: values.gender,
        jobdesc: values.jobdesc,
        skills: values.skills,
        address: values.address,
        team: values.team,
        reportTo: values.report,
        joiningDate: Date(),
        Status: "Avalable",
        key: secretKey,
        photo: adminProfile,
      };
      addEmployees(data);
      console.log(data, "data");
      setIsModalVisible(false);
      setEmployeeData((prevData) => [...prevData, data]);
      message.success("Adding todo Successfull");
    } catch (error) {
      message.error("Error adding todo:");
    }
  };
  const handleEditClick = async (employee: any) => {
    form.setFieldsValue(employee);
    console.log(employee,"eeeeeeeeeeeeeeeeeee")
    setAdminProfile(employee.photo);
    setIsEditModalVisible(true);
  };

  const handleEditTodo = async () => {
    try {
      form.validateFields().then((valuess) => {
        const tempData = {
          ...valuess,
          photo: adminProfile
        }
        console.log(tempData,"temp")
        updateEmployeeByKey(valuess.email, tempData);
        setIsEditModalVisible(false);
        fetchData();
        message.success("Employee updated successfully");
      });
    } catch (error) {
      message.error("Error updating employee");
    }
  };
  const handleChange = (info: any) => {
    if (info.file.status === "done") {
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        const [, imageData] = base64String.split(",");

        console.log(imageData);

        setAdminProfile(imageData);
      };

      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const beforeUpload = (file: File) => {
    // Implement any validation logic for the file
    // For simplicity, we're allowing all file types
    return true;
  };

  const customRequest = ({ file, onSuccess }: any) => {
    // Simulate an asynchronous upload process
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };
  // Display the filtered employees based on the Redux store state
  //   const filteredEmployees = employees.filter((employee) =>
  //     employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  return (
    <>
      <div className="flex justify-between" style={{ padding: "16px" }}>
        <div className="flex justify-center items-center">
          <Input
            status="warning"
            placeholder="Search here.."
            prefix={<FaUserTie size={20} />}
            style={{ width: "20rem" }}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="ml-4">
            <span>Total Employee :</span>
            <span>{employeeData.length}</span>
          </div>
        </div>
        <div className="">
          <Button
            type="text"
            className="bg-yellow-500 hover:bg-yellow-600"
            shape="square"
            icon={
              <div className="flex justify-center items-center hover:text-yellow-600">
                <FaAddressCard size={25} className="mr-2 " />
                <span>Add Employee</span>
              </div>
            }
            size="large"
            onClick={showModal}
            style={{
              width: "10rem",
            }}
          />

          <Modal
            title="Add New Employee"
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Spin spinning={loading}>
              <Form form={form} onFinish={handleAddTodo}>
                <div className="flex flex-row">
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter the email" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the Password",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="font-serif text-base">Firstname</span>
                    <Form.Item
                      className="flex flex-col"
                      rules={[
                        { required: true, message: "Please enter the email" },
                      ]}
                      name="firstname"
                    >
                      <Input
                        size="middle"
                        style={{ width: "100%" }}
                        placeholder="First Name"
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <span className="font-serif text-base">Lastname</span>
                    <Form.Item className="flex flex-col" name="lastname">
                      <Input
                        size="middle"
                        style={{ width: "100%" }}
                        placeholder="Last Name"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <div>
                    <span className="font-serif text-base">Username</span>
                    <Form.Item className="flex flex-col" name="username">
                      <Input
                        required
                        size="middle"
                        style={{ width: "100%" }}
                        placeholder="Username"
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <span className="font-serif text-base">Mobile Number</span>
                    <Form.Item className="flex flex-col" name="mobile">
                      <Input maxLength={10} style={{ width: "100%" }} />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <Form.Item
                    className="flex flex-col"
                    name="gender"
                    label="Gender"
                  >
                    <Radio.Group className="flex flex-row">
                      <Radio value="Male">Male</Radio>
                      <Radio value="Female">Female</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <div>
                    <span className="font-serif text-base">Designation</span>
                    <Form.Item className="flex flex-col" name="jobdesc">
                      <Select style={{ width: "14rem" }}>
                        <Select.Option value="Software Engineering Intern">
                          Software Engineering Intern
                        </Select.Option>
                        <Select.Option value="Frontend Developer">
                          Frontend Developer
                        </Select.Option>
                        <Select.Option value="Backend Developer">
                          Backend Developer
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col">
                    <span className="font-serif text-base">DOB</span>
                    <Form.Item
                      className="flex flex-col"
                      name="DOB"
                      label="Date of Birth"
                    >
                      <Input type="date" />
                    </Form.Item>
                  </div>
                  <div>
                    <span className="font-serif text-base">Address</span>
                    <Form.Item className="flex flex-col" name="address">
                      <Input
                        required
                        size="middle"
                        style={{ width: "100%" }}
                        placeholder="Address"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="font-serif text-base">Project</span>
                    <Form.Item className="flex flex-col" name="project">
                      <Input
                        size="middle"
                        style={{ width: "90%" }}
                        placeholder="Project Name"
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <span className="font-serif text-base">Team</span>
                    <Form.Item className="flex flex-col" name="team">
                      <Input
                        size="middle"
                        style={{ width: "90%" }}
                        placeholder="Team Name"
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <span className="font-serif text-base">Reporting To</span>
                    <Form.Item className="flex flex-col" name="report">
                      <Input size="middle" style={{ width: "90%" }} />
                    </Form.Item>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span className="font-serif text-base">Skills</span>
                  <Form.Item name="skills">
                    <Select
                      mode="tags"
                      style={{ width: "20rem" }}
                      placeholder="Add your skills"
                      tokenSeparators={[","]}
                    />
                  </Form.Item>
                </div>
                <Form.Item
                  label="Profile Photo"
                  name="profilePhoto"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e && e.fileList}
                  rules={[
                    {
                      required: true,
                      message: "Please upload a profile photo",
                    },
                  ]}
                >
                  <Upload
                    beforeUpload={beforeUpload}
                    customRequest={customRequest}
                    onChange={handleChange}
                    showUploadList={false} // Hide the file list
                  >
                    {/* <Avatar
                      size={100}
                      // src={adminProfile.profilePhoto} // Display the uploaded image or placeholder
                      icon={<FaUserAstronaut />}
                    /> */}
                    <div style={{ marginTop: 8 }}>
                      <Button icon={<IoCloudUploadOutline />}>
                        Upload Photo
                      </Button>
                    </div>
                  </Upload>
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add"}
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </Modal>
        </div>
      </div>
      <div className="flex justify-around flex-wrap">
        {employeeData
          .filter((item) =>
            item.firstname.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((item) => (
            <>
              <Card
                key={item.id}
                className="flex flex-col justify-center my-4"
                style={{ width: "15rem" }}
                hoverable
              >
                {item.photo ? (
                  <img
                    className="w-32 h-32 rounded-full mx-auto"
                    src={`data:image/png;base64,${item.photo}`}
                    alt="User Profile"
                    style={{ width: "100px", height: "100px" }}
                  />
                ) : item.gender === "Female" ? (
                  <img
                    src={femaleProfile}
                    width={60}
                    height={60}
                    className="m-auto"
                  />
                ) : (
                  <img
                    src={profileImage}
                    width={60}
                    height={60}
                    className="m-auto"
                  />
                )}

                <div className="text-center">
                  <span>{item.firstname}</span> <span>{item.lastname}</span>
                </div>
                <div className="text-center">
                  <i>{item.jobdesc}</i>
                </div>
                <p>
                  <span className="">Email:</span> {item.email}
                </p>
                <p>Team: {item.team}</p>
                <p>Reporting To: {item.reportTo}</p>
                <div>
                  <div className="flex justify-center items-center mt-2">
                    <Button
                      type="primary"
                      ghost
                      shape="circle"
                      className="flex justify-center items-center m-1 border-none"
                      style={{ width: "20px", height: "20px" }}
                      onClick={() => {
                        handleEditClick(item);
                      }}
                    >
                      <FaUserEdit />
                    </Button>
                    <Button
                      type="text"
                      shape="circle"
                      className="flex justify-center items-center m-1"
                      danger
                      onClick={() => deleteEmployee(item.email)}
                    >
                      <MdDelete style={{ width: "20", height: "20" }} />
                    </Button>
                  </div>
                </div>
              </Card>
              <Modal
                title="Edit Employee"
                open={isEditModalVisible}
                onCancel={() => {
                  setIsEditModalVisible(false);
                }}
                // onOk={handleUpdateOk}
                footer={null}
              >
                <Form
                  form={form}
                  onFinish={() => {
                    handleEditTodo();
                  }}
                >
                  <div className="flex justify-between">
                    <div>
                    <Form.Item
                        className="flex-col hidden "
                        rules={[
                          { required: true, message: "Please enter the email" },
                        ]}
                        name="email"
                      >
                        <Input
                          size="middle"
                          style={{ width: "100%" }}
                          placeholder="First Name"
                          //   defaultValue={editData.firstname}
                        />
                      </Form.Item>
                      <span className="font-serif text-base">Firstname</span>
                      <Form.Item
                        className="flex flex-col"
                        rules={[
                          { required: true, message: "Please enter the email" },
                        ]}
                        name="firstname"
                      >
                        <Input
                          size="middle"
                          style={{ width: "100%" }}
                          placeholder="First Name"
                          //   defaultValue={editData.firstname}
                        />
                      </Form.Item>
                    </div>
                    <div>
                      <span className="font-serif text-base">Lastname</span>
                      <Form.Item className="flex flex-col" name="lastname">
                        <Input
                          size="middle"
                          style={{ width: "100%" }}
                          placeholder="Last Name"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div>
                      <span className="font-serif text-base">Username</span>
                      <Form.Item className="flex flex-col" name="username">
                        <Input
                          required
                          size="middle"
                          style={{ width: "100%" }}
                          placeholder="Username"
                        />
                      </Form.Item>
                    </div>
                    <div>
                      <span className="font-serif text-base">
                        Mobile Number
                      </span>
                      <Form.Item className="flex flex-col" name="mobile">
                        <Input maxLength={10} style={{ width: "100%" }} />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <Form.Item
                      className="flex flex-col"
                      name="gender"
                      label="Gender"
                    >
                      <Radio.Group className="flex flex-row">
                        <Radio value="Male">Male</Radio>
                        <Radio value="Female">Female</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <div>
                      <span className="font-serif text-base">Designation</span>
                      <Form.Item className="flex flex-col" name="jobdesc">
                        <Select style={{ width: "14rem" }}>
                          <Select.Option value="Software Engineering Intern">
                            Software Engineering Intern
                          </Select.Option>
                          <Select.Option value="Frontend Developer">
                            Frontend Developer
                          </Select.Option>
                          <Select.Option value="Backend Developer">
                            Backend Developer
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                      <span className="font-serif text-base">DOB</span>
                      <Form.Item className="flex flex-col" name="DOB">
                        <input type="date" />
                      </Form.Item>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-serif text-base">Address</span>
                      <Form.Item className="flex flex-col" name="address">
                        <Input
                          size="middle"
                          style={{ width: "14rem" }}
                          placeholder="Address"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <span className="font-serif text-base">Project</span>
                      <Form.Item className="flex flex-col" name="project">
                        <Input
                          size="middle"
                          style={{ width: "90%" }}
                          placeholder="Project Name"
                        />
                      </Form.Item>
                    </div>
                    <div>
                      <span className="font-serif text-base">Team</span>
                      <Form.Item className="flex flex-col" name="team">
                        <Input
                          size="middle"
                          style={{ width: "90%" }}
                          placeholder="Team Name"
                        />
                      </Form.Item>
                    </div>
                    <div>
                      <span className="font-serif text-base">Reporting To</span>
                      <Form.Item className="flex flex-col" name="reportTo">
                        <Input size="middle" style={{ width: "90%" }} />
                      </Form.Item>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span className="font-serif text-base">Skills</span>
                    <Form.Item name="skills">
                      <Select
                        mode="tags"
                        style={{ width: "20rem" }}
                        placeholder="Add your skills"
                        tokenSeparators={[","]}
                      />
                    </Form.Item>
                    <Form.Item name="photo">
                    <Upload
                    beforeUpload={beforeUpload}
                    customRequest={customRequest}
                    onChange={handleChange}
                    showUploadList={false} // Hide the file list
                  >
                    <Avatar
                      size={100}
                      src={`data:image/png;base64,${adminProfile}`} // Display the uploaded image or placeholder
                      icon={<FaUserAstronaut />}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Button icon={<IoCloudUploadOutline />}>
                        Upload Photo
                      </Button>
                    </div>
                  </Upload>
                </Form.Item>
                  </div>
                  <Form.Item>
                  <Button htmlType="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update"}
                  </Button>
                </Form.Item>
                </Form>
              </Modal>
            </>
          ))}
      </div>
    </>
  );
};

export default CreateEmployee;
