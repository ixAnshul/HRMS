import React from "react";
import AdminCards from "../common/adminCards";
import { GiCutDiamond } from "react-icons/gi";
import { LuBoxes } from "react-icons/lu";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import ChartConfig from "../common/ChartConfig";

const AdminDashboard: React.FC = () => {
  const cardData = [
    { logo: <LuBoxes size={30} color="orange"/>, title: "Projects", totalNumber: 30 },
    { logo: <MdOutlineAttachMoney size={30} color="orange"/>, title: "Clients", totalNumber: 30 },
    { logo: <GiCutDiamond size={30} color="orange"/>, title: "Tasks", totalNumber: 30 },
    { logo: <FaUserTie size={30} color="orange"/>, title: "Employees", totalNumber: 30 },
  ];

  return (
    <>
      <div className="text-3xl m-5 font-serif">Welcome Admin!</div>
      <div className="flex justify-center flex-wrap my-5">
      {cardData.map((card) => (
        <AdminCards {...card} key={card.title} />
      ))}
      </div>
      <div>
        <ChartConfig/>
      </div>
    </>
  );
};

export default AdminDashboard;
