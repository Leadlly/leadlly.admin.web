import Contact_Icon from "./icons/contactIcon";
import EmailIcon from "./icons/emailIcon";
import LocationIcon from "./icons/locationicon";
import Univarsity_logo from "./icons/logoicon";

export default async function Card() {
  return (
    <div className="flex justify-center px-8 py-8  m-8  bg-purple-100 rounded-2xl border-2 border-solid border-purple-500 gap-10">
      <Univarsity_logo />
      <Data />

      <div className="flex flex-col gap-5">
        <Address />
        <Email />
      </div>

      <Contact />
    </div>
  );
}
async function Data() {
  return (
    <div className="mt-6 gap-2">
      <div className="text-lg">Established in 2001</div>
      <div className="text-2xl font-bold">BRAC Univarsity </div>
      <span className="text-lg">Instution code:</span>
      <span className="text-lg italic font-bold">xyzwue</span>
    </div>
  );
}
async function Address() {
  return (
    <div className="text-xl">
      <div className="flex justify-start items-center gap-2">
        <LocationIcon />
        <h1 className="text-slate-500">Address:</h1>
      </div>

      <div className="pl-8">
       123,Main Street,city,country
      </div>
    </div>
  );
}
async function Email() {
  return (
    <div className="text-xl ">
      <div className="flex justify-start items-center gap-2">
        <EmailIcon />
        <h1 className="text-slate-500">Email:</h1>
      </div>
      <div className="pl-8">info@bracu.ac.bd</div>
    </div>
  );
}
async function Contact() {
  return (
    <div className="text-xl">
      <div className="flex justify-start items-center gap-2">
        <Contact_Icon />
        <h1 className="text-slate-500">Contact:</h1>
      </div>
      <div className="pl-8">Tel: +123456789</div>
    </div>
  );
}
