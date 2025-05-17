import { 
  User, InsertUser, 
  JobSeekerProfile, InsertJobSeekerProfile, 
  EmployerProfile, InsertEmployerProfile,
  Job, InsertJob,
  Application, InsertApplication,
  SavedJob, InsertSavedJob,
  JobWithEmployer,
  UserWithProfile
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserWithProfile(id: number): Promise<UserWithProfile | undefined>;
  
  // Profile methods
  createOrUpdateJobSeekerProfile(profile: InsertJobSeekerProfile): Promise<JobSeekerProfile>;
  createOrUpdateEmployerProfile(profile: InsertEmployerProfile): Promise<EmployerProfile>;
  
  // Job methods
  createJob(job: InsertJob & { employerId: number }): Promise<Job>;
  getJobs(filters?: any): Promise<JobWithEmployer[]>;
  getJobById(id: number): Promise<JobWithEmployer | undefined>;
  getJobsByEmployerId(employerId: number): Promise<Job[]>;
  incrementJobViews(jobId: number): Promise<void>;
  
  // Application methods
  createApplication(application: InsertApplication): Promise<Application>;
  getApplicationsByJobSeekerId(jobSeekerId: number): Promise<(Application & { job: Job })[]>;
  getApplicationsByEmployerId(employerId: number): Promise<(Application & { job: Job, jobSeeker: User })[]>;
  
  // Saved jobs methods
  saveJob(savedJob: InsertSavedJob): Promise<SavedJob>;
  removeSavedJob(jobId: number, jobSeekerId: number): Promise<void>;
  getSavedJobsByJobSeekerId(jobSeekerId: number): Promise<(SavedJob & { job: Job })[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private jobSeekerProfiles: Map<number, JobSeekerProfile>;
  private employerProfiles: Map<number, EmployerProfile>;
  private jobs: Map<number, Job>;
  private applications: Map<number, Application>;
  private savedJobs: Map<number, SavedJob>;
  
  sessionStore: session.SessionStore;
  currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.jobSeekerProfiles = new Map();
    this.employerProfiles = new Map();
    this.jobs = new Map();
    this.applications = new Map();
    this.savedJobs = new Map();
    
    this.currentId = {
      user: 1,
      jobSeekerProfile: 1,
      employerProfile: 1,
      job: 1,
      application: 1,
      savedJob: 1
    };
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.user++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  async getUserWithProfile(id: number): Promise<UserWithProfile | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const userWithProfile: UserWithProfile = { ...user };

    if (user.role === "job_seeker") {
      userWithProfile.jobSeekerProfile = Array.from(this.jobSeekerProfiles.values()).find(
        (profile) => profile.userId === id
      );
    } else if (user.role === "employer") {
      userWithProfile.employerProfile = Array.from(this.employerProfiles.values()).find(
        (profile) => profile.userId === id
      );
    }

    return userWithProfile;
  }

  // Profile methods
  async createOrUpdateJobSeekerProfile(profile: InsertJobSeekerProfile): Promise<JobSeekerProfile> {
    const existingProfile = Array.from(this.jobSeekerProfiles.values()).find(
      (p) => p.userId === profile.userId
    );

    if (existingProfile) {
      const updatedProfile = { ...existingProfile, ...profile };
      this.jobSeekerProfiles.set(existingProfile.id, updatedProfile);
      return updatedProfile;
    }

    const id = this.currentId.jobSeekerProfile++;
    const newProfile: JobSeekerProfile = { ...profile, id };
    this.jobSeekerProfiles.set(id, newProfile);
    return newProfile;
  }

  async createOrUpdateEmployerProfile(profile: InsertEmployerProfile): Promise<EmployerProfile> {
    const existingProfile = Array.from(this.employerProfiles.values()).find(
      (p) => p.userId === profile.userId
    );

    if (existingProfile) {
      const updatedProfile = { ...existingProfile, ...profile };
      this.employerProfiles.set(existingProfile.id, updatedProfile);
      return updatedProfile;
    }

    const id = this.currentId.employerProfile++;
    const newProfile: EmployerProfile = { ...profile, id };
    this.employerProfiles.set(id, newProfile);
    return newProfile;
  }

  // Job methods
  async createJob(job: InsertJob & { employerId: number }): Promise<Job> {
    const id = this.currentId.job++;
    const createdAt = new Date();
    const newJob: Job = { ...job, id, createdAt, views: 0 };
    this.jobs.set(id, newJob);
    return newJob;
  }

  async getJobs(filters?: any): Promise<JobWithEmployer[]> {
    let jobs = Array.from(this.jobs.values());

    // Apply filters if provided
    if (filters) {
      if (filters.sector) {
        jobs = jobs.filter(job => job.sector === filters.sector);
      }
      if (filters.type) {
        jobs = jobs.filter(job => job.type === filters.type);
      }
      if (filters.location) {
        jobs = jobs.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
      }
      if (filters.status) {
        jobs = jobs.filter(job => job.status === filters.status);
      }
    }

    // Sort by created date (newest first)
    jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Enhance jobs with employer details
    return Promise.all(jobs.map(async job => {
      const employer = await this.getUser(job.employerId) as User;
      const employerProfile = Array.from(this.employerProfiles.values()).find(
        profile => profile.userId === employer.id
      );
      
      return {
        ...job,
        employer: {
          ...employer,
          employerProfile
        }
      };
    }));
  }

  async getJobById(id: number): Promise<JobWithEmployer | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;

    const employer = await this.getUser(job.employerId) as User;
    const employerProfile = Array.from(this.employerProfiles.values()).find(
      profile => profile.userId === employer.id
    );
    
    return {
      ...job,
      employer: {
        ...employer,
        employerProfile
      }
    };
  }

  async getJobsByEmployerId(employerId: number): Promise<Job[]> {
    return Array.from(this.jobs.values())
      .filter(job => job.employerId === employerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async incrementJobViews(jobId: number): Promise<void> {
    const job = this.jobs.get(jobId);
    if (job) {
      job.views += 1;
      this.jobs.set(jobId, job);
    }
  }

  // Application methods
  async createApplication(application: InsertApplication): Promise<Application> {
    const id = this.currentId.application++;
    const createdAt = new Date();
    const newApplication: Application = { ...application, id, createdAt };
    this.applications.set(id, newApplication);
    return newApplication;
  }

  async getApplicationsByJobSeekerId(jobSeekerId: number): Promise<(Application & { job: Job })[]> {
    const applications = Array.from(this.applications.values())
      .filter(app => app.jobSeekerId === jobSeekerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return applications.map(app => ({
      ...app,
      job: this.jobs.get(app.jobId)!
    }));
  }

  async getApplicationsByEmployerId(employerId: number): Promise<(Application & { job: Job, jobSeeker: User })[]> {
    // First get all jobs by this employer
    const employerJobs = Array.from(this.jobs.values())
      .filter(job => job.employerId === employerId)
      .map(job => job.id);

    // Then get applications for these jobs
    const applications = Array.from(this.applications.values())
      .filter(app => employerJobs.includes(app.jobId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return applications.map(app => ({
      ...app,
      job: this.jobs.get(app.jobId)!,
      jobSeeker: this.users.get(app.jobSeekerId)!
    }));
  }

  // Saved jobs methods
  async saveJob(savedJob: InsertSavedJob): Promise<SavedJob> {
    // Check if already saved
    const existing = Array.from(this.savedJobs.values()).find(
      sj => sj.jobId === savedJob.jobId && sj.jobSeekerId === savedJob.jobSeekerId
    );

    if (existing) {
      return existing;
    }

    const id = this.currentId.savedJob++;
    const createdAt = new Date();
    const newSavedJob: SavedJob = { ...savedJob, id, createdAt };
    this.savedJobs.set(id, newSavedJob);
    return newSavedJob;
  }

  async removeSavedJob(jobId: number, jobSeekerId: number): Promise<void> {
    const savedJobToRemove = Array.from(this.savedJobs.values()).find(
      sj => sj.jobId === jobId && sj.jobSeekerId === jobSeekerId
    );

    if (savedJobToRemove) {
      this.savedJobs.delete(savedJobToRemove.id);
    }
  }

  async getSavedJobsByJobSeekerId(jobSeekerId: number): Promise<(SavedJob & { job: Job })[]> {
    const savedJobs = Array.from(this.savedJobs.values())
      .filter(sj => sj.jobSeekerId === jobSeekerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return savedJobs.map(sj => ({
      ...sj,
      job: this.jobs.get(sj.jobId)!
    }));
  }
}

export const storage = new MemStorage();
