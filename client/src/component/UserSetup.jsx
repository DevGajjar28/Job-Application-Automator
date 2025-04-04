import axios from "axios";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserSetup = () => {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    skills: "",
    location: "",
    jobType: "Remote",
    resume: null,
    coverLetter: null,
    // name: "Dev",
    email: "dgajjar432@gmail.com",
    // phone: "1223456785",
    alerts: false,
    frequency: "Daily",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0], // Save the first file
    });
  };

  const submitPreferences = async (data) => {
    const formData = new FormData();

    // Add all fields to formData
    for (const key in data) {
      if (key === "resume" || key === "coverLetter") {
        // Only append if file exists
        if (data[key]) formData.append(key, data[key]);
      } else {
        // Convert boolean to string for proper transmission
        if (typeof data[key] === "boolean") {
          formData.append(key, data[key].toString());
        } else {
          formData.append(key, data[key] || "");
        }
      }
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/preferences",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(error.response.data.message || "Server error");
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error("No response from server");
      } else {
        // Something happened in setting up the request
        throw new Error("Error setting up request");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("Form Data Before Validation:", formData); // Check all data
    // Trim the values to remove whitespace
    const trimmedData = {
      role: formData.role.trim(),
      experience: formData.experience.trim(),
      email: formData.email.trim(),
      skills: formData.skills.trim(),
      location: formData.location.trim(),
      // salaryRange: formData.salaryRange.trim(),
    };

    // Validate required fields
    if (!trimmedData.role || !trimmedData.experience || !trimmedData.email) {
      toast.error("Please fill out all required fields.");
      return;
    }

    // Optional: Validate email format (basic regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const response = await submitPreferences(formData);
      toast.success("Preferences saved successfully!");
      console.log("Preferences saved successfully:", response);
    } catch (error) {
      toast.error("Error saving preferences. Please try again.");
      console.error("Error submitting preferences:", error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-6 shadow-lg rounded-md"
      >
        {/* Role */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Role/Position
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g., Frontend Developer"
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        {/* Experience */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Experience Level
          </label>
          <select
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="">Select Experience</option>
            <option value="0-1">0-1 year</option>
            <option value="1-2">1-2 years</option>
            <option value="2+">2+ years</option>
          </select>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Skills</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., React, JavaScript"
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Remote, Ahmedabad"
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        {/* Resume Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Upload Resume
          </label>
          <input
            type="file"
            name="resume"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        {/* Cover Letter Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Upload Cover Letter (Optional)
          </label>
          <input
            type="file"
            name="coverLetter"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        {/* Notifications */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="alerts"
              checked={formData.alerts}
              onChange={handleChange}
              className="mr-2"
            />
            Receive job alerts
          </label>
        </div>

        {/* Frequency */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Application Frequency
          </label>
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserSetup;
