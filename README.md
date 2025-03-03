# Leadlly Admin Web Platform

A modern, responsive admin dashboard for educational institute management built with Next.js 14 and TypeScript.

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** React Context + Providers
- **Data Persistence:** JSON-based File System
- **Form Validation:** [Zod](https://zod.dev/)
- **Icons:** [Lucide Icons](https://lucide.dev/)

## 📁 Project Structure

```
src/
├── app/                   # Next.js app router pages
│   ├── (root)/           # Main layout group
│   │   ├── batches/      # Batch management pages
│   │   └── page.tsx      # Dashboard page
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   ├── modals/          # Modal components
│   └── ui/              # UI components
├── lib/                 # Utility functions and services
│   ├── services/        # API services
│   ├── store/          # Data store implementation
│   ├── utils/          # Utility functions
│   └── validations/    # Schema validations
├── providers/          # React Context providers
└── types/             # TypeScript type definitions
```

## 🔧 Implementation Details

### Data Persistence

- Implemented a custom JSON-based file system database (`JsonDB`)
- Data stored in `data/` directory:
  - `batches.json`: Stores batch information
  - `students.json`: Stores student information
- Automatic data persistence with file system synchronization
- Singleton pattern for consistent data access

### API Routes

- RESTful API implementation using Next.js API routes
- Structured route handling for:
  - Batch management (`/api/batches`)
  - Student management (`/api/batches/[batchId]/students`)
  - Dashboard statistics (`/api/dashboard/stats`)
- Proper error handling and response formatting

### State Management

- React Context-based state management
- Separate providers for different concerns:
  - `BatchesProvider`: Manages batch-related state
  - `StudentsProvider`: Manages student-related state
- Real-time data synchronization across components

### Type Safety

- Comprehensive TypeScript implementation
- Zod schemas for runtime validation:
  - Request/response validation
  - Form data validation
  - API payload validation

### UI Components

- Reusable component library built with shadcn/ui
- Consistent styling with Tailwind CSS
- Responsive design for all screen sizes
- Modal-based forms for data entry
- Progress indicators and loading states

## 🌟 Features

### Dashboard

- Overview statistics
- Performance metrics
- Student distribution
- Batch distribution
- Real-time updates

### Batch Management

- Create new batches
- View batch details
- Update batch information
- Delete batches
- Filter batches by:
  - Class (11th/12th)
  - Status (Active/Inactive)
  - Subject

### Student Management

- View students in batches
- Filter students by:
  - Performance level
  - Search by name
- Track student attendance
- Monitor performance

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/de5ash1zh/leadlly.admin.web.git
   cd leadlly.admin.web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📝 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🔄 Workflow

1. **Development Process**

   - Feature branches for new development
   - TypeScript for type safety
   - Zod for runtime validation
   - Consistent code formatting with Prettier
   - Component-driven development

2. **Data Flow**

   - API requests through service layer
   - Data persistence in JSON files
   - State management through Context
   - Real-time updates across components

3. **Deployment**
   - Build optimization
   - Static file serving
   - API routes deployment
   - Environment configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Devashish** - _Initial work_ - [de5ash1zh](https://github.com/de5ash1zh)

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TypeScript](https://www.typescriptlang.org/)
