"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
	const { user, logout } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push("/login");
		}
	}, [user, router]);

	if (!user) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
			<div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
				<div className="bg-indigo-600 p-4 text-white text-center">
					<h1 className="text-3xl font-bold">Profile</h1>
				</div>
				<div className="p-8">
					<div className="flex justify-center mb-6">
						<div className="w-24 h-24 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-600 text-4xl font-bold uppercase">
							{user.username.charAt(0)}
						</div>
					</div>
					<div className="space-y-4">
						<div className="flex items-center border-b border-gray-200 pb-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-indigo-600 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
							<p>
								<span className="font-semibold">Username:</span> {user.username}
							</p>
						</div>
						<div className="flex items-center border-b border-gray-200 pb-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-indigo-600 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
							<p>
								<span className="font-semibold">Email:</span> {user.email}
							</p>
						</div>
						<div className="flex items-center pb-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-indigo-600 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
								/>
							</svg>
							<p>
								<span className="font-semibold">Role:</span>{" "}
								{user.isAdmin ? "Admin" : "Normal User"}
							</p>
						</div>
					</div>
					<div className="mt-8 space-y-4">
						{user.isAdmin && (
							<button
								onClick={() => router.push("/admin/users")}
								className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
							>
								View Users
							</button>
						)}
						<button
							onClick={logout}
							className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
						>
							Logout
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
