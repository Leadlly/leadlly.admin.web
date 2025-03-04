import Link from "next/link";
import React from "react";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-white/30">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6 drop-shadow-lg">
          Welcome Back
        </h2>

        {/* Email & Password Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 w-full p-3 bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="mt-1 w-full p-3 bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none"
            />
          </div>
          <Link href="/">
            <button
              type="submit"
              className="w-full bg-white/20 mt-6 hover:bg-white/30 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-lg"
            >
              Sign In
            </button>
          </Link>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/40"></div>
          <p className="px-3 text-sm text-white/80">OR</p>
          <div className="flex-1 h-px bg-white/40"></div>
        </div>

        {/* Google Login */}
        <button className="w-full flex items-center justify-center bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg transition duration-300 shadow-lg">
          <FaGoogle className="mr-2 text-lg" />
          Sign in with Google
        </button>

        {/* Footer */}
        <p className="mt-4 text-sm text-white/80 text-center">
          Don't have an account?{" "}
          <a href="#" className="text-white hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
