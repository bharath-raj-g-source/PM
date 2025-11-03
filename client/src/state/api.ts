import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// We don't use these live functions in the mock, but we keep the imports for type clarity
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth"; 

// --- INTERFACE CORRECTIONS ---
export interface Project {
  id: number; // Corrected: Must be present
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

export interface User {
  userId: number; // Corrected: Primary key, should be required on a fetched object
  username: string;
  email: string; // Assuming email is derived from Cognito, treat as required
  profilePictureUrl?: string;
  cognitoId: string; // Corrected: Unique ID, should be required
  teamId?: number;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId: number; // Corrected: Required based on Prisma schema
  assignedUserId?: number;

  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

export interface Team {
  id: number; // Corrected: Primary key is 'id' in Prisma
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
  // Added fields returned by the mocked getTeams controller:
  productOwnerUsername?: string;
  projectManagerUsername?: string;
}

// Define the shape of the successful response (e.g., a message and the processed data count)
export interface UploadResponse {
  message: string;
  count: number;
}
// -----------------------------

// --- MOCK CONSTANTS FOR AUTH ---
const MOCK_COGNITO_ID = "123e4567-e89b-12d3-a456-426614174001"; // Bharath Raj' cognitoId
const MOCK_USER_ID = 1; // Bharath Raj' userId
// -----------------------------

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    // --- MOCKING: Bypass live Amplify fetch and hardcode a valid token/no token ---
    prepareHeaders: async (headers) => {
      // For local development, we simulate having a token to satisfy middleware checks.
      // If your mock backend doesn't validate tokens, you can use a placeholder.
      headers.set("Authorization", `Bearer MOCK_ACCESS_TOKEN`); 
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams"],
  endpoints: (build) => ({
    getAuthUser: build.query({
      // --- MOCKING: Replace all live Amplify and API calls with mock data ---
      queryFn: async () => {
        // This object simulates the successful response required by your components.
        const mockUserDetails: User = {
          userId: MOCK_USER_ID,
          username: "Bharath Raj",
          email: "alice@quantum.com", 
          cognitoId: MOCK_COGNITO_ID,
          teamId: 1,
        };

        return {
          data: {
            user: { username: "Bharath Raj" }, // Mocked getCurrentUser result
            userSub: MOCK_COGNITO_ID, // Mocked userSub
            userDetails: mockUserDetails, // Mocked user details from your backend
          },
        };
      },
      providesTags: ["Users"],
    }),
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),
    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
    uploadFile: build.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        // Assuming your FastAPI/Node backend has an endpoint for file upload
        url: "upload/data",
        method: "POST",
        body: formData,
        // When sending FormData, explicitly setting 'Content-Type' is often NOT necessary 
        // and can cause issues; the browser handles it correctly.
      }),
  // If the uploaded file should immediately affect tasks/projects lists, 
  // you would invalidate the relevant tags here:
  // invalidatesTags: ["Projects", "Tasks"], 
}),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTasksByUserQuery,
  useGetAuthUserQuery,
  useUploadFileMutation,
} = api;