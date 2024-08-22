// import { Col, Row } from 'react-bootstrap';
import Link from "next/link";
import RegisterForm from "./register";
import Button from "../../../components/Button";
import "../../globals.css";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md bg-green-90 shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white text-center">Register</h2>
        <p className="mt-2 text-center text-gray-400">Create your account</p>
        <RegisterForm />
        <p className="mt-2 text-center text-white">
          Already have an account? <a href="/register" className="link link-info">Log in</a>
        </p>
      </div>
    </div>
  );
}
