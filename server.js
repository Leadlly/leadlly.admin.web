const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

const batches = [
  { id: "omega-11", name: "Omega", subject: "Chemistry, Physics, Biology", totalStudents: 120, teacher: "Dr. Sarah Wilson" },
];

const students = [
  { id: "1", name: "Abhinav Mishra", class: "11", level: 90, batchId: "omega-11" },
];

app.get('/api/batches', (req, res) => {
  res.json(batches);
});

app.get('/api/batches/:batchId/students', (req, res) => {
  const batchId = req.params.batchId;
  const batchStudents = students.filter(student => student.batchId === batchId);
  res.json(batchStudents);
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});