import mongoose, { Schema } from "mongoose";
import { z } from "zod";

const userSchema = z.object({
	username: z.string().min(3).max(15),
	password: z.string().min(6).max(20),
	friends: z.array(z.string()),
	statusMessage: z.string().optional(),
});

export type UserType = z.infer<typeof userSchema>;

export const UserModel = mongoose.model<UserType>("User", new Schema());
