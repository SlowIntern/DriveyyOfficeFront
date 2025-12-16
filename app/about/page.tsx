// app/about/page.tsx  (or pages/about.tsx if using pages directory)

"use client";

import React from "react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            {/* Header */}
            <header className="bg-black/70 backdrop-blur-md py-6">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        UberX Clone
                    </h1>
                    <nav className="space-x-4">
                        <a href="/" className="text-gray-300 hover:text-white transition-all">Home</a>
                        <a href="/about" className="text-white font-semibold transition-all">About</a>
                        <a href="/contact" className="text-gray-300 hover:text-white transition-all">Contact</a>
                    </nav>
                </div>
            </header>

            {/* About Section */}
            <main className="max-w-4xl mx-auto px-6 py-16 text-center">
                <h2 className="text-4xl font-bold mb-6">About UberX Clone</h2>
                <p className="text-gray-300 mb-6">
                    UberX Clone is a full-featured ride-hailing platform built for learning and testing purposes.
                    It allows users to request rides, track captains, and view real-time updates with a modern UI.
                </p>
                <p className="text-gray-300 mb-6">
                    This project is built with{" "}
                    <span className="text-blue-400 font-semibold">Next.js</span>,{" "}
                    <span className="text-green-400 font-semibold">NestJS</span>,{" "}
                    <span className="text-yellow-400 font-semibold">MongoDB</span>, and{" "}
                    <span className="text-purple-400 font-semibold">TailwindCSS</span> for rapid development.
                </p>
                <p className="text-gray-300">
                    This page is for informational purposes only and demonstrates the capabilities of a ride-hailing application clone.
                </p>
            </main>

            {/* Footer */}
            <footer className="bg-black/70 backdrop-blur-md py-6 mt-16">
                <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
                    &copy; 2025 UberX Clone. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
