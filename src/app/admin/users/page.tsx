"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserList from "@/app/components/UserList";

export default function AdminUsersPage() {
	const { user } = useAuth();
	const router = useRouter();
	const [users, setUsers] = useState([]);

	useEffect(() => {
		if (!user || !user.isAdmin) {
			router.push("/profile");
		} else {
			fetchUsers();
		}
	}, [user, router]);

	const fetchUsers = async () => {
		const response = await fetch("/api/users");
		const data = await response.json();
		setUsers(data);
	};

	if (!user || !user.isAdmin) {
		return null;
	}

	// console.log("users:", users);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
			<h1 className="text-3xl font-bold mb-8">Manage Users</h1>
			<UserList users={users} onUserUpdate={fetchUsers} />
		</div>
	);
}
