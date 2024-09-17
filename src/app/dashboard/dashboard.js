"use client";

import { useEffect, useState } from "react";
import fetch from "isomorphic-fetch";
import Loading from "./Loading"; // Loading animation component

const Dashboard = ({ jobsData }) => {
  const [jobs, setJobs] = useState(jobsData);
  const [loading, setLoading] = useState(false);
  const [viewJob, setViewJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [createJob, setCreateJob] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", description: "" });

  // Function to refresh data
  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/get", {
        method: "GET",
        credentials: "include", // Include credentials with the request
      });
      const data = await res.json();
      if (data) {
        setJobs(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply to a job
  const applyToJob = async (jobId) => {
    try {
      setLoading(true);
      await fetch(`/api/apply-job/${jobId}`, {
        method: "POST",
        credentials: "include", // Include credentials with the request
      });
      refreshData(); // Refetch data to update UI
      setApplyJob(null);
    } catch (error) {
      console.error("Error applying to job:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new job
  const createNewJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials with the request
        body: JSON.stringify(newJob),
      });
      refreshData();
      setCreateJob(false);
    } catch (error) {
      console.error("Error creating job:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobs) {
      refreshData();
    }
  }, [jobs]);

  if (loading) return <Loading />;

  if (!jobs) return <p>No data available</p>; // Handle the case where data is not available

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4 h-screen">
        {/* Available Jobs Section */}
        <div className="flex-grow border p-4 rounded-lg h-full">
          <h2 className="text-xl font-semibold mb-2">
            Available Jobs ({jobs.availableJobs?.length})
          </h2>
          {jobs.availableJobs?.length ? (
            jobs.availableJobs.map((job) => (
              <div key={job._id} className="p-4 border rounded-lg mb-2">
                <h3 className="font-bold">{job.title}</h3>
                <p>{job.description}</p>
                <button
                  className="bg-blue-500 text-white p-2 mt-2"
                  onClick={() => setViewJob(job)}
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p>No available jobs</p>
          )}
        </div>

        {/* Applied Jobs Section */}
        <div className="flex-grow border p-4 rounded-lg h-full">
          <h2 className="text-xl font-semibold mb-2">
            Applied Jobs ({jobs.appliedJobs?.length})
          </h2>
          {jobs.appliedJobs?.length ? (
            jobs.appliedJobs.map((job) => (
              <div key={job._id} className="p-4 border rounded-lg mb-2">
                <h3 className="font-bold">{job.title}</h3>
                <p>{job.description}</p>
              </div>
            ))
          ) : (
            <p>No applied jobs</p>
          )}
        </div>

        {/* Created Jobs Section */}
        <div className="flex-grow border p-4 rounded-lg h-full">
          <h2 className="text-xl font-semibold mb-2">
            Created Jobs ({jobs.createdJobs?.length})
          </h2>
          {jobs.createdJobs?.length ? (
            jobs.createdJobs.map((job) => (
              <div key={job._id} className="p-4 border rounded-lg mb-2">
                <h3 className="font-bold">{job.title}</h3>
                <p>{job.description}</p>
                <p>Created by: {job.user.name}</p>
              </div>
            ))
          ) : (
            <p>No created jobs</p>
          )}
        </div>
      </div>

      <button
        className="bg-green-500 text-white p-2 mt-4"
        onClick={refreshData}
      >
        Refresh
      </button>

      <button
        className="bg-yellow-500 text-white p-2 mt-4 ml-4"
        onClick={() => setCreateJob(true)}
      >
        Create New Job
      </button>

      {/* Job Detail Modal */}
      {viewJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">{viewJob.title}</h2>
            <p>{viewJob.description}</p>
            <button
              className="bg-blue-500 text-white p-2 mt-2"
              onClick={() => setApplyJob(viewJob._id)}
            >
              Apply Job
            </button>
            <button
              className="text-red-500 p-2 mt-2"
              onClick={() => setViewJob(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Apply Job Form */}
      {applyJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">Apply for the Job</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyToJob(applyJob);
              }}
            >
              <input
                type="text"
                placeholder="Name"
                className="border p-2 mb-2 w-full"
              />
              <input
                type="email"
                placeholder="Email"
                className="border p-2 mb-2 w-full"
              />
              <button type="submit" className="bg-green-500 text-white p-2">
                Submit Application
              </button>
            </form>
            <button
              className="text-red-500 p-2 mt-2"
              onClick={() => setApplyJob(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Create Job Form */}
      {createJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">Create New Job</h2>
            <form onSubmit={createNewJob}>
              <input
                type="text"
                placeholder="Job Title"
                value={newJob.title}
                onChange={(e) =>
                  setNewJob({ ...newJob, title: e.target.value })
                }
                className="border p-2 mb-2 w-full"
                required
              />
              <textarea
                placeholder="Job Description"
                value={newJob.description}
                onChange={(e) =>
                  setNewJob({ ...newJob, description: e.target.value })
                }
                className="border p-2 mb-2 w-full"
                required
              />
              <button type="submit" className="bg-green-500 text-white p-2">
                Submit Job
              </button>
            </form>
            <button
              className="text-red-500 p-2 mt-2"
              onClick={() => setCreateJob(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch("/api/posts/get", {
    method: "GET",
    credentials: "include", // Include credentials with the request
  });
  const data = await res.json();

  return {
    props: {
      jobsData: data, // Pass data to page component
    },
  };
}

export default Dashboard;
