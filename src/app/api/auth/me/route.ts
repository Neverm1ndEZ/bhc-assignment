import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findUserById } from "@/app/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function GET(request: Request) {
	const authHeader = request.headers.get("authorization");

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		console.error("No token provided or invalid Authorization header");
		return NextResponse.json({ error: "No token provided" }, { status: 401 });
	}

	const token = authHeader.split(" ")[1];

	try {
		console.log("Received token:", token);
		console.log("JWT_SECRET:", JWT_SECRET);

		const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
		console.log("Decoded token:", decoded);

		const user = await findUserById(decoded.userId);

		if (!user) {
			console.error("User not found for id:", decoded.userId);
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const { ...userWithoutPassword } = user;
		return NextResponse.json(userWithoutPassword);
	} catch (error) {
		console.error("Token verification error:", error);
		if (error instanceof jwt.JsonWebTokenError) {
			console.error("JWT Error name:", error.name);
			console.error("JWT Error message:", error.message);
		}
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });
	}
}
