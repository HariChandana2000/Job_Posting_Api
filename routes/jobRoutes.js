const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const jobsFilePath = path.join(__dirname, "../data/jobs.json");

// Helper function to read jobs from the file
const readJobsFromFile = () => {
  try {
    const data = fs.readFileSync(jobsFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading jobs file:", err);
    return [];
  }
};

// Helper function to write jobs to the file
const writeJobsToFile = (jobs) => {
  try {
    fs.writeFileSync(jobsFilePath, JSON.stringify(jobs, null, 2));
  } catch (err) {
    console.error("Error writing to jobs file:", err);
  }
};

// Create a Job
router.post("/jobs", (req, res) => {
  const jobs = readJobsFromFile();
  const jobId = jobs.length > 0 ? jobs[jobs.length - 1].id + 1 : 1;

  const job = {
    id: jobId,
    title: req.body.title,
    description: req.body.description,
    company: req.body.company,
    location: req.body.location,
    salary: req.body.salary,
    postedAt: new Date(),
  };
  jobs.push(job);
  writeJobsToFile(jobs);
  res.status(201).json(job);
});

// Get All Jobs
router.get("/jobs", (req, res) => {
  const jobs = readJobsFromFile();
  res.json(jobs);
});

// Get Job by ID
router.get("/jobs/:id", (req, res) => {
  const jobs = readJobsFromFile();
  const job = jobs.find((j) => j.id === parseInt(req.params.id));
  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ message: "Job not found" });
  }
});

// Update a Job
router.put("/jobs/:id", (req, res) => {
  const jobs = readJobsFromFile();
  const jobIndex = jobs.findIndex((j) => j.id === parseInt(req.params.id));
  if (jobIndex !== -1) {
    const job = jobs[jobIndex];
    job.title = req.body.title || job.title;
    job.description = req.body.description || job.description;
    job.company = req.body.company || job.company;
    job.location = req.body.location || job.location;
    job.salary = req.body.salary || job.salary;
    writeJobsToFile(jobs);
    res.json(job);
  } else {
    res.status(404).json({ message: "Job not found" });
  }
});

// Delete a Job
router.delete("/jobs/:id", (req, res) => {
  const jobs = readJobsFromFile();
  const jobIndex = jobs.findIndex((j) => j.id === parseInt(req.params.id));
  if (jobIndex !== -1) {
    jobs.splice(jobIndex, 1);
    writeJobsToFile(jobs);
    res.json({ message: "Deleted Job" });
  } else {
    res.status(404).json({ message: "Job not found" });
  }
});

module.exports = router;
