# Contribution Guidelines

We are thrilled to welcome contributors to **Leadlly**! Below are the guidelines to help you contribute efficiently.

## 📚 Getting Started

### Prerequisites:

- **Node.js** (>= 14.x.x)
- **npm** or **yarn** (package manager)

### Installation:

1. **Fork the Repository:**

   - Click the "Fork" button in the top-right corner of the page to create your own copy of the repository.
2. **Clone the Forked Repository:**

   ```bash
   git clone https://github.com/{your-username}/leadlly.admin.web.git
   cd leadlly.admin.web
   ```
3. **Install dependencies**:

   ```bash
   npm install
   ```
4. **Run the application**:

   ```bash
   npm run dev
   ```
5. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How to Contribute

We welcome contributions! If you'd like to help improve the Leadlly Mentor Platform, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes.
4. Open a pull request and describe your changes.

## 🐛 Reporting Issues

If you encounter any issues while using the platform, please feel free to open an issue on the repository. Provide as much detail as possible to help us address the problem quickly.

## 🛡️ Security

If you find any security vulnerabilities, please report them privately to [business@leadlly.in](mailto:business@leadlly.in). We take security issues seriously and will address them promptly.

## 📄 License

This project is licensed under the MIT License. See the [`LICENSE`](./LICENSE) file for more details.

## 🎉 Hacktoberfest Participation:

- Contributions should be meaningful and address an issue or feature request.
- Avoid creating spam or low-quality pull requests, as these will not be accepted.
- Tag your pull requests with "Hacktoberfest" to ensure they count toward Hacktoberfest.

## 📝 Code Of Conduct:

- **Be Respectful**: Always be courteous and respectful when interacting with other contributors and maintainers.
- **Collaborate**: Help others by reviewing code, suggesting improvements, or answering questions.
- **Keep Learning**: Open source is a great way to learn and improve your skills, so ask questions and engage with the community.
- **Contribution Process**:
  - To indicate you're working on an issue, comment "I am working on this issue." Our team will verify your activity. If there is no response, the issue may be reassigned.
  - Please do not claim an issue that is already assigned to someone else.

## 📞 Contact

For any further questions or support, reach out to us at:

- **Email**: [support@leadlly.in](mailto:support@leadlly.in)
- **Website**: [Leadlly.in](https://leadlly.in)


# Leadlly Admin Web

This project is a web application for managing teachers and their performance metrics.

## Folder Structure

```
leadlly.admin.web/
├── src/
│   ├── app/
│   │   ├── (root)/
│   │   │   ├── teachers/
│   │   │   │   ├── page.tsx
│   │   │   ├── teacher/
│   │   │   │   ├── [teacherId]/
│   │   │   │   │   ├── _components/
│   │   │   │   │   │   ├── TeacherHeader.tsx
│   │   │   │   │   │   ├── TeacherPerformance.tsx
│   │   │   │   │   │   ├── TeacherStats.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   ├── styles/
│   │   ├── globals.css
│   ├── utils/
│   │   ├── api.ts
│   │   ├── helpers.ts
├── public/
│   ├── placeholder-teacher.jpg
├── README.md
├── package.json
├── tsconfig.json
```

## Routes

### Teachers Page

- **Path:** `/teachers`
- **Component:** `TeachersPage`
- **Description:** Displays a list of teachers with search and filter functionality.

### Teacher Details Page

- **Path:** `/teacher/[teacherId]`
- **Components:**
  - `TeacherHeader`: Displays the teacher's basic information.
  - `TeacherPerformance`: Shows performance metrics with charts.
  - `TeacherStats`: Displays statistical data about the teacher.

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/leadlly.admin.web.git
   ```
2. **Install dependencies:**

   ```bash
   cd leadlly.admin.web
   npm install
   ```
3. **Run the development server:**

   ```bash
   npm run dev
   ```
4. **Open your browser:**
   Navigate to `http://localhost:3000` to see the application in action.

## Technologies Used

- **React:** A JavaScript library for building user interfaces.
- **Next.js:** A React framework for server-side rendering and static site generation.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Recharts:** A charting library built on React components.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.
