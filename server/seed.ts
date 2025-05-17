import { storage } from "./storage";
import { hashPassword } from "./auth";

export async function seed() {
  console.log("Seeding test users...");

  // Create test job seeker
  await storage.createUser({
    username: "testuser",
    password: await hashPassword("test123"),
    firstName: "Test",
    lastName: "User",
    phone: "123456789",
    role: "job_seeker",
    preferredLanguage: "fr"
  });

  // Create test employer
  await storage.createUser({
    username: "testemployer",
    password: await hashPassword("test123"),
    firstName: "Test",
    lastName: "Employer",
    phone: "987654321",
    role: "employer",
    preferredLanguage: "fr"
  });

  console.log("Test users and data seeded successfully!");
}