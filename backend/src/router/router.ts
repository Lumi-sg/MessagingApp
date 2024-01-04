import express from "express";
import * as UserController from "../controllers/UserController";

const router = express.Router();

//Default route
router.get("/", (req, res) => {
	res.render("index");
});

router.post("/signup", UserController.create_user_post);
router.post("/login", UserController.login_user_post);

// Catch-all route for handling all other requests
router.use((req, res) => {
	const error = new Error("Not Found");
	res.status(404).render("error", { error });
});

export default router;
