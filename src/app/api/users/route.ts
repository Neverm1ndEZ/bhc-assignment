import { NextResponse } from "next/server";
import { updateUserPassword } from "@/app/lib/auth";
import { getUsers } from "@/app/lib/db";

export async function GET() {
	try {
		const usersCollection = await getUsers();
		const users = await usersCollection.find({}).toArray();

		// Remove password field from each user object
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const sanitizedUsers = users.map(({ password, ...user }) => user);

		return NextResponse.json(sanitizedUsers);
	} catch (error) {
		console.error("Failed to fetch users:", error);
		return NextResponse.json(
			{ error: "Failed to fetch users" },
			{ status: 500 },
		);
	}
}

export async function PATCH(request: Request) {
	const { userId, password } = await request.json();

	if (!userId || !password) {
		return NextResponse.json(
			{ error: "Missing userId or password" },
			{ status: 400 },
		);
	}

	try {
		await updateUserPassword(userId, password);
		return NextResponse.json({ message: "Password updated successfully" });
	} catch (error) {
		console.error("Failed to update password:", error);
		return NextResponse.json(
			{ error: "Failed to update password" },
			{ status: 500 },
		);
	}
}
