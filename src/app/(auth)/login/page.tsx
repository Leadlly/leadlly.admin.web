"use client";

import React from "react";
import GoogleLoginButton from "../_components/GoogleLoginButton";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefbff]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-3xl shadow-lg">
        <div className="text-center space-y-2">
          <Image
            src="/assets/logo.png"
            alt="Leadlly Logo"
            width={150}
            height={40}
            className="mx-auto"
          />
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to access your admin dashboard
          </p>
        </div>

        <div className="space-y-4">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
