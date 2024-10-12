"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "@/app/components/LoginForm";

function LoginPageContent() {
	const searchParams = useSearchParams();
	const [isRegistering, setIsRegistering] = useState(
		searchParams.get("register") === "true",
	);

	const toggleMode = () => {
		setIsRegistering(!isRegistering);
	};

	return (
		<div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
			<div className="bg-indigo-600 p-4">
				<h1 className="text-3xl font-bold text-center text-white">
					{isRegistering ? "Create an Account" : "Welcome Back"}
				</h1>
			</div>
			<div className="p-8">
				<LoginForm isRegistering={isRegistering} />
				<button
					onClick={toggleMode}
					className="mt-4 text-indigo-600 hover:text-indigo-800 transition duration-300 ease-in-out block text-center w-full"
				>
					{isRegistering
						? "Already have an account? Login"
						: "Need an account? Sign Up"}
				</button>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 p-4">
			<Suspense fallback={<div>Loading...</div>}>
				<LoginPageContent />
			</Suspense>
		</div>
	);
}
