import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("authToken")?.value;

  // Define the routes and their behavior
  const protectedRoute = "/dashboard"; // Only for authenticated users
  const restrictedRoutesForAuthUsers = ["/signup", "/"]; // Redirect to dashboard if already logged in

  // Check if the user is trying to access the protected route (/dashboard)
  if (req.nextUrl.pathname === protectedRoute) {
    if (!token) {
      // If no token, redirect to signup or login page
      return NextResponse.redirect(new URL("/signup", req.url));
    } else {
      try {
        // Verify the token
        const secret = new TextEncoder().encode(process.env.secretKey);
        await jwtVerify(token, secret);
        // If the token is valid, allow access to the dashboard
        return NextResponse.next();
      } catch (err) {
        console.error("Token verification error:", err);
        // If the token is invalid, redirect to the login page
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  }

  // Check if the user is trying to access restricted routes (/signup or /) while already authenticated
  if (restrictedRoutesForAuthUsers.includes(req.nextUrl.pathname)) {
    if (token) {
      try {
        // Verify the token
        const secret = new TextEncoder().encode(process.env.secretKey);
        await jwtVerify(token, secret);
        // If the token is valid, redirect to the dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch (err) {
        console.error("Token verification error:", err);
        // If the token is invalid, allow access to the route (could prompt to sign up)
      }
    }
  }

  // Continue to the requested page for all other cases
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signup", "/dashboard"], // Apply this middleware to these routes
};
