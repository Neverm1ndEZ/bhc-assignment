import React, { useState, useEffect } from "react";
import { User } from "@/app/types";

interface UserListProps {
	users: User[];
	onUserUpdate: () => void;
}

export default function UserList({ onUserUpdate }: UserListProps) {
	const [users, setUsers] = useState<User[]>([]);
	const [newPassword, setNewPassword] = useState("");
	const [selectedUser, setSelectedUser] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	useEffect(() => {
		fetchUsers();
	}, []);

	useEffect(() => {
		if (message) {
			const timer = setTimeout(() => {
				setMessage(null);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [message]);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/users");
			if (response.ok) {
				const data = await response.json();
				setUsers(data);
				setMessage({ type: "success", text: "Users fetched successfully" });
			} else {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to fetch users");
			}
		} catch (error) {
			console.error("Error fetching users:", error);
			setMessage({
				type: "error",
				text: error instanceof Error ? error.message : "Failed to fetch users",
			});
		} finally {
			setLoading(false);
		}
	};

	const handlePasswordChange = async (userId: string) => {
		try {
			const response = await fetch(`/api/users`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId, password: newPassword }),
			});

			const data = await response.json();

			if (response.status === 200) {
				setNewPassword("");
				setSelectedUser(null);
				onUserUpdate();
				setMessage({ type: "success", text: "Password updated successfully" });
				fetchUsers();
			} else {
				throw new Error(data.error || "Failed to update password");
			}
		} catch (error) {
			console.error("Error updating password:", error);
			setMessage({
				type: "error",
				text:
					error instanceof Error ? error.message : "Failed to update password",
			});
		}
	};

	return (
		<div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl mx-auto">
			<h2 className="text-3xl font-bold mb-6 text-gray-800">User List</h2>
			{message && (
				<div
					className={`mb-4 p-4 rounded-md ${
						message.type === "success"
							? "bg-green-100 text-green-700"
							: "bg-red-100 text-red-700"
					}`}
				>
					{message.text}
				</div>
			)}
			{loading ? (
				<div className="flex justify-center items-center h-40">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
				</div>
			) : users.length === 0 ? (
				<p className="text-center text-gray-500 text-lg">No users found.</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{users.map((user) => (
						<div
							key={user.id}
							className="bg-gray-50 rounded-lg shadow-md p-6 transition duration-300 ease-in-out hover:shadow-xl"
						>
							<div className="flex items-center space-x-4 mb-4">
								<div className="bg-blue-500 text-white rounded-full p-3">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
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
								</div>
								<div>
									<h3 className="text-xl font-semibold text-gray-800">
										{user.username}
									</h3>
									<p className="text-sm text-gray-600">{user.email}</p>
								</div>
							</div>
							<div className="mb-4">
								<span
									className={`px-2 py-1 rounded-full text-xs font-medium ${
										user.isAdmin
											? "bg-green-100 text-green-800"
											: "bg-blue-100 text-blue-800"
									}`}
								>
									{user.isAdmin ? "Admin" : "Normal User"}
								</span>
							</div>
							{selectedUser === user.id ? (
								<div className="space-y-2">
									<input
										type="password"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										placeholder="New password"
										className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
									/>
									<button
										onClick={() => handlePasswordChange(user.id)}
										className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
									>
										Change Password
									</button>
								</div>
							) : (
								<button
									onClick={() => setSelectedUser(user.id)}
									className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
								>
									Set New Password
								</button>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
