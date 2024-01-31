import Footer from "../Footer/Footer";
import "./login.css";
import { BASEURL } from "../../main";
import { useUserStore } from "../../stores/userStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRef } from "react";

const Login = () => {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const usernameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const handleLoginClick = async (event: any) => {
		event.preventDefault();

		try {
			const response = await fetch(`${BASEURL}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: usernameRef.current?.value,
					password: passwordRef.current?.value,
				}),
			});

			if (response.ok) {
				await useUserStore.getState().login(response);

				// Fetch all site users
				try {
					const response = await fetch(`${BASEURL}/users`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem(
								"token"
							)}`,
						},
					});

					if (response.ok) {
						const allSiteUsers = await response.json();
						useUserStore.getState().setAllUsers(allSiteUsers);
					} else {
						return;
					}
				} catch (error) {
					console.error("Error fetching all site users:", error);
				}

				navigate("/dashboard");
			} else {
				console.error("Login failed");
				console.log(response);
				setError("Incorrect username/password");
			}
		} catch (error) {
			console.error("Login error:", error);
		}
	};

	const handleSignupClick = async (event: any) => {
		event.preventDefault();

		try {
			const response = await fetch(`${BASEURL}/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: usernameRef.current?.value,
					password: passwordRef.current?.value,
					age: 25,
					country: "Testland",
				}),
			});
			if (response.ok) {
				setError("Account successfully created!");
				usernameRef.current!.value = "";
				passwordRef.current!.value = "";
				return;
			}
			const errors = await response.json();
			setError(errors.errors[0].msg);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className="mainContainer">
			<div className="loginContainer">
				<form className="loginForm">
					<label htmlFor="username">Username:</label>
					<input
						type="text"
						id="username"
						name="username"
						ref={usernameRef}
						required
					/>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						ref={passwordRef}
						required
					/>
					<div className="buttonContainer">
						<button onClick={handleLoginClick}>Login</button>
						<button onClick={handleSignupClick}>Signup</button>
					</div>
					{error && <div style={{ color: "red" }}>{error}</div>}
				</form>
			</div>
			<Footer />
		</div>
	);
};

export default Login;
