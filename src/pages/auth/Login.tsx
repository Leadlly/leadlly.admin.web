import { CheckCircle, Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import {  useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import apiClient from "../../apiClient/apiClient";
import Loader from "../root/Loader";
interface LoginError {
  message: string;
  name: string;
  code: string;
}
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);
  const navigate = useNavigate();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setIsLoading(true)

    try {
      const response = await apiClient.post(`/api/auth/admin/login`, {
        email,
        password
      });

      if (response.status === 200) {
        navigate('/mentors');
        setLoginSuccess(true)
        setIsLoggingIn(true)
      }
    }  catch (error: any) {
      setError(error);
      
    } finally {
      setIsLoggingIn(false);
      setIsLoading(false)
    }
  };
  return (
    <>
     {isLoading ? (
      <Loader />
    ) : (
    <div className="h-main-height relative">
      <div className="flex items-center justify-center xl:justify-normal py-2 lg:mx-24">
        <img
          src="/assets/images/leadlly_logo.svg"
          alt="Leadlly_Logo"
          width={170}
          height={70}
        />
      </div>

      <div className="h-[calc(100%-56px)] flex items-center justify-center w-full px-4 lg:px-20 ">
        <div className="box flex flex-col-reverse xl:flex-row items-center justify-center lg:gap-6 w-full pt-60">
        <div className="rounded-3xl px-5 sm:px-8 lg:px-12 py-10 lg:py-14 shadow-xl max-w-[530px] sm:w-full flex flex-col justify-start space-y-4">
           <div className="text-center space-y-4 mb-8">
              <h3 className="text-3xl lg:text-[62px] font-bold leading-none">
                Welcome
              </h3>
              <p className="text-base lg:text-lg ">
                We are glad to see you with us
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4 space-y-6">
                <Input
                  placeholder="Email"
                  icon1={<User className="w-5 h-5 opacity-70" />}
                  className="focus-visible:ring-0 text-lg focus:ring-offset-0"
                  inputWrapperClassName="h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <Input
                  type={togglePassword ? "text" : "password"}
                  placeholder="Create password"
                  icon1={<Lock className="w-5 h-5 opacity-70" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon2={
                    <div
                      className="cursor-pointer"
                      onClick={() => setTogglePassword(!togglePassword)}
                    >
                      {togglePassword ? (
                        <EyeOff className="w-5 h-5 opacity-70" />
                      ) : (
                        <Eye className="w-5 h-5 opacity-70" />
                      )}
                    </div>
                  }
                  className="focus-visible:ring-0 text-lg focus:ring-offset-0"
                  inputWrapperClassName="h-12"
                />
              </div>
              {error && (
        <p style={{ color: 'red' }}>
          {"Invalid email or password"}
        </p>
      )}
              <div className="w-full flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="remember-password"
                    className="w-4 h-4 text-[#9652f4] border-[#9652f4] rounded"
                  />
                  <label htmlFor="remember-password" className="mt-1">
                    Remember Password
                  </label>
                </div>

                <div>
                  <Link to={"/forgotpassword"} className="text-[#9652f4]">
                    Forgot Password?
                  </Link>
                </div>
              </div>
             
              <Button
  type="submit"
  className="w-full text-xl h-12 rounded-lg bg-[#9652f4] hover:bg-[#9652f4d1] transition duration-300 ease-in-out"
  disabled={isLoggingIn}
>
  {isLoggingIn ? (
    <span className="flex items-center">
      <Loader2 className="mr-2 w-5 h-5 animate-spin" /> Logging in...
    </span>
  ) : loginSuccess ? (
    <span className="flex items-center">
      <CheckCircle className="mr-2 w-5 h-5 text-green-500" /> Logged In Successfully!
    </span>
  ) : (
    <span>Log in</span>
  )}


</Button>
            </form>

            {/* <GoogleLoginButton /> */}

            <div className="w-full text-center">
              <p>
                No account yet?{" "}
                <Link to={"/signup"} className="text-[#9652f4]">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
          <div className="image-container relative w-56 h-56 sm:w-96 sm:h-96 md:w-[500px] md:h-[660px]">
            <img
              src="/assets/icons/Loginpic.png"
              alt="Login_page_photo"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <span className="login-span absolute bottom-0 xl:right-0 -z-20 w-full xl:w-80 h-64 sm:h-84 xl:h-full rounded-tl-[40px] rounded-tr-[40px] xl:rounded-tr-none xl:rounded-bl-[40px] bg-[#FCF3FF]"></span>
    </div>
    )}
    </>
  );
};

export default Login;
