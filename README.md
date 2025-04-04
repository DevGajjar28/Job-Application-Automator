# 💼 Job Application Automator

Automate your job applications by customizing resumes and cover letters, scraping job listings, and sending applications via email — all with tracking and a user dashboard.

---

## 🚀 Features

- 🎯 Smart resume & cover letter personalization
- 🌐 Job scraping from portals (LinkedIn, Indeed)
- 📩 Automated email sending with tracking
- 📊 Dashboard for job status overview
- 🧪 Fully testable workflow
- 🌍 Easily deployable frontend & backend

---

## 🧑‍💻 Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB 
- **Scraping**: Puppeteer 
- **Email**: Nodemailer 


## ✅ 1. Enhance and Test the Frontend Form

- **Validate User Inputs**:
  - Ensure all required fields are filled before submission.
  - Provide clear error messages (e.g., "Resume upload is required").

- **Dynamic Features**:
  - Add skill tags (multi-select with pre-defined options).
  - Use a slider for salary expectations and display the range dynamically.

- **Styling**:
  - Make the form responsive using Tailwind CSS breakpoints (`sm`, `md`, `lg`).

---

## ⚙️ 2. Backend Integration

- **Choose a Backend**:
  - Use **Node.js** with Express, **Django**, or any backend of your choice.

- **Set Up Database**:
  - Store user preferences and uploaded templates.

```json
{
  "userId": "123",
  "preferences": {
    "role": "Frontend Developer",
    "experience": "0-1",
    "skills": ["React", "JavaScript"],
    "jobPortals": ["LinkedIn", "Indeed"],
    "salary": [4, 8],
    "workType": "Full-time"
  },
  "resume": "path/to/resume.pdf",
  "coverLetter": "path/to/cover_letter.pdf",
  "emailSettings": {
    "email": "user@example.com",
    "subject": "Application for {jobTitle} at {companyName}",
    "signature": "Thanks,\nYour Name"
  }
}
 4. Job Scraping
Use Puppeteer / APIs to scrape jobs

Filter based on preferences

Save to DB

📧 5. Email Sending & Tracking
Use Nodemailer or SendGrid

Add tracking pixel

Log open/click events
