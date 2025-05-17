import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertJobSeekerProfileSchema, insertEmployerProfileSchema, insertJobSchema, insertApplicationSchema, insertSavedJobSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // API routes
  
  // Profile routes
  app.post("/api/job-seeker/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user!.role !== "job_seeker") return res.status(403).send("Not authorized");
    
    try {
      const validatedData = insertJobSeekerProfileSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const profile = await storage.createOrUpdateJobSeekerProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  app.post("/api/employer/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user!.role !== "employer") return res.status(403).send("Not authorized");
    
    try {
      const validatedData = insertEmployerProfileSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const profile = await storage.createOrUpdateEmployerProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  // Job routes
  app.post("/api/jobs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user!.role !== "employer") return res.status(403).send("Not authorized");
    
    try {
      const validatedData = insertJobSchema.parse(req.body);
      
      const job = await storage.createJob({
        ...validatedData,
        employerId: req.user!.id
      });
      
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getJobs(req.query);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJobById(parseInt(req.params.id));
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      // Increment view count
      await storage.incrementJobViews(job.id);
      
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/employer/jobs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user!.role !== "employer") return res.status(403).send("Not authorized");
    
    try {
      const jobs = await storage.getJobsByEmployerId(req.user!.id);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Application routes
  app.post("/api/applications", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user!.role !== "job_seeker") return res.status(403).send("Not authorized");
    
    try {
      const validatedData = insertApplicationSchema.parse({
        ...req.body,
        jobSeekerId: req.user!.id
      });
      
      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  app.get("/api/job-seeker/applications", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user!.role !== "job_seeker") return res.status(403).send("Not authorized");
    
    try {
      const applications = await storage.getApplicationsByJobSeekerId(req.user!.id);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/employer/applications", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user!.role !== "employer") return res.status(403).send("Not authorized");
    
    try {
      const applications = await storage.getApplicationsByEmployerId(req.user!.id);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Saved jobs routes
  app.post("/api/saved-jobs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user!.role !== "job_seeker") return res.status(403).send("Not authorized");
    
    try {
      const validatedData = insertSavedJobSchema.parse({
        ...req.body,
        jobSeekerId: req.user!.id
      });
      
      const savedJob = await storage.saveJob(validatedData);
      res.status(201).json(savedJob);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  app.delete("/api/saved-jobs/:jobId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user!.role !== "job_seeker") return res.status(403).send("Not authorized");
    
    try {
      await storage.removeSavedJob(parseInt(req.params.jobId), req.user!.id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/job-seeker/saved-jobs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user!.role !== "job_seeker") return res.status(403).send("Not authorized");
    
    try {
      const savedJobs = await storage.getSavedJobsByJobSeekerId(req.user!.id);
      res.json(savedJobs);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
