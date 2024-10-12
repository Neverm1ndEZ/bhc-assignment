import { NextResponse } from "next/server";
import { registerUser } from "@/app/lib/auth";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function POST(request: Request) {
	try {
		const { username, email, password } = await request.json();

		if (!username || !email || !password) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		const user = await registerUser(username, email, password);

		// Generate JWT token
		const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
			expiresIn: "1h",
		});

		return NextResponse.json({ user, token });
	} catch (error) {
		console.error("Registration error:", error);
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json({ error: "Registration failed" }, { status: 400 });
	}
}
