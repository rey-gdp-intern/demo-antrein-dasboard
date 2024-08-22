"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import Button from "@/components/Button";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function Page() {
  const selectedProject = Cookies.get("project");
  const [health, setHealth] = useState(false);
  const [formData, setFormData] = useState({
    project_id: "",
    threshold: 0,
    session_time: 0,
    host: "",
    base_url: "",
    max_users_in_queue: 0,
    queue_start: "",
    queue_end: "",
  });

  const checkProjectHealth = async () => {
    try {
      const auth = Cookies.get("auth");
      if (!auth) {
        console.error("No authorization token found");
        return;
      }
      const authParsed = JSON.parse(auth);
      const { token } = authParsed;

      const response = await fetch(
        `https://api.${baseUrl}/bc/dashboard/project/health/${selectedProject}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();

      if (jsonData.data && jsonData.data.healthiness) {
        setHealth(true);
      } else {
        setHealth(false);
      }
    } catch (error) {
      console.error("Error fetching project health:", error);
      setHealth(false);
    }
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const auth = Cookies.get("auth");
        if (!auth) {
          console.error("No authorization token found");
          return;
        }
        const authParsed = JSON.parse(auth);
        const { token } = authParsed;

        const response = await fetch(
          `https://api.${baseUrl}/bc/dashboard/project/detail/${selectedProject}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const jsonData = await response.json();

        const data = jsonData.data;
        if (data) {
          setFormData({
            project_id: data.id,
            threshold: data.configuration.threshold,
            session_time: data.configuration.session_time,
            host: data.configuration.host,
            base_url: data.configuration.base_url,
            max_users_in_queue: data.configuration.max_users_in_queue,
            queue_start: data.configuration.queue_start,
            queue_end: data.configuration.queue_end,
          });
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    if (selectedProject) {
      fetchProjectDetails();

      const interval = setInterval(() => {
        checkProjectHealth();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [selectedProject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const auth = Cookies.get("auth");
      if (!auth) {
        console.error("No authorization token found");
        return;
      }
      const authParsed = JSON.parse(auth);
      const { token } = authParsed;

      const response = await fetch(
        `https://api.${baseUrl}/bc/dashboard/project/config`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            session_time: Number(formData.session_time),
            threshold: Number(formData.threshold),
            max_users_in_queue: Number(formData.max_users_in_queue),
            queue_start: formatDate(formData.queue_start),
            queue_end: formatDate(formData.queue_end),
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Project updated successfully");
      } else {
        toast.error((data as any)?.error);
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-6">
        <div className="w-full max-w-5xl">
          <h1 className="text-3xl font-bold mb-5">Project Configuration</h1>
          <div className="flex justify-end items-center mb-4">
            <div className="p-2 border border-gray-300 rounded flex items-center">
              <span className="mr-2">Project Deployment:</span>
              <span
                className={`inline-block w-4 h-4 rounded-full ${
                  health ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="mb-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Project ID</span>
                </div>
                <input
                  type="text"
                  name="project_id"
                  value={formData.project_id}
                  onChange={handleChange}
                  required
                  readOnly
                  className="input input-bordered w-full"
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Threshold</span>
                </div>
                <input
                  type="number"
                  name="threshold"
                  value={formData.threshold}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Session Time</span>
                </div>
                <input
                  type="number"
                  name="session_time"
                  value={formData.session_time}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Host</span>
                </div>
                <input
                  type="text"
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Base URL</span>
                </div>
                <input
                  type="text"
                  name="base_url"
                  value={formData.base_url}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Max Users In Queue</span>
                </div>
                <input
                  type="number"
                  name="max_users_in_queue"
                  value={formData.max_users_in_queue}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Queue Start Time</span>
                </div>
                <input
                  type="datetime-local"
                  name="queue_start"
                  value={formData.queue_start}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Queue End Time</span>
                </div>
                <input
                  type="datetime-local"
                  name="queue_end"
                  value={formData.queue_end}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                />
              </label>
            </div>

            <div className="col-span-1 md:col-span-3 flex justify-end">
              <Button type="submit" title="Submit" variant="btn_orange" full />
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </>
  );
}
