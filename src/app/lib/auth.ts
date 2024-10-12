import { User } from "@/app/types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { addUser, findUserByEmail, getUsers } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function loginUser(
	email: string,
	password: string,
): Promise<User> {
	const user = await findUserByEmail(email);

	if (!user || !bcrypt.compareSync(password, user.password)) {
		throw new Error("Invalid credentials");
	}

	const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
	return {
		id: user.id,
		username: user.username,
		email: user.email,
		isAdmin: user.isAdmin,
	};
}

export async function registerUser(
	username: string,
	email: string,
	password: string,
): Promise<User> {
	// Check if user already exists
	const existingUser = await findUserByEmail(email);
	if (existingUser) {
		throw new Error("User with this email already exists");
	}

	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10);

	// Create new user object
	const newUser: User & { password: string } = {
		id: uuidv4(),
		username,
		email,
		password: hashedPassword,
		isAdmin: false,
	};

	// Add user to database
	try {
		await addUser(newUser);
	} catch (error) {
		console.error("Error adding user to database:", error);
		throw new Error("Failed to create user");
	}

	// Return user without password
	const { password: _, ...userWithoutPassword } = newUser;
	return userWithoutPassword;
}

export async function getAllUsers(): Promise<User[]> {
	const usersCollection = await getUsers();
	const users = await usersCollection
		.find({}, { projection: { password: 0 } })
		.toArray();
	return users.map(({ _id, ...user }) => ({ ...user, id: _id.toString() }));
}

export async function updateUserPassword(
	userId: string,
	newPassword: string,
): Promise<void> {
	const usersCollection = await getUsers();
	const user = await usersCollection.findOne({ id: userId });

	if (!user) {
		throw new Error("User not found");
	}

	const hashedPassword = bcrypt.hashSync(newPassword, 10);
	await usersCollection.updateOne(
		{ id: userId },
		{ $set: { password: hashedPassword } },
	);
}
