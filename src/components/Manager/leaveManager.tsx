import { Button, Card, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { BiCalendarExclamation } from "react-icons/bi";
import { addLeave, getAllLeaves, getLeaveById, removeLeaveById, updateLeaveById } from "../../services/leaveDBService";
import { MdOutlineDownloadDone } from "react-icons/md";
import { CiSquareRemove } from "react-icons/ci";

type Props = {};

const LeaveManager = (props: Props) => {
  const [leaveStatus, setLeaveStatus] = useState("");
  const [LeavesData, setLeavesData] = useState<any[]>([]);
  const fetchData = async () => {
    try {
      const leaves = await getAllLeaves();
      setLeavesData(leaves);
    } catch (error) {
      console.error("Error fetching data from IndexedDB:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  async function handleLeaveStatus(status) {
    const templeaves: any = [];
    console.log(status);
    LeavesData.filter((item) => item.status === status).map((data) =>
      templeaves.push(data)
    );
    setLeavesData(templeaves);
    console.log(LeavesData);
  }

    async function handleApprove(key: string) {
        const leaves = await getLeaveById(key);
        const status = {
            ...leaves,
            id: key,
            status: "Approved",
        }
        console.log(status);
        await removeLeaveById(key);
        await addLeave(status);
        fetchData();
        // await updateLeaveById(status.id,status);
        // await removeLeaveById(key);
    }

    async function handleReject(key: string){
        const leaves = await getLeaveById(key);
        const status = {
            ...leaves,
            id: key,
            status: "rejected",
        }
        console.log(status);
        await removeLeaveById(key);
        await addLeave(status);
        fetchData();
    }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-between items-center my-2">
          <span className="ml-2 font-serif text-2xl">Leave Manager</span>
          {/* <div className="flex justify-center items-center">
            <Input
              status="warning"
              placeholder="Search here.."
              prefix={<BiCalendarExclamation size={20} />}
              style={{ marginRight: "2rem" }}
              // onChange={(e) => onChange(e.target.value)}
            />
          </div> */}
        </div>
        <div>
          <Card className="border-none">
            <div className="flex flex-col">
              {/* <Select
                variant="borderless"
                defaultValue="all"
                onChange={handleLeaveStatus}
                style={{ width: 200, border: "none", fontFamily: "serrif" }}
                options={[
                  { value: "all", label: "All Leaves" },
                  { value: "pending", label: "Pending" },
                  { value: "Approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                ]}
              /> */}
              {LeavesData.filter((item) => item.status.includes("pending")).map(
                (data) => (
                  <div
                    className="flex flex-col  justify-between mb-2"
                    style={{
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <div className="flex justify-between items-center ">
                      <span>{data.leaveType}</span>
                      <div className="flex">
                        <span className="mr-2">From: {data.start}</span>
                        <span>To: {data.end}</span>
                      </div>
                      <span className="w-[15rem]">Reason: {data.desc}</span>
                    </div>
                    <div className="flex flex-row justify-between">
                      <span>By:{data.applyBy}</span>
                      <div className="mr-1">
                        <Button
                          type="primary"
                          ghost
                          className="mr-2 border-none"
                          size="small"
                          onClick={()=> {
                            handleApprove(data.id)
                          }}
                        >
                          <MdOutlineDownloadDone />
                        </Button>
                        <Button danger size="small" className="border-none" onClick={handleReject}>
                          <CiSquareRemove />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LeaveManager;
