"use client";

import { Link } from "react-router-dom";
// import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";

// import * as z from "zod";

// const ForgotPasswordSchema = z.object({
//   email: z
//     .string({ required_error: "Please enter your email." })
//     .email({ message: "Invalid email address!" }),
// });

const  ForgotPassword = () => {
  const [isSending, setIsSending] = useState(false);

  // const router = useRouter();

  // const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
  //   resolver: zodResolver(ForgotPasswordSchema),
  // });

  const onFormSubmit = async () => {
    setIsSending(true);

  };

  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className="max-w-lg w-full rounded-xl shadow-2xl flex flex-col items-center justify-center gap-y-2 p-10 mx-auto mt-40">
        <img
          src="/assets/images/leadlly_logo.svg"
          alt="Leadlly Logo"
          width={130}
          height={130}
        />

        <h2 className="text-2xl lg:text-5xl font-bold mt-5 mb-3">
          Forgot Password
        </h2>
        <p className="text-center font-medium leading-tight">
          Enter the email you used to create your account so we can send you a
          link for resetting your password
        </p>

        {/* <Form {...form}> */}
          <form
            className="w-full space-y-4 mt-5"
            onSubmit={onFormSubmit}
           >
            <Label htmlFor="email" className="text-base lg:text-lg font-medium">Email</Label>
                    <Input
                      placeholder="example@mail.com"
                      className="focus-visible:ring-0 text-lg focus:ring-offset-0"
                      inputWrapperClassName="h-12"
                      // {...field}
                    />

            <Button
              type="submit"
              className="w-full h-12 text-base lg:text-lg"
              disabled={isSending}>
              {isSending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending
                </span>
              ) : (
                "Send"
              )}
            </Button>
          </form>

        <Link to="/login" className="w-full mt-2">
          <Button variant="outline" className="w-full h-12 text-base">
            Back to Log in
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default ForgotPassword;
