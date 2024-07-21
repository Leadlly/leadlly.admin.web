
import { CheckCircle, Eye, EyeOff, Key, Loader2, Mail, User } from 'lucide-react';
import { useState } from 'react';

import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import apiClient from '../../apiClient/apiClient';
// import { toast } from 'react-toastify';
// import ToastNotification from '../../components/ui/toaster';
// import { toast } from 'sonner';

const Signup = () => {
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [togglePassword, setTogglePassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsSubmitting(true);
    

    try {
      const response = await apiClient.post(`/api/auth/admin/register`, {
        firstname,
        email,
        password,
      });

      if (response.status === 200) {
        console.log('User registered successfully');
        setSignupSuccess(true)
      } else {
        console.log('Error registering user:', response.data);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-main-height  ">
    <div className="flex items-center justify-center xl:justify-normal py-2 lg:mx-20 mb-5 sm:mb-0">
      <img
        src="/assets/images/leadlly_logo.svg"
        alt="Leadlly_Logo"
        width={150}
        height={50}
      />
    </div>
<div className="h-[calc(100%-56px)] flex items-center justify-center w-full px-4 lg:px-20 pt-40">
  <div className="flex flex-col-reverse xl:flex-row items-center justify-center lg:gap-6 w-full">
    <div className="relative w-56 h-56 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] image-container">
      <img
        src="/assets/icons/signuppic.png"
        alt="Login_page_photo"
        className="object-contain"
      />
    </div>
        <div className="rounded-3xl px-8 lg:px-12 py-10 lg:py-14 shadow-xl max-w-[530px] w-full flex flex-col justify-start space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-2xl lg:text-4xl font-bold leading-none">
              Create an account
            </h3>
            <p className="text-base lg:text-lg">
              Unlock your potential with expert guidance sign up for
              mentorship today!
            </p>
          </div>
          <form onSubmit={handleSubmit}>
        <div className='mb-2'>
        <Input
          icon1={<User className="w-5 h-5 opacity-70" />}
          placeholder="Enter full name"
          type="text"
          value={firstname}
          required
          onChange={(e) => setFirstname(e.target.value)}
        />

        </div>
        <div className='mb-2'> 
            <Input placeholder="Enter your email" icon1={<Mail className="w-5 h-5 opacity-70" />} type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </div>
        <div className='mb-2'>
            <Input
              type={togglePassword? 'text' : 'password'}
              icon1={<Key className="w-5 h-5 opacity-70" />}
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              
              // onChange={(e) => setPassword(e.target.value)}
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
        <Button
    type="submit"
     className="w-full text-xl h-12 rounded-lg bg-[#9652f4] hover:bg-[#9652f4d1] transition duration-300 ease-in-out"
    disabled={isSubmitting}
  >
    {isSubmitting ? (
      <span className="flex items-center">
        <Loader2 className="mr-2 w-5 h-5 animate-spin" /> Signing Up
      </span>
    ) : signupSuccess ? (
      <span className="flex items-center">
        <CheckCircle className="mr-2 w-5 h-5 text-green-500" /> Signed Up Successfully!
      </span>
    ) : (
      "Sign Up"
    )}
  </Button>
      </form>
      <p className="w-full text-center text-base md:text-lg">
              Already have an account?{" "}
              <a href={"/login"} className="text-[#9652f4]">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;