
import { generateCV } from '../services/cv-generator';
import { User, JobSeekerProfile } from '@shared/schema';

describe('CV Generator', () => {
  const mockUser: User = {
    id: 1,
    firstName: 'Fatou',
    lastName: 'Sow',
    email: 'fatou@example.com',
    phone: '+221777777777',
    role: 'jobSeeker',
    preferredLanguage: 'wo'
  };

  const mockProfile: JobSeekerProfile = {
    userId: 1,
    location: 'Dakar, Medina',
    age: 25,
    skills: ['cleaning', 'cooking', 'customer_service'],
    desiredSectors: ['hospitality', 'services'],
    experience: '2 ans d\'expérience en restauration',
    audioPresentation: 'presentations/audio1.mp3'
  };

  it('should generate a PDF buffer', async () => {
    const buffer = await generateCV(mockUser, mockProfile);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should handle missing optional fields', async () => {
    const profileWithoutOptionals = { ...mockProfile, experience: null };
    const buffer = await generateCV(mockUser, profileWithoutOptionals);
    expect(buffer).toBeInstanceOf(Buffer);
  });
});
