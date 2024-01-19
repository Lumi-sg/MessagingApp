import Footer from "../Footer/Footer";
import "./login.css";
import { BASEURL } from "../../main";

const Login = () => {
	const handleSubmit = async (event: any) => {
		event.preventDefault();

		const formData = new FormData(event.target);
		const username = formData.get("username");
		const password = formData.get("password");

		// Perform your login request
		try {
			const response = await fetch(`${BASEURL}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			if (response.ok) {
				// Redirect to a new page upon successful login
				window.location.href = "/dashboard"; // Replace '/dashboard' with your desired URL
			} else {
				// Handle login error
				console.error("Login failed");
			}
		} catch (error) {
			console.error("Login error:", error);
		}
	};
	return (
		<div className="mainContainer">
			<div className="loginContainer">
				<form onSubmit={handleSubmit} className="loginForm">
					<label htmlFor="username">Username:</label>
					<input type="text" id="username" name="username" required />
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						required
					/>
					<div className="buttonContainer">
						<button type="submit">Login</button>
						<button>Signup</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
