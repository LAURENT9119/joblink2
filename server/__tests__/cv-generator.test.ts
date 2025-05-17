
import { generateCV } from '../services/cv-generator';
import { JobSeeker } from '@shared/schema';

describe('CV Generator', () => {
  it('should generate a PDF buffer', async () => {
    const mockJobSeeker: JobSeeker = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123456789',
      skills: ['JavaScript', 'React']
    };

    const buffer = await generateCV(mockJobSeeker);
    expect(buffer).toBeInstanceOf(Buffer);
  });
});
