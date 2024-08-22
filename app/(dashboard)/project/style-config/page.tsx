"use client";
import Link from "next/link";
import React, { useState, useEffect, ChangeEventHandler } from "react";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import Button from "@/components/Button";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function Page() {
  const selectedProject = Cookies.get("project");
  const [formData, setFormData] = useState({
    project_id: "",
    queue_page_style: "base",
    queue_page_base_color: "",
    queue_page_title: "",
    image: null,
    file: null,
  });

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
          console.log({ data });
          setFormData({
            project_id: data.id,
            queue_page_style: data.configuration.queue_page_style,
            queue_page_base_color: data.configuration.queue_page_base_color,
            queue_page_title: data.configuration.queue_page_title,
            image: null,
            file: null,
          });
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    if (selectedProject) {
      fetchProjectDetails();
    }
  }, [selectedProject]);

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value, files } = e.target as any;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    try {
      const auth = Cookies.get("auth");
      if (!auth) {
        console.error("No authorization token found");
        return;
      }
      const authParsed = JSON.parse(auth);
      const { token } = authParsed;

      const formDataToSend = new FormData();
      formDataToSend.append("project_id", formData.project_id);
      if (formData.image) formDataToSend.append("image", formData.image);
      if (formData.file) {
        formDataToSend.append("file", formData.file);
      } else {
        formDataToSend.append("queue_page_style", formData.queue_page_style);
        formDataToSend.append(
          "queue_page_base_color",
          formData.queue_page_base_color
        );
        formDataToSend.append("queue_page_title", formData.queue_page_title);
      }

      const response = await fetch(
        `https://api.${baseUrl}/bc/dashboard/project/style`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
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
          <h1 className="text-3xl font-bold mb-5">
            Project Style Configuration
          </h1>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
                  <span className="label-text">Queue Page Title</span>
                </div>
                <input
                  type="text"
                  name="queue_page_title"
                  value={formData.queue_page_title}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Image</span>
                </div>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">HTML File</span>
                </div>
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  accept=".html"
                  className="file-input file-input-bordered w-full"
                />
              </label>
            </div>
            {!formData.file && (
              <>
                <div className="mb-4">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Queue Page Style</span>
                    </div>
                    <select
                      name="queue_page_style"
                      value={formData.queue_page_style}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                    >
                      <option value="base">Base</option>
                      <option value="custom">Custom</option>
                    </select>
                  </label>
                </div>
                <div className="mb-4">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Queue Page Base Color</span>
                    </div>
                    <input
                      type="color"
                      name="queue_page_base_color"
                      value={formData.queue_page_base_color}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                    />
                  </label>
                </div>
              </>
            )}
            <div className="col-span-1 md:col-span-2 flex justify-end">
              <Button type="submit" title="Submit" variant="btn_orange" full />
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </>
  );
}
