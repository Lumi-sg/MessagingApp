// authMiddleware.ts

import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const requireAuth = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	const token =
		req.headers.authorization?.split("Bearer ")[1] || req.cookies.jwt;

	if (token) {
		try {
			// verify
			const decodedToken = jwt.verify(token, `${process.env.SECRET}`);

			// Attach the decoded token to the request for further use
			req.user = decodedToken;

			return next();
		} catch (error) {
			// verification failed
			return res.status(401).send("Unauthorized");
		}
	}

	// no token
	return res.status(401).send("Unauthorized");
};

export default requireAuth;
