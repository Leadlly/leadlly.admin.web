import React from "react";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

interface InstituteCardProps {
  logo: string;
  established: string;
  name: string;
  code: string;
  address: string;
  contact: string;
  email: string;
}

const InstituteCard = ({
  logo,
  established,
  name,
  code,
  address,
  contact,
  email,
}: InstituteCardProps) => {
  return (
    <Card className="sm:p-8 p-4 grid md:grid-cols-2 bg-purple-100 rounded-lg items-center gap-4 border-[#9654F4A1]">
      <div className="flex sm:flex-row sm:mb-0 mb-4 flex-col items-center gap-8">
        <img src={logo} alt="Institute Logo" className="w-36 h-40" />
        <div>
          <p className="text-sm">Established in {established}</p>
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-sm">
            Institute Code: <span className="font-bold">{code}</span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-y-8">
        <p>
          <span className="text-slate-600 flex gap-3">
            <MapPin size={24} className="w-4" /> Address:
          </span>
          <span className="flex gap-3 text-md">
            <span className="w-4"></span>
            {address}
          </span>
        </p>
        <p>
          <span className="text-slate-600 flex gap-3">
            <Phone className="w-4" /> Contact:
          </span>
          <span className="flex gap-3 text-md">
            <span className="w-4"></span>
            {contact}
          </span>
        </p>
        <p>
          <span className="text-slate-600 flex gap-3">
            <Mail className="w-4" /> Email:
          </span>
          <span className="flex gap-3 text-md">
            <span className="w-4"></span>
            {email}
          </span>
        </p>
      </div>
    </Card>
  );
};

export default InstituteCard;
