import React from "react";
import { useUserStore } from "../../stores/userStore";
import Footer from "../Footer/Footer";
import { useRouteLoaderData } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
	const { user } = useUserStore();
	const response = useRouteLoaderData("conversations");

	return (
		<div className="dashboardContainer">
			<div className="sideBarContainer">
        <div className="topRowContainer">
          <button>Logout</button>
          <h1>{user!.username}</h1>
          <button>+</button>
        </div>
      </div>
			<div className="conversationContainer">
        <div className="conversationtopRowContainer"></div>
      </div>
		</div>
	);
};

export default Dashboard;
