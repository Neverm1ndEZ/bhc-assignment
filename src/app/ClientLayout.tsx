"use client";

import { AuthProvider } from "@/app/contexts/AuthContext";
import Header from "@/app/components/Header";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AuthProvider>
			<div className="flex flex-col min-h-screen">
				<Header />
				<main className="flex-grow">{children}</main>
				<footer className="bg-gray-100 py-4 text-center text-sm text-gray-600 ">
					© 2024 Our App. All rights reserved.
				</footer>
			</div>
		</AuthProvider>
	);
}
