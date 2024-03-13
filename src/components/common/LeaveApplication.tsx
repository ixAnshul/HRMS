/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button, Card, Form, Input, Modal, Select, message } from "antd";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BsCalendarCheck } from "react-icons/bs";
import {
  FaCalendarDay,
  FaCalendarDays,
  FaCalendarWeek,
  FaRegCalendarDays,
} from "react-icons/fa6";
import { FaUserDoctor } from "react-icons/fa6";
import { BiCalendarExclamation } from "react-icons/bi";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import { addLeave } from "../../services/leaveDBService";
import { v4 as uuidv4 } from "uuid";

interface CardData {
  title: string;
  image: React.ReactNode;
  available: number;
  booked: number;
}

const leaveTypes = [
  "Casual Leave",
  "Earned Leave",
  "Leave Without Pay",
  "Marriage Leave",
  "Optional Holiday",
  "Sick Leave",
];

const LeaveApplication = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [leaveDate, setLeaveDate] = useState("");
  const [form] = Form.useForm();
  const cards: CardData[] = [
    {
      title: "Casual Leave",
      image: (
        <FaCalendarDays
          style={{
            width: "60px",
            height: "60px",
            margin: "auto",
            marginTop: "2rem",
            color: "#3DD6D0",
          }}
        />
      ),
      available: 5,
      booked: 2,
    },
    {
      title: "Earned Leave",
      image: (
        <BsCalendarCheck
          style={{
            width: "60px",
            height: "60px",
            margin: "auto",
            marginTop: "2rem",
            color: "#3DD6D0",
          }}
        />
      ),
      available: 8,
      booked: 1,
    },
    {
      title: "Leave Without Pay",
      image: (
        <FaCalendarDay
          style={{
            width: "60px",
            height: "60px",
            margin: "auto",
            marginTop: "2rem",
            color: "#3DD6D0",
          }}
        />
      ),
      available: 10,
      booked: 0,
    },
    {
      title: "Marriage Leave",
      image: (
        <FaCalendarWeek
          style={{
            width: "60px",
            height: "60px",
            margin: "auto",
            marginTop: "2rem",
            color: "#3DD6D0",
          }}
        />
      ),
      available: 3,
      booked: 1,
    },
    {
      title: "Optional Holiday",
      image: (
        <FaRegCalendarDays
          style={{
            width: "60px",
            height: "60px",
            margin: "auto",
            marginTop: "2rem",
            color: "#3DD6D0",
          }}
        />
      ),
      available: 7,
      booked: 3,
    },
    {
      title: "Sick Leave",
      image: (
        <FaUserDoctor
          style={{
            width: "60px",
            height: "60px",
            margin: "auto",
            marginTop: "2rem",
            color: "#3DD6D0",
          }}
        />
      ),
      available: 12,
      booked: 5,
    },
  ];

  function handleAddTaskClick() {
    form.resetFields();
    setIsAddModalVisible(true);
  }

  function handleOnCancel() {
    setIsAddModalVisible(false);
  }

  function handleCardClick(leaveTypes: string): void {
    form.resetFields();
    const leaveOBJ = { leaveType: leaveTypes };
    form.setFieldsValue(leaveOBJ);
    // setLeaveType(leaveTypes);
    setIsAddModalVisible(true);
  }
  const currentDate = moment().format("YYYY-MM-DD");

  const validateStartDate = ( value: any, callback: any) => {
    const selectedDate = moment(value, "YYYY-MM-DD");
    const isValidDate =
      selectedDate.isValid() && selectedDate.isSameOrAfter(currentDate);

    if (!isValidDate) {
      callback(
        "Please select a valid start date that is on or after the current date."
      );
    } else {
      callback();
    }
  };

  const validateEndDate = (value: any, callback: any) => {
    const formValues = form.getFieldsValue();
    const startDate = moment(formValues.start, "YYYY-MM-DD");
    const endDate = moment(value, "YYYY-MM-DD");
    const isValidDate = endDate.isValid() && endDate.isSameOrAfter(startDate);

    if (!isValidDate) {
      callback(
        "Please select a valid end date that is on or after the start date."
      );
    } else {
      callback();
    }
  };
  async function handleApplyLeave(e: any) {
    const eventData = {
      id : uuidv4(),
      applyBy : "email",
      status: "pending",
      ...e
    }
    console.log(eventData)
    await addLeave(eventData);
    setIsAddModalVisible(false);
    message.success("Leave Application Submitted")
  }

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex justify-between items-center my-2">
          <span className="ml-2 font-serif text-2xl ">Leave Application</span>
          <div className="mx-3 flex justify-around">
            <Button
              type="text"
              className="bg-yellow-500 hover:bg-yellow-600 items-center"
              shape="square"
              icon={
                <div className="flex justify-center items-center hover:text-yellow-600">
                  <BiCalendarExclamation size={20} className="mr-2 " />
                  <span>Apply Leave</span>
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
        <div className="flex flew-row justify-around flex-wrap my-5">
          {cards.map((card, index) => (
            <div key={index} className="card">
              <Card
                onClick={() => handleCardClick(card.title)}
                hoverable
                title={card.title}
                bordered={true}
                style={{ width: "12rem" }}
                cover={card.image}
              >
                <div>
                  <span>Available: {card.available}</span>
                </div>
                <div>
                  <span>Booked: {card.booked}</span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Card className="m-5">
          <div className="flex flex-col">
            <Select
              variant="borderless"
              defaultValue="all"
              style={{ width: 200, border: "none", fontFamily: "serrif" }}
              options={[
                { value: "all", label: "All Leave and Holidays" },
                { value: "onlyHolidays", label: "Only Holidays" },
                { value: "onlyLeaves", label: "Only Leaves" },
              ]}
            />
            <u
              className="w-full "
              style={{
                height: 1,
                backgroundColor: "#edede9",
              }}
            ></u>
            <div
              className="w-full h-10 flex flex-row"
              style={{
                backgroundColor: "#f8f9fa",
              }}
            >
              <div className="w-[7rem] flex justify-start items-center">
                <span className="h-6 text-[#0077b6]">14 Feb, Wed</span>
              </div>
              <div className="text-center w-full flex float-start items-center">
                <u
                  style={{
                    backgroundColor: "#7209b7",
                    width: 2,
                    height: "4.5vh",
                  }}
                ></u>
                <div className="flex flex-col mx-2 w-[10rem]">
                  <span
                    className="text-xs"
                    style={{ fontSize: "10px", textAlign: "start" }}
                  >
                    Sick Leave
                  </span>
                  <span style={{ fontSize: "10px", textAlign: "start" }}>
                    0.5 Day(s)
                  </span>
                </div>
                <div className=" w-full">
                  <span>Medical Emergency</span>
                </div>
              </div>
            </div>
            <div
              className="w-full h-10 flex flex-row"
              style={{
                backgroundColor: "#f8f9fa",
              }}
            >
              <div className="w-[7rem] flex justify-start items-center">
                <span className="h-6 text-[#0077b6]">14 Feb, Wed</span>
              </div>
              <div className="text-center w-full flex float-start items-center">
                <u
                  style={{
                    backgroundColor: "#7209b7",
                    width: 2,
                    height: "4.5vh",
                  }}
                ></u>
                <div className="flex flex-col mx-2 w-[10rem]">
                  <span
                    className="text-xs"
                    style={{ fontSize: "10px", textAlign: "start" }}
                  >
                    Sick Leave
                  </span>
                  <span style={{ fontSize: "10px", textAlign: "start" }}>
                    0.5 Day(s)
                  </span>
                </div>
                <div className=" w-full">
                  <span>Medical Emergency</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Modal
        title="Apply Leave"
        open={isAddModalVisible}
        onCancel={handleOnCancel}
        footer={null}
      >
        <Form form={form}
        onFinish={(e) => {
          handleApplyLeave(e);
        }}
        >
          <Form.Item
            name="leaveType"
            label="Leave Type"
            rules={[{ required: true, message: "Select Leave Type" }]}
          >
            <Select
              style={{ width: "10rem" }}
              className=""
              // onChange={(e) => (e)}
            >
              {leaveTypes.map((item) => (
                <Select.Option value={item}>
                  <div className="flex flex-row items-center">{item}</div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div className="flex justify-between">
            <Form.Item
              name="start"
              label="From"
              rules={[
                {
                  required: true,
                  message: "Please select a start date.",
                },
                {
                  validator: validateStartDate,
                },
              ]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              name="end"
              label="To"
              rules={[
                {
                  required: true,
                  message: "Please select an end date.",
                },
                {
                  validator: validateEndDate,
                },
              ]}
            >
              <Input type="date" />
            </Form.Item>
          </div>
          <Form.Item name="desc" label="Reason for leave">
            <TextArea placeholder="maxLength is 30" maxLength={30} />
          </Form.Item>
          <Form.Item>
            <Button
              type="text"
              className="bg-orange-300 hover:border-orange-300"
              htmlType="submit"
            >
              <span className="font-sans">Submit</span>
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LeaveApplication;
