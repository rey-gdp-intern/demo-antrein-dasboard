import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const api = axios.create({
  baseURL: `https://api.${baseUrl}/bc/dashboard/auth`,
});

export const login = async (email: string, password: string) => {
  const response = await api.post("/login", { email, password });
  return response.data;
};

export const register = async (
  email: string,
  name: string,
  password: string,
  retype_password: string
) => {
  const response = await api.post("/register", {
    email,
    name,
    password,
    retype_password,
  });
  return response.data;
};
