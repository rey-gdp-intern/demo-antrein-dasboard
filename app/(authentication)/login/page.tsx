// import { Col, Row } from 'react-bootstrap';
import Link from "next/link";
import LoginForm from "./login";
import Button from "../../../components/Button";
import "../../globals.css";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-green-90 shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white text-center">Login</h2>
        <p className="mt-2 text-center text-gray-400">Access your account</p>
        <LoginForm />
        <p className="mt-2 text-center text-white">
          Don't have an account? <a href="/register" className="link link-info">Sign up</a>
        </p>
      </div>
    </div>
  );
}
