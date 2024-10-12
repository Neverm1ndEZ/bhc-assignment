import { MongoClient, Db } from "mongodb";
import { User } from "@/app/types";

let client: MongoClient;
let db: Db;

const uri = process.env.MONGODB_URI || "";

if (!uri) {
	throw new Error("Please define the MONGODB_URI environment variable");
}

export async function connectToDatabase() {
	if (client) {
		return { client, db };
	}

	try {
		client = await MongoClient.connect(uri);
		db = client.db();
		console.log("Connected to MongoDB");
		return { client, db };
	} catch (error) {
		console.error("Failed to connect to MongoDB:", error);
		throw error;
	}
}

export async function getUsers() {
	const { db } = await connectToDatabase();
	return db.collection<User & { password: string }>("users");
}

export async function findUserByEmail(email: string) {
	const users = await getUsers();
	return users.findOne({ email });
}

export async function findUserById(id: string) {
	const users = await getUsers();
	return users.findOne({ id });
}

export async function addUser(user: User & { password: string }) {
	const users = await getUsers();
	await users.insertOne(user);
}

export async function updateUser(user: User & { password: string }) {
	const users = await getUsers();
	await users.updateOne({ id: user.id }, { $set: user });
}
