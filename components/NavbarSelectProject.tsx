"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Button from "./Button";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const NavbarSelectProject = () => {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectName, setSelectedProjectName] =
    useState("Select Project");
  const [selectedProjectId, setSelectedProjectId] = useState(
    Cookies.get("project")
  );
  const router = useRouter();
  const modalRef = useRef<HTMLDialogElement>(null);

  const fetchProjects = async () => {
    try {
      const auth = Cookies.get("auth");
      if (!auth) {
        return;
      }
      const authParsed = JSON.parse(auth);
      const { token } = authParsed;
      const response = await fetch(
        `https://api.${baseUrl}/bc/dashboard/project/list`,
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
      const data = await response.json();
      setProjects(data.data.projects);
      if (selectedProjectId) {
        const selectedProject = data?.data?.projects?.find(
          (p: any) => p.id === selectedProjectId
        );
        if (selectedProject) {
          setSelectedProjectName(selectedProject.name);
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleShow = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const handleClose = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  const handleNewProject = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
    router.push("/project/create");
  };

  const handleProjectSelect = (projectName: string, projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedProjectName(projectName);
    Cookies.set("project", projectId);
    handleClose();
    router.refresh();
  };

  return (
    <>
      <button className="btn mr-4 pr-1" onClick={handleShow}>
        {selectedProjectName}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
        >
          <path d="M480-360 280-560h400L480-360Z" />
        </svg>
      </button>

      <dialog id="my_modal_2" className="modal open" ref={modalRef}>
        <div
          className="modal-box hide-scrollbar"
          style={{ maxHeight: "500px" }}
        >
          <h3 className="font-bold text-lg mb-2">Select Project</h3>
          <div
            style={{ height: "300px", overflowY: "auto" }}
            className="hide-scrollbar"
          >
            <table className="table">
              <thead>
                <tr
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    background: "white",
                  }}
                >
                  <th></th>
                  <th>Project Name</th>
                  <th>Project ID</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project: any, index) => (
                  <tr
                    key={index}
                    className="cursor-pointer hover:bg-base-200"
                    onClick={() =>
                      handleProjectSelect(project.name, project.id)
                    }
                  >
                    <th>{index + 1}</th>
                    <td>{project.name}</td>
                    <td>{project.id}</td>
                    <th>
                      {selectedProjectId === project.id && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="inline-block w-6 h-6 stroke-current"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="modal-action">
            <Button
              type="button"
              title="Cancel"
              variant="btn_dark_green"
              onclick={handleClose}
              full
            />
            <Button
              type="button"
              title="New Project"
              variant="btn_orange"
              onclick={handleNewProject}
              full
            />
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NavbarSelectProject;
