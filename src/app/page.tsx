import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 text-white">
			<div className="text-center">
				<h1 className="text-5xl font-extrabold mb-4 animate-fade-in-down">
					Welcome to Our App
				</h1>
				<p className="text-xl mb-8 max-w-md mx-auto">
					Experience the power of our innovative solution. Join us today!
				</p>
				<div className="space-x-4">
					<Link
						href="/login"
						className="bg-white text-indigo-600 font-bold py-3 px-6 rounded-full hover:bg-indigo-100 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
					>
						Login
					</Link>
					<Link
						href="/login?register=true"
						className="bg-indigo-500 text-white font-bold py-3 px-6 rounded-full hover:bg-indigo-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
					>
						Sign Up
					</Link>
				</div>
			</div>
		</div>
	);
}
