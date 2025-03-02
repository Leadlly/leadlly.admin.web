# Leadlly Admin Web

![Leadlly Logo]

## Overview

Leadlly Admin Web is a comprehensive administration platform for educational institutions. It provides tools for managing students, teachers, batches, and courses with an intuitive interface designed for educational administrators.

## Features

### Dashboard
Get a quick overview of your institution's key metrics:
- Total students and teachers
- Active courses and classes
- Performance metrics and attendance rates

![Dashboard](/Updated%20Images/dashboard.png)

### Student Management
- View and manage all student batches
- Filter students by standard, subject, and teacher
- Track student attendance and performance
- Detailed student profiles

![Student Batches](/Updated%20Images/batches.png)
![Student List](/Updated%20Images/List_students.png)

### Teacher Management
- Comprehensive teacher profiles
- Track teacher performance and satisfaction rates
- View classes taught by each teacher
- Monitor student attendance in teacher's classes

![Teacher Profile](/Updated%20Images/teacher_profile.png)

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: React Hooks
- **API**: Next.js API Routes
- **Styling**: Tailwind CSS for responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/leadlly.admin.web.git
cd leadlly.admin.web

# Install dependencies
npm install
# Run the development server
npm run dev

# Open URL_ADDRESS:3000 in your browser
# Project Structure

leadlly.admin.web/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── (root)/      # Main application routes
│   │   │   ├── (dashboard)/  # Dashboard components
│   │   │   ├── batches/      # Batch management
│   │   │   └── teacher/      # Teacher management
│   │   └── api/         # API routes
│   ├── components/      # Shared components
│   └── styles/          # Global styles
├── Updated Images/      # Project screenshots
└── README.md            # Project documentation