import { Request, Response } from "express";

// 1. IMPORT DUMMY DATA
// Using the complete Project data set (project.csv)

const DUMMY_PROJECTS = [
    { 
        id: 1, 
        name: "Formula 1", 
        description: "A space exploration project.", 
        startDate: "2023-01-01T00:00:00Z", 
        endDate: "2023-12-31T00:00:00Z" 
    },
    { 
        id: 3, 
        name: "Cricket", 
        description: "A project to boost renewable energy use.", 
        startDate: "2023-03-05T00:00:00Z", 
        endDate: "2024-03-05T00:00:00Z" 
    },
    { 
        id: 4, 
        name: "Tennis", 
        description: "Tennis project for new software development techniques.", 
        startDate: "2023-01-20T00:00:00Z", 
        endDate: "2023-09-20T00:00:00Z" 
    },
    { 
        id: 5, 
        name: "Echo", 
        description: "Echo project focused on AI advancements.", 
        startDate: "2023-04-15T00:00:00Z", 
        endDate: "2023-11-30T00:00:00Z" 
    },
    { 
        id: 6, 
        name: "Foot Ball", 
        description: "Exploring cutting-edge biotechnology.", 
        startDate: "2023-02-25T00:00:00Z", 
        endDate: "2023-08-25T00:00:00Z" 
    },
    { 
        id: 7, 
        name: "Golf", 
        description: "Development of new golf equipment using AI.", 
        startDate: "2023-05-10T00:00:00Z", 
        endDate: "2023-12-10T00:00:00Z" 
    },
    { 
        id: 8, 
        name: "Hockey", 
        description: "Hockey management system overhaul.", 
        startDate: "2023-03-01T00:00:00Z", 
        endDate: "2024-01-01T00:00:00Z" 
    },
    { 
        id: 9, 
        name: "India", 
        description: "Telecommunication infrastructure upgrade.", 
        startDate: "2023-06-01T00:00:00Z", 
        endDate: "2023-12-01T00:00:00Z" 
    },
    { 
        id: 10, 
        name: "Judo", 
        description: "Initiative to enhance cyber-security measures.", 
        startDate: "2023-07-01T00:00:00Z", 
        endDate: "2024-02-01T00:00:00Z" 
    }
];

// Simple state to simulate data creation, mimicking auto-incrementing IDs.
let currentMaxProjectId = DUMMY_PROJECTS.length;

// Mocks the Project.findMany() call
export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Simulate a database fetch and return all projects
    const projects = DUMMY_PROJECTS;
    res.json(projects);
  } catch (error: any) {
    // Error block is mostly for completeness in a mock
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
};

// Mocks the Project.create() call
export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;
  try {
    // Simulate the database auto-increment
    currentMaxProjectId += 1;

    // Create the new project object
    const newProject = {
      id: currentMaxProjectId, // Primary key
      name,
      description,
      startDate: startDate || new Date().toISOString(), // Use provided date or a default
      endDate: endDate || null,
    };

    // Simulate saving the project to the database (add to the array)
    DUMMY_PROJECTS.push(newProject as any);

    res.status(201).json(newProject);
  } catch (error: any) {
    // Since we're not actually using Prisma, this catch block is unlikely to hit
    res
      .status(500)
      .json({ message: `Error creating a project: ${error.message}` });
  }
};