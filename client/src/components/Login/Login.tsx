import Footer from "../Footer/Footer";
import "./login.css";
import { BASEURL } from "../../main";
import { User as UserType } from "../../types/User";
import { useUserStore } from "../../stores/userStore";

const Login = () => {
	const { setUser, setIsLoggedIn } = useUserStore();

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		const formData = new FormData(event.target);
		const username = formData.get("username");
		const password = formData.get("password");

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
				const data = await response.json();
				const userResponse = data.user as UserType;

				setUser(userResponse);
				setIsLoggedIn(true);

				window.location.href = "/dashboard";
			} else {
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
			<Footer />
		</div>
	);
};

export default Login;
