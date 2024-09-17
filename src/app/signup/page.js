"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setTimeout(() => setError(null), 2000); // Clear error after 2 seconds
      setIsLoading(false);
      return;
    }

    // Mock API call for demonstration
    const apiUrl = "/api/register"; // Replace with your actual API endpoint
    const formData = { name, email, password };

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      setMessage("Successfully signed up! Please login Now");
      router.push("/"); // Redirect to the dashboard or login after successful signup
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 1000); // Clear error after 1 second
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 1000); // Clear message after 1 second
    }
  };

  // Handle login click
  const handleLoginClick = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="font-medium mb-1">Name:</label>
            <input
              type="text"
              className="p-2 border rounded-lg outline-none focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Email:</label>
            <input
              type="email"
              className="p-2 border rounded-lg outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col relative">
            <label className="font-medium mb-1">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              className="p-2 border rounded-lg outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex flex-col relative">
            <label className="font-medium mb-1">Confirm Password:</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="p-2 border rounded-lg outline-none focus:border-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-center">
            Already have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={handleLoginClick}
            >
              Login
            </span>
          </p>
        </form>

        {message && (
          <div className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-md">
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="fixed top-5 right-5 bg-red-500 text-white p-4 rounded-lg shadow-md">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupForm;
