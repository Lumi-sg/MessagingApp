import Footer from "../Footer/Footer";
import "./login.css";
import { BASEURL } from "../../main";

const Login = () => {
	return (
		<div className="mainContainer">
			<div className="loginContainer">
				<form
					action={`${BASEURL}/login`}
					method="post"
					className="loginForm"
				>
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
