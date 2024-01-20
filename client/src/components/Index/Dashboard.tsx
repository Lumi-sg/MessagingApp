import React, { useEffect } from "react";
import { useUserStore } from "../../stores/userStore";
import Footer from "../Footer/Footer";
import { useRouteLoaderData } from "react-router-dom";

const Dashboard = () => {
	const { user } = useUserStore();
  const response = useRouteLoaderData("conversations");

	return (
		<div className="mainContainer">
			<div className="dashboardContainer">
				<div className="greetingContainer">
					<h1>Welcome {user!.username}</h1>
          
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Dashboard;
