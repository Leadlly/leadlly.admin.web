import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import apiClient from "../../apiClient/apiClient";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useParams();
  
    const onFormSubmit = async (event: any) => {
      event.preventDefault();
      setIsResettingPassword(true);
  
      try {
        if (password!== confirmPassword) {
          setError(error);
          setIsResettingPassword(false);
          return;
        }
        if (!token) {
          setError(error);
          setIsResettingPassword(false);
          return;
        }
  
        const response = await apiClient.put(`/api/auth/admin/resetpassword/${token}`, {
          password,
        });
  
        if (response.status === 200) {
          setIsResettingPassword(false);
          alert("Password reset successful");
        } else {
          setError(response.data.message);
          setIsResettingPassword(false);
        }
      } catch (error: any) {
        console.error(error);
        setError(error.message);
        setIsResettingPassword(false);
      }
    };

  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className="max-w-lg w-full rounded-xl shadow-2xl flex flex-col items-center justify-center gap-y-2 p-10">
        <img
          src="/assets/images/leadlly_logo.svg"
          alt="Leadlly Logo"
          width={130}
          height={130}
        />

        <h2 className="text-2xl lg:text-5xl font-bold mt-5 mb-3">
          Reset Password
        </h2>
        <p className="text-center font-medium leading-tight -mt-2">
          Choose a new password for your account
        </p>

        <form
          className="w-full space-y-4 mt-5"
          onSubmit={onFormSubmit}>
          <Input
            placeholder="Enter password"
            className="focus-visible:ring-0 text-lg focus:ring-offset-0"
            inputWrapperClassName="h-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder="Confirm password"
            className="focus-visible:ring-0 text-lg focus:ring-offset-0"
            inputWrapperClassName="h-12"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

<p className="text-sm text-red-500 font-medium leading-tight -mt-1">
  {"Password does not match"}
</p>

<Button
        type="submit"
        className="w-full h-12 text-base lg:text-lg"
        disabled={isResettingPassword}>
        {isResettingPassword? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Reset Password"
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

export default ResetPassword;