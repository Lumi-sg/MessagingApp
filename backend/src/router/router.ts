import express from "express";
import * as UserController from "../controllers/UserController";
import * as MessageController from "../controllers/MessagingController";
import requireAuth from "../middleware/requireAuth";

const router = express.Router();

//Default route
router.get("/", (req, res) => {
	res.render("index");
});
//Onboard/offboard Routes
router.post("/signup", UserController.create_user_post);
router.post("/login", UserController.login_user_post);
router.post("/logout", requireAuth, UserController.logout_user_post);

//User Routes

router.post(
	"/updatestatus",
	requireAuth,
	UserController.update_user_status_post
);
router.get("/users", requireAuth, UserController.get_all_users);
router.get("/user/:id", requireAuth, UserController.get_single_user);

//Friend Routes
router.post("/addfriend", requireAuth, UserController.add_friend);
router.post("/removefriend", requireAuth, UserController.remove_friend);
router.get("/friends", requireAuth, UserController.get_all_friends);

//Message Routes
router.get("/conversations", requireAuth, MessageController.get_conversations);
router.post(
	"/createconversation",
	requireAuth,
	MessageController.create_conversation
);
// Catch-all route for handling all other requests
router.use((req, res) => {
	const error = new Error("Not Found");
	res.status(404).render("error", { error });
});

export default router;
