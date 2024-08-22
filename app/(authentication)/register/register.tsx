"use client";

import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Button from "@/components/Button";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function Register() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    retype_password: "",
  });
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const [visibleRetypePassword, setVisibleRetypePassword] =
    useState<boolean>(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [retypePasswordTouched, setRetypePasswordTouched] =
    useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password" || name === "retype_password") {
      setPasswordMatch(
        formData.password === value || formData.retype_password === value
      );
    }

    if (name === "retype_password") {
      setRetypePasswordTouched(true);
    }
  };

  const handleVisibilityPassword = () => {
    setVisiblePassword(!visiblePassword);
  };

  const handleVisibilityRetypePassword = () => {
    setVisibleRetypePassword(!visibleRetypePassword);
  };

  const register = async (e: SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await axios.post(
        `https://api.${baseUrl}/bc/dashboard/auth/register`,
        formData
      );
      if (res.status === 201) {
        router.push("/login"); // Redirect to login page after successful registration
      }
    } catch (err) {
      if (err instanceof Error) {
        setError((err as any)?.response?.data?.error || err.message);
        toast.error((err as any)?.response?.data?.error || err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {error && (
        <div className="alert alert-error shadow-lg mb-4">
          <div>
            <span>{error}</span>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={() => setError("")}>
            ✕
          </button>
        </div>
      )}
      <form onSubmit={register} className="mt-4">
        <div className="flex flex-col mb-4">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>

            <input
              type="text"
              name="name"
              required
              disabled={submitting}
              placeholder="Name"
              aria-label="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="email"
              name="email"
              required
              disabled={submitting}
              placeholder="Email"
              aria-label="Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              className="w-full"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type={visiblePassword ? "text" : "password"}
              name="password"
              required
              disabled={submitting}
              placeholder="Password"
              aria-label="Password"
              value={formData.password}
              onChange={handleChange}
              onCopy={(e) => e.preventDefault()}
              onDrag={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              className="w-full"
            />
            <button type="button" onClick={handleVisibilityPassword}>
              {visiblePassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#5f6368"
                >
                  <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#5f6368"
                >
                  <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                </svg>
              )}
            </button>
          </label>
        </div>
        <div className="mb-4">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type={visibleRetypePassword ? "text" : "password"}
              name="retype_password"
              required
              disabled={submitting}
              placeholder="Confirm Password"
              aria-label="Confirm Password"
              value={formData.retype_password}
              onChange={handleChange}
              onCopy={(e) => e.preventDefault()}
              onDrag={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              className="w-full"
            />

            <button type="button" onClick={handleVisibilityRetypePassword}>
              {visibleRetypePassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#5f6368"
                >
                  <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#5f6368"
                >
                  <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                </svg>
              )}
            </button>
          </label>
          {retypePasswordTouched && !passwordMatch && (
            <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
          )}
        </div>

        <div className="w-full mb-4">
          <Button
            type="submit"
            title="Create Account"
            disabled={submitting}
            variant="btn_orange"
            full
          />
        </div>

        {/* <div className="w-full">
          <Link href="/login">
            <Button type="button" title="Login" variant="btn_dark_green" full />
          </Link>
        </div> */}
      </form>
      <Toaster />
    </>
  );
}
