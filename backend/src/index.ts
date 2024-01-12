import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import path from "path";
import passport from "passport";
import mongoose from "mongoose";
import router from "./router/router";
import "./auth/passportConfig";
import session from "express-session";
import { User } from "../src/models/User";

const app = express();
dotenv.config();

app.use(
	cors({
		credentials: true,
	})
);

app.use(compression());
// app.use(bodyParser.json());

//DB Stuff
const MONGO_URL = process.env.MONGO_DB_URL;

mongoose.set("strictQuery", false);

if (!MONGO_URL) {
	console.error("MONGODBURL environment variable is not set.");
	process.exit(1); // Exit the application with an error code.
}
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);

//Mongo connection info
mongoose.connection.on("error", (error: Error) => {
	console.log(error);
});
mongoose.connection.on("open", () => {
	console.log("Connected to MongoDB");
});

mongoose.connection.on("close", () => {
	console.log("Disconnected from MongoDB");
});

//View Engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// //Middleware
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user: any, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (error) {
		done(error);
	}
});

app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});
// Default route
app.use("/", router);

const server = http.createServer(app);
const port = 3000;

server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
