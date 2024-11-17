"use client";
import React from 'react';

const MentorDetails: React.FC = () => {
  const invoices = [
    { project: 'Macbook Air M1', customer: 'Arlene McCoy', total: '$1,650.00', status: 'Confirmed' },
    { project: 'Macbook Air M1', customer: 'Arlene McCoy', total: '$1,650.00', status: 'Rejected' },
    // Add more rows as needed
  ];

  return (
    <table className="min-w-full bg-white shadow rounded-lg">
      <thead>
        <tr>
          <th>Project Name</th>
          <th>Customer Name</th>
          <th>Sub Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice, idx) => (
          <tr key={idx}>
            <td>{invoice.project}</td>
            <td>{invoice.customer}</td>
            <td>{invoice.total}</td>
            <td>{invoice.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MentorDetails;