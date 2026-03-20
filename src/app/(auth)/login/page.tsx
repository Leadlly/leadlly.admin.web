import React from "react";

import Image from "next/image";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import GoogleLoginButton from "../_components/GoogleLoginButton";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8 space-y-8 bg-white rounded-3xl shadow-lg">
        <CardHeader className="text-center">
          <Avatar className="mx-auto mb-6 bg-primary/10 size-12">
            <AvatarImage src="/leadlly.jpeg" className="size-full" />
          </Avatar>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access your admin dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <GoogleLoginButton />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
