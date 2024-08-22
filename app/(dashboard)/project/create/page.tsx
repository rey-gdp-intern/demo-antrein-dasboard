"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import Button from "@/components/Button";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function Page() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const auth = Cookies.get("auth");
      if (!auth) {
        return;
      }
      const authParsed = JSON.parse(auth);
      const { token } = authParsed;
      const response = await fetch(
        `https://api.${baseUrl}/bc/dashboard/project`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Project created successfully");
        router.push("/project/config");
      } else {
        toast.error((data as any)?.error);
      }
    } catch (error) {
      console.log({ error });
      toast.error(
        (error as any)?.response?.data?.error || (error as any).message
      );
    }
  };

  return (
    <>
      <div className="flex justify-center mt-6">
        <div className="w-full max-w-5xl">
          <h1 className="text-3xl font-bold mb-5">Create Project</h1>
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
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Name</span>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                />
              </label>
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end">
              <Button
                type="submit"
                title="Create Project"
                variant="btn_orange"
                full
              />
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </>
  );
}
