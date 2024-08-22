import type { Metadata } from "next";
import "../globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Antrein - Dashboard",
  description: "Antrein offers an advanced virtual waiting room service designed to manage high traffic volumes efficiently. Ensure a smooth and fair customer experience with real-time queue management and detailed analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Sidebar>
             {children}
        </Sidebar>
      </body>
    </html>
  );
}
