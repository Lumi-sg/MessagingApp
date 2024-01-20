import React, { useEffect } from "react";
import { useUserStore } from "../../stores/userStore";

const Dashboard = () => {
	const { user } = useUserStore();
	useEffect(() => {
		console.table(user);
	}, []);
	return (
		<div className="mainContainer">
			<div className="dashboardContainer">
				<h1>Welcome {user!.username}</h1>
			</div>
		</div>
	);
};

export default Dashboard;
