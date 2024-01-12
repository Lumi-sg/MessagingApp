import express from "express";
import * as UserController from "../controllers/UserController";
import requireAuth from "../middleware/requireAuth";

const router = express.Router();

//Default route
router.get("/", (req, res) => {
	res.render("index");
});

//User Routes
router.post("/signup", UserController.create_user_post);
router.post("/login", UserController.login_user_post);
router.post("/logout", requireAuth, UserController.logout_user_post);
router.post(
	"/update-status",
	requireAuth,
	UserController.update_user_status_post
);
router.get("/users", requireAuth, UserController.get_all_users);
router.get("/user/:id", requireAuth, UserController.get_single_user);
router.post("/addfriend", requireAuth, UserController.add_friend);

// Catch-all route for handling all other requests
router.use((req, res) => {
	const error = new Error("Not Found");
	res.status(404).render("error", { error });
});

export default router;
