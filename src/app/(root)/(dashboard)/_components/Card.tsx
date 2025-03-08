import React from 'react';
import {
    Card as ShadCNCard,
    CardContent,
    CardHeader,
  } from "@/components/ui/card"
  
interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <ShadCNCard className={className}>
      <CardHeader>
        <h2 className="font-semibold text-2xl mb-2">{title}</h2>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </ShadCNCard>
  );
};

export default Card;