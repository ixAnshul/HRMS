import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ImageSrc from "../assets/ImageSrc";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Actions/authActions";
import { useSelector } from "react-redux";
import { AuthState } from "../Actions/authTypes";
import { getEmployeeByEmail } from "../hooks/getEmployeeByEmail";
import { Button, Form, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { v4 as uuidv4 } from "uuid";
import {
  addNotification,
  getAllNotifications,
  removeNotificationById,
} from "../services/notificationDBService";
import { GoDot, GoDotFill } from "react-icons/go";
import { CiCircleRemove } from "react-icons/ci";

const navigation = [
  { name: "Dashboard", href: "*", current: false },
  { name: "Team", href: "#", current: false },
  { name: "Tasks", href: "/task", current: false },
  { name: "Calendar", href: "#", current: false },
];
function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar = () => {
  const dispatch = useDispatch();
  const [userProfile, setUserProfile] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [form] = Form.useForm();
  function handleLogout() {
    dispatch(logout());
  }
  const userId = useSelector((state: { auth: AuthState }) => state.auth.id);
  const userRole = useSelector((state: { auth: AuthState }) => state.auth.role);
  const fetchData = async () => {
    try {
      // const employee = await getEmployeeByEmail(employeeEmail);
      const employee = await getEmployeeByEmail(userId);
      setUserProfile(employee.photo);
      const notification = await getAllNotifications();
      setNotifications(notification);
      console.log(notifications, "notify");
    } catch (error) {
      console.error("Error fetching data from IndexedDB:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  function handleAddTodo(values: any) {
    const valueObj = {
      id: uuidv4(),
      ...values,
    };
    addNotification(valueObj);
  }

  function handleNotification() {
    setIsModalVisible(true);
  }
  function handleCancel() {
    setIsModalVisible(false);
  }
  function handleDeleteNotification(id: any) {
    console.log(id);
    removeNotificationById(id);
    fetchData();
  }

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <div className="w-auto">
                    <ImageSrc />
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <BellIcon
                        className="h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-[20rem] origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none flex flex-col">
                      {userRole === "Manager" ? (
                        <Menu.Item>
                          <Button
                            onClick={handleNotification}
                            className="w-[10rem] m-auto"
                          >
                            Send Notifications
                          </Button>
                        </Menu.Item>
                      ) : null}

                      {notifications.map((notify) => (
                        <Menu.Item>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <GoDotFill color="orange" />
                              {notify.notifications}
                            </div>
                            {userRole === "Manager" ? (
                              <CiCircleRemove
                                onClick={() => {
                                  handleDeleteNotification(notify.id);
                                }}
                                color="red"
                                className="cursor-pointer"
                              />
                            ) : null}
                          </div>
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      {userProfile ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={`data:image/png;base64,${userProfile}`}
                          alt="User Profile"
                          style={{ width: "40px", height: "40px" }}
                        />
                      ) : (
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://media.licdn.com/dms/image/C5603AQER0k23XtZB3A/profile-displayphoto-shrink_200_200/0/1651081073248?e=1714608000&v=beta&t=vLnZhQroBzAwagk8InxHNYMnRe2lfAVj_dqgh6mpD1g"
                          alt="Default Profile"
                          style={{ width: "40px", height: "40px" }}
                        />
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/login"
                            onClick={handleLogout}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Sign out
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
          <Modal
            title="Add New Notification"
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form form={form} onFinish={handleAddTodo}>
              <Form.Item
                name="notifications"
                rules={[
                  { required: true, message: "Please enter the Notification" },
                ]}
              >
                <TextArea maxLength={20} />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit">Add</Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </Disclosure>
  );
};
