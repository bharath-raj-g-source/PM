import { Request, Response } from "express";

// 1. IMPORT DUMMY DATA (Using the complete, interlinked data sets)
// In a real setup, these would be centralized imports of the data you provided.

const DUMMY_TASKS = [
  {
    id: 1,
    title: "Task 1",
    description: "Design the main module.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "Design",
    startDate: "2023-01-10T00:00:00Z",
    dueDate: "2023-04-10T00:00:00Z",
    projectId: 1,
    authorUserId: 1,
    assignedUserId: 2,
  },
  {
    id: 2,
    title: "Task 2",
    description: "Implement the navigation algorithm.",
    status: "To Do",
    priority: "High",
    tags: "Coding",
    startDate: "2023-01-15T00:00:00Z",
    dueDate: "2023-05-15T00:00:00Z",
    projectId: 2,
    authorUserId: 3,
    assignedUserId: 4,
  },
  {
    id: 3,
    title: "Task 3",
    description: "Develop renewable energy solutions.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "Development",
    startDate: "2023-03-20T00:00:00Z",
    dueDate: "2023-09-20T00:00:00Z",
    projectId: 3,
    authorUserId: 5,
    assignedUserId: 6,
  },
  {
    id: 4,
    title: "Task 4",
    description: "Outline new software development workflows.",
    status: "To Do",
    priority: "High",
    tags: "Planning",
    startDate: "2023-01-25T00:00:00Z",
    dueDate: "2023-06-25T00:00:00Z",
    projectId: 4,
    authorUserId: 7,
    assignedUserId: 8,
  },
  {
    id: 5,
    title: "Task 5",
    description: "Research AI models for prediction.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "Research",
    startDate: "2023-04-20T00:00:00Z",
    dueDate: "2023-10-20T00:00:00Z",
    projectId: 5,
    authorUserId: 9,
    assignedUserId: 10,
  },
  {
    id: 6,
    title: "Task 6",
    description: "Biotech product testing.",
    status: "To Do",
    priority: "Backlog",
    tags: "Testing",
    startDate: "2023-03-01T00:00:00Z",
    dueDate: "2023-08-01T00:00:00Z",
    projectId: 6,
    authorUserId: 11,
    assignedUserId: 12,
  },
  {
    id: 7,
    title: "Task 7",
    description: "AI optimization for golf equipment.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "Optimization",
    startDate: "2023-05-15T00:00:00Z",
    dueDate: "2023-11-15T00:00:00Z",
    projectId: 7,
    authorUserId: 13,
    assignedUserId: 14,
  },
  {
    id: 8,
    title: "Task 8",
    description: "Overhaul of the database for Hockey management.",
    status: "To Do",
    priority: "High",
    tags: "Database",
    startDate: "2023-04-01T00:00:00Z",
    dueDate: "2023-10-01T00:00:00Z",
    projectId: 8,
    authorUserId: 15,
    assignedUserId: 16,
  },
  {
    id: 9,
    title: "Task 9",
    description: "Upgrade telecom infrastructure.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "Infrastructure",
    startDate: "2023-06-10T00:00:00Z",
    dueDate: "2023-12-10T00:00:00Z",
    projectId: 9,
    authorUserId: 17,
    assignedUserId: 18,
  },
  {
    id: 10,
    title: "Task 10",
    description: "Enhance security protocols.",
    status: "To Do",
    priority: "Urgent",
    tags: "Security",
    startDate: "2023-07-05T00:00:00Z",
    dueDate: "2024-01-05T00:00:00Z",
    projectId: 10,
    authorUserId: 19,
    assignedUserId: 20,
  },
  {
    id: 11,
    title: "Task 11",
    description: "Finalize AI training parameters.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "AI, Training",
    startDate: "2023-01-20T00:00:00Z",
    dueDate: "2023-05-20T00:00:00Z",
    projectId: 5,
    authorUserId: 1,
    assignedUserId: 3,
  },
  {
    id: 12,
    title: "Task 12",
    description: "Update server security protocols.",
    status: "To Do",
    priority: "High",
    tags: "Security",
    startDate: "2023-02-10T00:00:00Z",
    dueDate: "2023-06-10T00:00:00Z",
    projectId: 1,
    authorUserId: 2,
    assignedUserId: 4,
  },
  {
    id: 13,
    title: "Task 13",
    description: "Redesign user interface for better UX.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "Design, UX",
    startDate: "2023-03-15T00:00:00Z",
    dueDate: "2023-07-15T00:00:00Z",
    projectId: 2,
    authorUserId: 5,
    assignedUserId: 6,
  },
  {
    id: 14,
    title: "Task 14",
    description: "Implement real-time data analytics.",
    status: "To Do",
    priority: "High",
    tags: "Analytics",
    startDate: "2023-04-05T00:00:00Z",
    dueDate: "2023-08-05T00:00:00Z",
    projectId: 3,
    authorUserId: 7,
    assignedUserId: 8,
  },
  {
    id: 15,
    title: "Task 15",
    description: "Develop end-to-end encryption solution.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "Encryption",
    startDate: "2023-05-01T00:00:00Z",
    dueDate: "2023-09-01T00:00:00Z",
    projectId: 4,
    authorUserId: 9,
    assignedUserId: 10,
  },
  {
    id: 16,
    title: "Task 16",
    description: "Optimize cloud storage usage.",
    status: "To Do",
    priority: "Backlog",
    tags: "Cloud, Storage",
    startDate: "2023-06-15T00:00:00Z",
    dueDate: "2023-10-15T00:00:00Z",
    projectId: 5,
    authorUserId: 11,
    assignedUserId: 12,
  },
  {
    id: 17,
    title: "Task 17",
    description: "Test software for hardware compatibility.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "Testing, Hardware",
    startDate: "2023-07-10T00:00:00Z",
    dueDate: "2023-11-10T00:00:00Z",
    projectId: 6,
    authorUserId: 13,
    assignedUserId: 14,
  },
  {
    id: 18,
    title: "Task 18",
    description: "Create new data visualization tools.",
    status: "To Do",
    priority: "High",
    tags: "Visualization",
    startDate: "2023-08-05T00:00:00Z",
    dueDate: "2023-12-05T00:00:00Z",
    projectId: 7,
    authorUserId: 15,
    assignedUserId: 16,
  },
  {
    id: 19,
    title: "Task 19",
    description: "Build prototype for new IoT devices.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "IoT",
    startDate: "2023-09-01T00:00:00Z",
    dueDate: "2024-01-01T00:00:00Z",
    projectId: 8,
    authorUserId: 17,
    assignedUserId: 18,
  },
  {
    id: 20,
    title: "Task 20",
    description: "Update legacy systems to new tech standards.",
    status: "To Do",
    priority: "Urgent",
    tags: "Legacy, Upgrade",
    startDate: "2023-10-10T00:00:00Z",
    dueDate: "2024-02-10T00:00:00Z",
    projectId: 9,
    authorUserId: 19,
    assignedUserId: 20,
  },
  {
    id: 21,
    title: "Task 21",
    description: "Establish new network security framework.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "Security",
    startDate: "2023-01-30T00:00:00Z",
    dueDate: "2023-05-30T00:00:00Z",
    projectId: 10,
    authorUserId: 1,
    assignedUserId: 3,
  },
  {
    id: 22,
    title: "Task 22",
    description: "Revise application deployment strategies.",
    status: "To Do",
    priority: "High",
    tags: "Deployment",
    startDate: "2023-02-20T00:00:00Z",
    dueDate: "2023-06-20T00:00:00Z",
    projectId: 1,
    authorUserId: 2,
    assignedUserId: 4,
  },
  {
    id: 23,
    title: "Task 23",
    description: "Conduct market analysis for product fit.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "Market Analysis",
    startDate: "2023-03-25T00:00:00Z",
    dueDate: "2023-07-25T00:00:00Z",
    projectId: 2,
    authorUserId: 5,
    assignedUserId: 6,
  },
  {
    id: 24,
    title: "Task 24",
    description: "Optimize user feedback collection mechanism.",
    status: "To Do",
    priority: "High",
    tags: "Feedback",
    startDate: "2023-04-15T00:00:00Z",
    dueDate: "2023-08-15T00:00:00Z",
    projectId: 3,
    authorUserId: 7,
    assignedUserId: 8,
  },
  {
    id: 25,
    title: "Task 25",
    description: "Integrate new API for third-party services.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "API Integration",
    startDate: "2023-05-05T00:00:00Z",
    dueDate: "2023-09-05T00:00:00Z",
    projectId: 4,
    authorUserId: 9,
    assignedUserId: 10,
  },
  {
    id: 26,
    title: "Task 26",
    description: "Update internal tooling for development teams.",
    status: "To Do",
    priority: "Backlog",
    tags: "Tooling",
    startDate: "2023-06-25T00:00:00Z",
    dueDate: "2023-10-25T00:00:00Z",
    projectId: 5,
    authorUserId: 11,
    assignedUserId: 12,
  },
  {
    id: 27,
    title: "Task 27",
    description: "Prepare cloud migration strategy document.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "Cloud Migration",
    startDate: "2023-07-20T00:00:00Z",
    dueDate: "2023-11-20T00:00:00Z",
    projectId: 6,
    authorUserId: 13,
    assignedUserId: 14,
  },
  {
    id: 28,
    title: "Task 28",
    description: "Design scalable database architecture.",
    status: "To Do",
    priority: "Medium",
    tags: "Database Design",
    startDate: "2023-08-15T00:00:00Z",
    dueDate: "2023-12-15T00:00:00Z",
    projectId: 7,
    authorUserId: 15,
    assignedUserId: 16,
  },
  {
    id: 29,
    title: "Task 29",
    description: "Prototype new mobile technology.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "Mobile Tech",
    startDate: "2023-09-10T00:00:00Z",
    dueDate: "2024-01-10T00:00:00Z",
    projectId: 8,
    authorUserId: 17,
    assignedUserId: 18,
  },
  {
    id: 30,
    title: "Task 30",
    description: "Enhance data encryption levels.",
    status: "To Do",
    priority: "High",
    tags: "Encryption",
    startDate: "2023-10-15T00:00:00Z",
    dueDate: "2024-02-15T00:00:00Z",
    projectId: 9,
    authorUserId: 19,
    assignedUserId: 20,
  },
  {
    id: 31,
    title: "Task 31",
    description: "Refactor backend code for better maintainability.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "Refactoring, Backend",
    startDate: "2023-11-01T00:00:00Z",
    dueDate: "2024-03-01T00:00:00Z",
    projectId: 10,
    authorUserId: 20,
    assignedUserId: 1,
  },
  {
    id: 32,
    title: "Task 32",
    description: "Expand the network infrastructure to support increased traffic.",
    status: "To Do",
    priority: "Medium",
    tags: "Networking, Infrastructure",
    startDate: "2023-11-05T00:00:00Z",
    dueDate: "2024-01-05T00:00:00Z",
    projectId: 1,
    authorUserId: 2,
    assignedUserId: 3,
  },
  {
    id: 33,
    title: "Task 33",
    description: "Create a new client dashboard interface.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "UI, Dashboard",
    startDate: "2023-11-10T00:00:00Z",
    dueDate: "2024-02-10T00:00:00Z",
    projectId: 2,
    authorUserId: 4,
    assignedUserId: 5,
  },
  {
    id: 34,
    title: "Task 34",
    description: "Develop an automated testing framework for new software releases.",
    status: "To Do",
    priority: "Medium",
    tags: "Testing, Automation",
    startDate: "2023-11-15T00:00:00Z",
    dueDate: "2024-03-15T00:00:00Z",
    projectId: 3,
    authorUserId: 6,
    assignedUserId: 7,
  },
  {
    id: 35,
    title: "Task 35",
    description: "Optimize database queries to improve application performance.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "Database, Optimization",
    startDate: "2023-11-20T00:00:00Z",
    dueDate: "2024-01-20T00:00:00Z",
    projectId: 4,
    authorUserId: 8,
    assignedUserId: 9,
  },
  {
    id: 36,
    title: "Task 36",
    description: "Implement end-user training for new system features.",
    status: "To Do",
    priority: "Backlog",
    tags: "Training, User Experience",
    startDate: "2023-11-25T00:00:00Z",
    dueDate: "2024-01-25T00:00:00Z",
    projectId: 5,
    authorUserId: 10,
    assignedUserId: 11,
  },
  {
    id: 37,
    title: "Task 37",
    description: "Conduct a comprehensive security audit of the existing infrastructure.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "Security, Audit",
    startDate: "2023-12-01T00:00:00Z",
    dueDate: "2024-02-01T00:00:00Z",
    projectId: 6,
    authorUserId: 12,
    assignedUserId: 13,
  },
  {
    id: 38,
    title: "Task 38",
    description: "Revise mobile app to incorporate new payment integrations.",
    status: "To Do",
    priority: "Medium",
    tags: "Mobile, Payments",
    startDate: "2023-12-05T00:00:00Z",
    dueDate: "2024-02-05T00:00:00Z",
    projectId: 7,
    authorUserId: 14,
    assignedUserId: 15,
  },
  {
    id: 39,
    title: "Task 39",
    description: "Update cloud configuration to optimize costs.",
    status: "Work In Progress",
    priority: "Urgent",
    tags: "Cloud, Cost Saving",
    startDate: "2023-12-10T00:00:00Z",
    dueDate: "2024-02-10T00:00:00Z",
    projectId: 8,
    authorUserId: 16,
    assignedUserId: 17,
  },
  {
    id: 40,
    title: "Task 40",
    description: "Implement automated backup procedures for critical data.",
    status: "To Do",
    priority: "High",
    tags: "Backup, Automation",
    startDate: "2023-12-15T00:00:00Z",
    dueDate: "2024-02-15T00:00:00Z",
    projectId: 9,
    authorUserId: 18,
    assignedUserId: 19,
  },
];

const DUMMY_USERS = [
    // ... all 20 User records from user.csv (with all fields)
    { userId: 1, cognitoId: "123e4567-e89b-12d3-a456-426614174001", username: "Bharath Raj", profilePictureUrl: "p1.jpeg", teamId: 1 },
    { userId: 2, cognitoId: "123e4567-e89b-12d3-a456-426614174002", username: "Priya", profilePictureUrl: "p2.jpeg", teamId: 2 },
    // ... and 18 more
];

const DUMMY_COMMENTS = [
    // ... all 25 Comment records from comment.csv (with id, text, taskId, userId)
    { id: 1, text: "We need to update this design...", taskId: 1, userId: 2 },
    { id: 12, text: "Server security update meeting...", taskId: 12, userId: 2 },
    // ...
];

const DUMMY_ATTACHMENTS = [
    // ... all 10 Attachment records from attachment.csv (with id, fileURL, taskId, uploadedById)
    { id: 1, fileURL: "i1.jpg", fileName: "DesignDoc.pdf", taskId: 1, uploadedById: 1 },
    // ...
];

// Simple state to simulate data creation, mirroring your previous User setup.
let currentMaxTaskId = DUMMY_TASKS.length;

// Helper function to simulate Prisma includes (joins)
const includeTaskRelations = (task: any) => {
    // Clone the task to avoid modifying the original array object during mock joins
    const taskWithRelations = { ...task };

    // Find and attach Author and Assignee User objects
    taskWithRelations.author = DUMMY_USERS.find(u => u.userId === task.authorUserId) || null;
    taskWithRelations.assignee = DUMMY_USERS.find(u => u.userId === task.assignedUserId) || null;

    // Find and attach related Comments and Attachments
    taskWithRelations.comments = DUMMY_COMMENTS.filter(c => c.taskId === task.id);
    taskWithRelations.attachments = DUMMY_ATTACHMENTS.filter(a => a.taskId === task.id);

    return taskWithRelations;
};

// Mocks the Task.findMany({ where: { projectId: N }, include: { ... } }) call
export const getTasks = async (req: Request, res: Response): Promise<void> => {
    const rawProjectId = req.query.projectId as string;
    const projectId = Number(rawProjectId);

    try {
        if (isNaN(projectId)) {
            res.status(400).json({ message: "Invalid projectId provided." });
            return;
        }

        // 1. Filter tasks by projectId
        const filteredTasks = DUMMY_TASKS.filter(task => task.projectId === projectId);

        // 2. Map through the filtered tasks to add relational data (simulating 'include')
        const tasksWithRelations = filteredTasks.map(includeTaskRelations);

        res.json(tasksWithRelations);
    } catch (error: any) {
        res
            .status(500)
            .json({ message: `Error retrieving tasks: ${error.message}` });
    }
};

// Mocks the Task.create() call
export const createTask = async (req: Request, res: Response): Promise<void> => {
    const {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
    } = req.body;

    try {
        // Simulate database auto-increment
        currentMaxTaskId += 1;

        // Create the new task object
        const newTask = {
            id: currentMaxTaskId, // Primary key
            title,
            description,
            status,
            priority,
            tags,
            startDate,
            dueDate,
            points: points ?? 0, // Ensure points is a number or defaults
            projectId: Number(projectId),
            authorUserId: Number(authorUserId),
            assignedUserId: assignedUserId ? Number(assignedUserId) : null,
        };

        // Simulate saving the task to the database (add to the array)
        DUMMY_TASKS.push(newTask as any); // Use 'as any' to simplify mock typing

        // Return the created task (Prisma returns the full object)
        res.status(201).json(newTask);
    } catch (error: any) {
        res
            .status(500)
            .json({ message: `Error creating a task: ${error.message}` });
    }
};

// Mocks the Task.update({ where: { id: N }, data: { status: S } }) call
export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
    const rawTaskId = req.params.taskId as string;
    const taskId = Number(rawTaskId);
    const { status } = req.body;

    try {
        if (isNaN(taskId)) {
            res.status(400).json({ message: "Invalid taskId provided." });
            return;
        }

        // 1. Find the task index
        const taskIndex = DUMMY_TASKS.findIndex(task => task.id === taskId);

        if (taskIndex === -1) {
            res.status(404).json({ message: `Task with ID ${taskId} not found.` });
            return;
        }

        // 2. Update the status
        const updatedTask = {
            ...DUMMY_TASKS[taskIndex],
            status: status,
        };

        // 3. Simulate persistence (update the array)
        DUMMY_TASKS[taskIndex] = updatedTask as any;

        // Return the updated task object
        res.json(updatedTask);
    } catch (error: any) {
        res.status(500).json({ message: `Error updating task: ${error.message}` });
    }
};

// Mocks the Task.findMany({ where: { OR: [author, assignee] }, include: { author, assignee } }) call
export const getUserTasks = async (req: Request, res: Response): Promise<void> => {
    const rawUserId = req.params.userId as string;
    const userId = Number(rawUserId);

    try {
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid userId provided." });
            return;
        }

        // 1. Filter tasks where the user is either the author or the assigned user
        const filteredTasks = DUMMY_TASKS.filter(task =>
            task.authorUserId === userId || task.assignedUserId === userId
        );

        // 2. Map through the filtered tasks to add relational data (simulating 'include')
        const tasksWithRelations = filteredTasks.map(task => {
            // Only include Author and Assignee for this endpoint
            const taskWithRelations : any = { ...task };
            taskWithRelations.author = DUMMY_USERS.find(u => u.userId === task.authorUserId) || null;
            taskWithRelations.assignee = DUMMY_USERS.find(u => u.userId === task.assignedUserId) || null;
            return taskWithRelations;
        });

        res.json(tasksWithRelations);
    } catch (error: any) {
        res
            .status(500)
            .json({ message: `Error retrieving user's tasks: ${error.message}` });
    }
};