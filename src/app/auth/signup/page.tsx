"use client";

import React, { useState } from "react";
import { supabase } from "../../../lib/supabase.js"; // Import the initialized client
import { useRouter } from "next/navigation"; // Use `useRouter` from next/navigation
// import Image from "next/image.js";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Remove loading state related to user check
  const router = useRouter(); // Hook to navigate

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true); // Set loading state when sign-up starts

    // Basic email validation (you can extend it)
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    // Password validation (you can make it stronger)
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false); // Stop loading if there's an error
    } else {
      console.log("User signed up:", data.user);
      // Redirect to home page after successful sign-up
      router.push("/"); // Assuming your home page is the default route
    }
  };

  // Return a loading state until we're ready to show the form
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-emerald-600"></div>
      </div>
    ); // Styled spinner
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-green">
      <img
        className="h-70 w-105 pr-40"
        src="/images/novari-logo.png"
        alt="Logo"
      />
      <div className="bg-custom-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-green"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-custom-green"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-700 text-white p-2 rounded-md hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-custom-green"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">
            Already have an account?{" "}
            <a
              href="/auth/signin"
              className="text-emerald-600 hover:text-emerald-300"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
