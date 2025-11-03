import { Request, Response } from "express";

// 1. DUMMY DATA SOURCE (based on the user.json you provided)
// This array serves as the in-memory "database" for the mock controller.

const DUMMY_USERS = [
    {
        userId: 1,
        cognitoId: "123e4567-e89b-12d3-a456-426614174001",
        username: "Bharath Raj",
        profilePictureUrl: "p1.jpeg",
        teamId: 1,
    },
    {
        userId: 2,
        cognitoId: "123e4567-e89b-12d3-a456-426614174002",
        username: "Priya",
        profilePictureUrl: "p2.jpeg",
        teamId: 2,
    },
    {
        userId: 3,
        cognitoId: "123e4567-e89b-12d3-a456-426614174003",
        username: "Hitesh",
        profilePictureUrl: "p3.jpeg",
        teamId: 3,
    },
    {
        userId: 4,
        cognitoId: "213b7530-1031-70e0-67e9-fe0805e18fb3",
        username: "Naveen",
        profilePictureUrl: "p4.jpeg",
        teamId: 4,
    },
    {
        userId: 5,
        cognitoId: "123e4567-e89b-12d3-a456-426614174005",
        username: "EveClark",
        profilePictureUrl: "p5.jpeg",
        teamId: 5,
    },
    {
        userId: 6,
        cognitoId: "123e4567-e89b-12d3-a456-426614174006",
        username: "FrankWright",
        profilePictureUrl: "p6.jpeg",
        teamId: 1,
    },
    {
        userId: 7,
        cognitoId: "123e4567-e89b-12d3-a456-426614174007",
        username: "GraceHall",
        profilePictureUrl: "p7.jpeg",
        teamId: 2,
    },
    {
        userId: 8,
        cognitoId: "123e4567-e89b-12d3-a456-426614174008",
        username: "HenryAllen",
        profilePictureUrl: "p8.jpeg",
        teamId: 3,
    },
    {
        userId: 9,
        cognitoId: "123e4567-e89b-12d3-a456-426614174009",
        username: "IdaMartin",
        profilePictureUrl: "p9.jpeg",
        teamId: 4,
    },
    {
        userId: 10,
        cognitoId: "123e4567-e89b-12d3-a456-426614174010",
        username: "bharath",
        profilePictureUrl: "p10.jpeg",
        teamId: 5,
    },
    {
        userId: 11,
        cognitoId: "123e4567-e89b-12d3-a456-426614174011",
        username: "Vivek",
        profilePictureUrl: "p11.jpeg",
        teamId: 1,
    },
    {
        userId: 12,
        cognitoId: "123e4567-e89b-12d3-a456-426614174012",
        username: "NormanBates",
        profilePictureUrl: "p12.jpeg",
        teamId: 2,
    },
    {
        userId: 13,
        cognitoId: "123e4567-e89b-12d3-a456-426614174013",
        username: "OliviaPace",
        profilePictureUrl: "p13.jpeg",
        teamId: 3,
    },
    {
        userId: 14,
        cognitoId: "123e4567-e89b-12d3-a456-426614174014",
        username: "PeterQuill",
        profilePictureUrl: "p1.jpeg",
        teamId: 4,
    },
    {
        userId: 15,
        cognitoId: "123e4567-e89b-12d3-a456-426614174015",
        username: "QuincyAdams",
        profilePictureUrl: "p2.jpeg",
        teamId: 5,
    },
    {
        userId: 16,
        cognitoId: "123e4567-e89b-12d3-a456-426614174016",
        username: "RachelGreen",
        profilePictureUrl: "p3.jpeg",
        teamId: 1,
    },
    {
        userId: 17,
        cognitoId: "123e4567-e89b-12d3-a456-426614174017",
        username: "SteveJobs",
        profilePictureUrl: "p4.jpeg",
        teamId: 2,
    },
    {
        userId: 18,
        cognitoId: "123e4567-e89b-12d3-a456-426614174018",
        username: "TinaFey",
        profilePictureUrl: "p5.jpeg",
        teamId: 3,
    },
    {
        userId: 19,
        cognitoId: "123e4567-e89b-12d3-a456-426614174019",
        username: "UrsulaMonroe",
        profilePictureUrl: "p6.jpeg",
        teamId: 4,
    },
    {
        userId: 20,
        cognitoId: "123e4567-e89b-12d3-a456-426614174020",
        username: "VictorHugo",
        profilePictureUrl: "p7.jpeg",
        teamId: 5,
    },
];

// Simple state to simulate data creation, mimicking auto-incrementing IDs.
let currentMaxUserId = DUMMY_USERS.length;

// Mocks the User.findMany() call
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Simulate a database fetch and return all users
    const users = DUMMY_USERS;
    res.json(users);
  } catch (error: any) {
    // Error block is mostly for completeness in a mock
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};

// Mocks the User.findUnique({ where: { cognitoId } }) call
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { cognitoId } = req.params;
  try {
    // Simulate finding a unique record by cognitoId
    const user = DUMMY_USERS.find((u) => u.cognitoId === cognitoId);

    // Prisma returns null if not found, so we should too.
    res.json(user || null);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

// Mocks the User.create() call
export const postUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      cognitoId,
      profilePictureUrl = "i1.jpg", // Default values match your original controller
      teamId = 1,
    } = req.body;

    // Simulate the database auto-increment
    currentMaxUserId += 1;

    // Create the new user object
    const newUser = {
      userId: currentMaxUserId, // Primary key
      username,
      cognitoId,
      profilePictureUrl,
      teamId: Number(teamId),
    };

    // Simulate saving the user to the database (add to the array)
    DUMMY_USERS.push(newUser);

    res.json({ message: "User Created Successfully", newUser });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating user: ${error.message}` });
  }
};