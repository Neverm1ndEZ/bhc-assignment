import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "@/app/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function POST(request: Request) {
	const { email, password } = await request.json();

	try {
		const user = await findUserByEmail(email);

		if (!user || !bcrypt.compareSync(password, user.password)) {
			console.error("Invalid credentials for email:", email);
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 },
			);
		}

		const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
			expiresIn: "1h",
		});

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _, ...userWithoutPassword } = user;

		console.log("Login successful for user:", userWithoutPassword);
		console.log("Generated token:", token);

		return NextResponse.json({ user: userWithoutPassword, token });
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json({ error: "Login failed" }, { status: 500 });
	}
}
