"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/app/types";
import { useRouter } from "next/navigation";

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	register: (
		username: string,
		email: string,
		password: string,
	) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			fetchUserData(token);
		}
	}, []);

	const fetchUserData = async (token: string) => {
		try {
			const response = await fetch("/api/auth/me", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const userData = await response.json();
				setUser(userData);
			} else {
				console.error("Failed to fetch user data:", await response.text());
				localStorage.removeItem("token");
			}
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	};

	const login = async (email: string, password: string) => {
		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (response.ok) {
				const { user, token } = await response.json();
				localStorage.setItem("token", token);
				setUser(user);
				await fetchUserData(token); // Fetch user data immediately after login
				router.push("/profile"); // Redirect to profile page
			} else {
				throw new Error("Login failed");
			}
		} catch (error) {
			console.error("Login error:", error);
		}
	};

	const register = async (
		username: string,
		email: string,
		password: string,
	) => {
		const response = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, email, password }),
		});

		if (response.ok) {
			const { user, token } = await response.json();
			localStorage.setItem("token", token);
			setUser(user);
			await fetchUserData(token); // Fetch user data immediately after registration
			router.push("/profile"); // Redirect to profile page
		} else {
			throw new Error("Registration failed");
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
