import { storage } from "./storage";
import { hashPassword } from "./auth";

/**
 * Seeds the database with test users for development purposes
 */
export async function seedTestUsers() {
  try {
    // Check if any users already exist to avoid duplicate seeding
    const existingUsers = await storage.getUserByUsername("employer");
    if (existingUsers) {
      console.log("Skip seeding: Test users already exist");
      return;
    }

    console.log("Seeding test users...");

    // Create employer test account
    const employerUser = await storage.createUser({
      username: "employer",
      password: await hashPassword("password"),
      firstName: "Jean",
      lastName: "Dupont",
      email: "employer@joblink.com",
      phone: "+33612345678",
      role: "employer",
      preferredLanguage: "fr"
    });

    // Create employer profile
    await storage.createOrUpdateEmployerProfile({
      userId: employerUser.id,
      companyName: "Entreprise Test",
      companySize: "small",
      sector: "technology",
      location: "Paris",
      description: "Une entreprise de test pour le développement",
      contactPreferences: ["phone", "whatsapp", "email"]
    });

    // Create job seeker test account
    const jobSeekerUser = await storage.createUser({
      username: "jobseeker",
      password: await hashPassword("password"),
      firstName: "Marie",
      lastName: "Martin",
      email: "jobseeker@joblink.com",
      phone: "+33698765432",
      role: "job_seeker",
      preferredLanguage: "fr"
    });

    // Create job seeker profile
    await storage.createOrUpdateJobSeekerProfile({
      userId: jobSeekerUser.id,
      location: "Lyon",
      age: 28,
      skills: ["communication", "customer_service", "sales"],
      desiredSectors: ["retail", "hospitality"],
      completionPercentage: 80
    });

    // Create english-speaking job seeker test account
    const englishJobSeekerUser = await storage.createUser({
      username: "johnsmith",
      password: await hashPassword("password"),
      firstName: "John",
      lastName: "Smith",
      email: "john@joblink.com",
      phone: "+44123456789",
      role: "job_seeker",
      preferredLanguage: "en"
    });

    // Create job seeker profile
    await storage.createOrUpdateJobSeekerProfile({
      userId: englishJobSeekerUser.id,
      location: "London",
      age: 32,
      skills: ["administration", "customer_service", "technical"],
      desiredSectors: ["technology", "services"],
      completionPercentage: 75
    });

    // Create some test jobs
    const job1 = await storage.createJob({
      employerId: employerUser.id,
      title: "Développeur Web Frontend",
      description: "Nous recherchons un développeur frontend expérimenté pour rejoindre notre équipe",
      location: "Paris",
      type: "full_time",
      sector: "technology",
      status: "active",
      contactName: "Jean Dupont",
      contactPhone: "+33612345678",
      contactEmail: "employer@joblink.com",
      contactPreferences: ["email", "phone"]
    });

    const job2 = await storage.createJob({
      employerId: employerUser.id,
      title: "Serveur / Serveuse",
      description: "Restaurant recherche serveur/serveuse à temps partiel",
      location: "Lyon",
      type: "part_time",
      sector: "hospitality",
      status: "active",
      contactName: "Jean Dupont",
      contactPhone: "+33612345678",
      contactEmail: "employer@joblink.com",
      contactPreferences: ["phone", "whatsapp"]
    });

    // Create an application
    await storage.createApplication({
      jobId: job2.id,
      jobSeekerId: jobSeekerUser.id,
      status: "pending"
    });

    // Save a job for testing
    await storage.saveJob({
      jobId: job1.id,
      jobSeekerId: jobSeekerUser.id
    });

    console.log("Test users and data seeded successfully!");
  } catch (error) {
    console.error("Error seeding test users:", error);
  }
}