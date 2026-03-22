"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useGoogleLogin } from "@react-oauth/google";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

const GoogleLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      setIsLoading(true);
      logger.debug("Google login successful", { credentialResponse });
      try {
        const res = await axios.post(
          "/api/google/auth",
          {
            access_token: credentialResponse.access_token,
            isAdmin: true,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Login success", {
          description: res.data.message,
        });

        logger.debug("Google auth response received", { data: res.data });

        if (res.status === 201) {
          router.replace("/create-institute");
        } else {
          router.replace(
            res.data.user.institutes.length > 0 ? "/" : "/create-institute"
          );
        }
      } catch (error) {
        logger.error("Axios error during Google login", { error });
        toast.error("Google login failed!", {
          description: `${error instanceof AxiosError ? error.response?.data?.message : error instanceof Error ? error.message : "An unknown error occurred while logging in with Google!"}`,
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      logger.error("Google login error", { error });
      toast.error("Google login failed!", {
        description: `${error instanceof AxiosError ? error.response?.data?.message : error instanceof Error ? error.message : "An unknown error occurred while logging in with Google!"}`,
      });
    },
  });

  return (
    <Button
      type="button"
      variant={"outline"}
      onClick={() => login()}
      className="w-full text-lg lg:text-xl h-12 gap-2"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
        </>
      ) : (
        <>
          <Image
            src="/google-icon.svg"
            alt="Sign in with Google"
            width={17}
            height={17}
          />
          Sign in with Google
        </>
      )}
    </Button>
  );
};

export default GoogleLoginButton;
