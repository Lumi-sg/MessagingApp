import React, { useEffect } from "react";
import { useUserStore } from "../../stores/userStore";

const Dashboard = () => {
	const { user } = useUserStore();
	useEffect(() => {
		console.table(user);
	}, []);
	return <div>Dashboard</div>;
};

export default Dashboard;
