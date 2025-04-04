// Import Required Packages
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const FormData = require("form-data");
const express = require("express");
const { sendJobApplicationEmail } = require("../emailService");

const app = express();
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Save to the uploads folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

// File Filter to Accept Only PDF and Word Documents
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only PDF and Word documents are allowed."), false);
    }
};

// Multer Upload Middleware with Size Limit of 5MB
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const fetchJobListings = async (preferences) => {
    try {
        const response = await axios.get("https://internships-api.p.rapidapi.com/active-jb-7d", {
            params: {
                role: preferences.role,
                location: preferences.location,
            },
            headers: {
                "X-RapidAPI-Host": "internships-api.p.rapidapi.com",
                "X-RapidAPI-Key": "29f6418ee2mshf1b7c52b5ba16e0p177471jsnb65b6882360f",
            },
        });

        console.log("Raw API Response:", JSON.stringify(response.data, null, 2));

        if (Array.isArray(response.data)) {
            return response.data.filter(job =>
                job.title.toLowerCase().includes(preferences.role.toLowerCase())
            );
        } else if (response.data && Array.isArray(response.data.jobs)) {
            return response.data.jobs.filter(job =>
                job.title.toLowerCase().includes(preferences.role.toLowerCase())
            );
        } else {
            console.error("Unexpected response structure:", response.data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching job listings:", error.message);
        throw new Error(`Unable to fetch job listings: ${error.message}`);
    }
};


const applyToJob = async (job, userDetails, resumePath, coverLetterPath) => {
    try {
        // Existing job application logic
        const jobApplicationResult = {
            success: true,
            job: {
                title: job.title,
                company: job.organization,
                location: job.locations_derived?.join(', '),
                applicationUrl: job.url,
                datePosted: job.date_posted,
                description: job.description,
                employmentType: job.employment_type
            },
            message: "Job information retrieved for manual application"
        };

        // Send email with job application
        const emailResult = await sendJobApplicationEmail(
            {
                title: job.title,
                company: job.organization,
                location: job.locations_derived?.join(', '),
                contactEmail: job.contactEmail, // You might need to extract this from job data
                datePosted: job.date_posted,
                employmentType: job.employment_type
            },
            { email: userDetails.email },
            resumePath,
            coverLetterPath
        );

        // Combine job application and email results
        return {
            ...jobApplicationResult,
            emailSent: emailResult.success,
            emailError: emailResult.error
        };
    } catch (error) {
        // Error handling
        console.error(`Error processing job at ${job.organization}:`, error.message);
        return {
            success: false,
            job: {
                title: job.title,
                company: job.organization,
                url: job.url
            },
            error: error.message
        };
    }
};

router.post(
    "/preferences",
    upload.fields([
        { name: "resume", maxCount: 1 },
        { name: "coverLetter", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            let { role, location, email } = req.body;

            if (!email) {
                return res.status(400).json({ message: "Email is required." });
            }
            // Validation logging
            console.log("Received request body:", req.body);
            console.log("Received files:", req.files);

            // Trim extra spaces
            role = role ? role.trim() : "";
            location = location ? location.trim() : "";

            const resumePath = req.files?.resume?.[0]?.path || null;
            const coverLetterPath = req.files?.coverLetter?.[0]?.path || null;

            // Validate required fields
            const missingFields = [];
            if (!role) missingFields.push("role");
            if (!email) missingFields.push("email");
            if (!resumePath) missingFields.push("resume");

            if (missingFields.length > 0) {
                return res.status(400).json({
                    message: "Missing required fields",
                    missingFields
                });
            }

            // Fetch matching jobs
            const preferences = { role, location };
            console.log("Searching with preferences:", preferences);

            const matchingJobs = await fetchJobListings(preferences);
            console.log(`Retrieved ${matchingJobs.length} matching jobs`);

            // In the /preferences route, update the response section:
            if (!matchingJobs.length) {
                return res.status(200).json({
                    message: "No matching jobs found.",
                    searchCriteria: preferences
                });
            }

            // Process jobs and get application information
            const results = await Promise.all(
                matchingJobs.map((job) => applyToJob(job, { email }, resumePath, coverLetterPath))
            );

            // Send back all jobs with their application links
            res.status(200).json({
                message: "Job listings retrieved successfully",
                searchCriteria: preferences,
                totalJobsFound: matchingJobs.length,
                jobs: results.map(result => ({
                    title: result.job.title,
                    company: result.job.company,
                    location: result.job.location,
                    applicationUrl: result.job.applicationUrl,
                    datePosted: result.job.datePosted,
                    employmentType: result.job.employmentType,
                    success: result.success,
                    message: result.message || result.error
                }))
            });
        } catch (error) {
            console.error("Error in /preferences route:", error);
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
                searchCriteria: { role, location }
            });
        }
    }
);

// Use the router for handling the job-related requests
app.use("/api", router);

// Export the router
module.exports = router;
