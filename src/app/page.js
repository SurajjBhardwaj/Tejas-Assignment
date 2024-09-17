"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get the user's location on page load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, long: longitude });
        },
        () => {
          setError("Unable to retrieve your location");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call for demonstration
    const apiUrl = "/api/login"; // Replace with your actual API endpoint
    const formData = { email, password, location };

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
      setMessage("succussfully login...");

      // On success, you can redirect or perform other actions
      router.push("/dashboard"); // Redirect to a protected route on successful login
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 1000); // Clear error after 1 second
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 1000); // Clear error after 1 second
    }
  };

  // Handle signup click
  const handleSignupClick = () => {
    router.push("/signup");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center ">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex flex-col">
            <label className="font-medium mb-1">Password:</label>
            <input
              type="password"
              className="p-2 border rounded-lg outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center">
            Don&#39;t have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={handleSignupClick}
            >
              Sign up
            </span>
          </p>
        </form>
        {message && (
          <div className="fixed top-5 right-5 bg-red-500 text-white p-4 rounded-lg shadow-md">
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

export default LoginForm;
