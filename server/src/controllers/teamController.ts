import { Request, Response } from "express";

// 1. IMPORT DUMMY DATA
// This uses the complete, interlinked data sets for Team and User.

const DUMMY_TEAMS = [
    // ... all 5 Team records from team.csv (with id, teamName, productOwnerUserId, projectManagerUserId)
    { id: 1, teamName: "BSR", productOwnerUserId: 11, projectManagerUserId: 2 },
    { id: 2, teamName: "GDT", productOwnerUserId: 13, projectManagerUserId: 4 },
    { id: 3, teamName: "Analytics", productOwnerUserId: 15, projectManagerUserId: 6 },
    { id: 4, teamName: "Devops", productOwnerUserId: 17, projectManagerUserId: 8 },
    { id: 5, teamName: "Automation", productOwnerUserId: 19, projectManagerUserId: 10 },
];

const DUMMY_USERS = [
    // ... all 20 User records from user.csv (userId, username, etc.)
    { userId: 1, cognitoId: "...", username: "Bharath Raj", profilePictureUrl: "p1.jpeg", teamId: 1 },
    { userId: 2, cognitoId: "...", username: "Priya", profilePictureUrl: "p2.jpeg", teamId: 2 },
    // ...
    { userId: 10, cognitoId: "...", username: "bharath", profilePictureUrl: "p10.jpeg", teamId: 5 },
    { userId: 11, cognitoId: "...", username: "Vivek", profilePictureUrl: "p11.jpeg", teamId: 1 },
    // ...
];

// Helper function to simulate a Prisma User lookup by ID and select only username
const findUsernameById = (userId: number | null | undefined): string | undefined => {
    if (!userId) return undefined;
    const user = DUMMY_USERS.find(u => u.userId === userId);
    return user?.username;
};


// Mocks the Team.findMany() and subsequent User lookups
export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Simulate prisma.team.findMany()
    const teams = DUMMY_TEAMS;

    // 2. Simulate the augmentation loop (Promise.all + lookups)
    const teamsWithUsernames = teams.map((team) => {
      // Simulate prisma.user.findUnique for Product Owner
      const productOwnerUsername = findUsernameById(team.productOwnerUserId);

      // Simulate prisma.user.findUnique for Project Manager
      const projectManagerUsername = findUsernameById(team.projectManagerUserId);

      return {
        ...team,
        productOwnerUsername: productOwnerUsername,
        projectManagerUsername: projectManagerUsername,
      };
    });

    // Simulate the asynchronous behavior by wrapping the result in a resolved Promise, 
    // although in a mock scenario, direct synchronous execution is acceptable for simplicity.
    res.json(teamsWithUsernames); 
  } catch (error: any) {
    // Error block is mostly for completeness in a mock
    res
      .status(500)
      .json({ message: `Error retrieving teams: ${error.message}` });
  }
};