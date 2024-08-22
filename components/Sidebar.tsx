import React from "react";
import Navbar from "./Navbar";
import Link from "next/link";
import Image from "next/image";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-space-evenly bg-base-200">
          {children}
        </div>
      </div>
      <div className="drawer-side border-r">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="hidden lg:flex items-center min-h-16 justify-center">
          <Link href="/" className="">
            <Image src="/antrein-logo.svg" alt="logo" width={74} height={29} />
          </Link>
        </div>
        <ul className="menu p-4 w-80  min-h-full lg:min-h-0 bg-white text-base-content">
          {/* Sidebar content here */}
          <li>
            <a href="/">
              Analytics
            </a>
          </li>
          <li>
            <details open>
              <summary>Projects</summary>
              <ul>
                <li>
                  <a href="/project/config">Configuration</a>
                </li>
                <li>
                  <a href="/project/style-config">Style</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
