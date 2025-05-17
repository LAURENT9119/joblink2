import { storage } from "./storage";

export async function seed() {
  console.log("Seeding test data...");

  // Add test users
  storage.users.set(1, {
    id: 1,
    email: 'employer@test.com',
    password: 'test123',
    firstName: 'Moussa',
    lastName: 'Diop',
    role: 'employer'
  });

  storage.users.set(2, {
    id: 2, 
    email: 'jobseeker@test.com',
    password: 'test123',
    firstName: 'Fatou',
    lastName: 'Sow',
    role: 'jobSeeker'
  });

  console.log("Test data seeded!");
}