import express from "express";

const router = express.Router();

//Default route
router.get("/", (req, res) => {
	res.render("index");
});

// Catch-all route for handling all other requests
router.use((req, res) => {
	const error = new Error("Not Found");
	res.status(404).render("error", { error });
});

export default router;
