
import { db } from './storage';
import { jobs, users, jobSeekerProfiles, employerProfiles, applications } from '@shared/schema';

async function seed() {
  console.log('Seeding test users...');
  
  // Employer profiles
  await db.insert(users).values([{
    id: 1,
    email: 'employer@test.com',
    phone: '+221777777777',
    password: 'test123',
    firstName: 'Moussa',
    lastName: 'Diop',
    role: 'employer',
    preferredLanguage: 'wo'
  }]);

  await db.insert(employerProfiles).values([{
    userId: 1,
    companyName: 'Dakar Services',
    sector: 'services',
    location: 'Dakar, Plateau',
    companySize: '10-50',
    description: 'Entreprise de services multiples'
  }]);

  // Job seeker profiles
  await db.insert(users).values([{
    id: 2,
    email: 'jobseeker@test.com',
    phone: '+221788888888',
    password: 'test123',
    firstName: 'Fatou',
    lastName: 'Sow',
    role: 'jobSeeker',
    preferredLanguage: 'wo'
  }]);

  await db.insert(jobSeekerProfiles).values([{
    userId: 2,
    location: 'Dakar, Medina',
    age: 25,
    skills: ['cleaning', 'cooking', 'customer_service'],
    desiredSectors: ['hospitality', 'services'],
    experience: '2 ans d\'expérience en restauration',
    audioPresentation: 'presentations/audio1.mp3'
  }]);

  // Sample jobs
  await db.insert(jobs).values([{
    id: 1,
    employerId: 1,
    title: 'Agent d\'entretien',
    description: 'Nous recherchons un agent d\'entretien pour nos bureaux',
    type: 'full_time',
    sector: 'services',
    location: 'Dakar, Plateau',
    contactPhone: '+221777777777',
    contactEmail: 'employer@test.com',
    startDate: new Date().toISOString(),
    duration: '6 mois',
    createdAt: new Date().toISOString()
  }]);

  // Sample application
  await db.insert(applications).values([{
    jobId: 1,
    jobSeekerId: 2,
    status: 'pending',
    message: 'Je suis très intéressé par ce poste',
    createdAt: new Date().toISOString()
  }]);

  console.log('Test users and data seeded successfully!');
}

export default seed;
