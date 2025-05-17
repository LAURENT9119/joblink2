import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  role: text("role").notNull(), // "job_seeker" or "employer"
  preferredLanguage: text("preferred_language").notNull().default("fr"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Job seekers profile table
export const jobSeekerProfiles = pgTable("job_seeker_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  location: text("location"),
  age: integer("age"),
  skills: text("skills").array(),
  desiredSectors: text("desired_sectors").array(),
  audioPresentationUrl: text("audio_presentation_url"),
  profilePhotoUrl: text("profile_photo_url"),
  completionPercentage: integer("completion_percentage").notNull().default(0),
  experience: jsonb("experience"),
});

// Employer profile table
export const employerProfiles = pgTable("employer_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyName: text("company_name"),
  companySize: text("company_size"),
  sector: text("sector"),
  location: text("location"),
  description: text("description"),
  contactPreferences: text("contact_preferences").array(),
});

// Jobs/missions table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(), // Full-time, part-time, mission, etc.
  sector: text("sector").notNull(),
  startDate: timestamp("start_date"),
  duration: text("duration"),
  status: text("status").notNull().default("active"), // active, closed, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
  contactName: text("contact_name").notNull(),
  contactPhone: text("contact_phone").notNull(),
  contactEmail: text("contact_email"),
  contactPreferences: text("contact_preferences").array().notNull(),
  views: integer("views").notNull().default(0),
});

// Applications table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  jobSeekerId: integer("job_seeker_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Saved jobs table
export const savedJobs = pgTable("saved_jobs", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  jobSeekerId: integer("job_seeker_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertJobSeekerProfileSchema = createInsertSchema(jobSeekerProfiles).omit({ id: true });
export const insertEmployerProfileSchema = createInsertSchema(employerProfiles).omit({ id: true });
export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, employerId: true, createdAt: true, views: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, createdAt: true });
export const insertSavedJobSchema = createInsertSchema(savedJobs).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type JobSeekerProfile = typeof jobSeekerProfiles.$inferSelect;
export type InsertJobSeekerProfile = z.infer<typeof insertJobSeekerProfileSchema>;

export type EmployerProfile = typeof employerProfiles.$inferSelect;
export type InsertEmployerProfile = z.infer<typeof insertEmployerProfileSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type SavedJob = typeof savedJobs.$inferSelect;
export type InsertSavedJob = z.infer<typeof insertSavedJobSchema>;

// Authentication types
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginData = z.infer<typeof loginSchema>;

// Extended user type with profile
export type UserWithProfile = User & {
  jobSeekerProfile?: JobSeekerProfile;
  employerProfile?: EmployerProfile;
};

// Job with employer profile
export type JobWithEmployer = Job & {
  employer: User & {
    employerProfile?: EmployerProfile;
  };
};
