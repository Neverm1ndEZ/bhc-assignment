import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface LoginFormProps {
	isRegistering: boolean;
}

export default function LoginForm({ isRegistering }: LoginFormProps) {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { login, register } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			if (isRegistering) {
				await register(username, email, password);
			} else {
				await login(email, password);
			}
			router.push("/profile");
		} catch (err) {
			console.error(err);
			setError("Authentication failed. Please try again.");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{isRegistering && (
				<div>
					<label
						className="block text-sm font-medium text-gray-700"
						htmlFor="username"
					>
						Username
					</label>
					<input
						className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
						id="username"
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
			)}
			<div>
				<label
					className="block text-sm font-medium text-gray-700"
					htmlFor="email"
				>
					Email
				</label>
				<input
					className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                     focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
					id="email"
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>
			<div>
				<label
					className="block text-sm font-medium text-gray-700"
					htmlFor="password"
				>
					Password
				</label>
				<input
					className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                     focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
					id="password"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>
			{error && <p className="text-red-500 text-sm">{error}</p>}
			<div>
				<button
					className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					type="submit"
				>
					{isRegistering ? "Sign Up" : "Sign In"}
				</button>
			</div>
		</form>
	);
}
