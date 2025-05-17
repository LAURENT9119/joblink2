
import PDFDocument from 'pdfkit';
import { JobSeekerProfile, User } from '@shared/schema';
import { formatDate } from '../lib/utils';

export async function generateCV(user: User, profile: JobSeekerProfile): Promise<Buffer> {
  const doc = new PDFDocument();
  const buffers: Buffer[] = [];

  doc.on('data', buffers.push.bind(buffers));

  // Header
  doc.fontSize(25).text(`${user.firstName} ${user.lastName}`, 50, 50);
  doc.fontSize(10)
    .text(user.email, 50, 80)
    .text(user.phone, 50, 95)
    .text(profile.location, 50, 110);

  // Skills section
  doc.moveDown()
    .fontSize(16)
    .text('Compétences', 50, 150);
  
  profile.skills.forEach((skill, index) => {
    doc.fontSize(10)
      .text(`• ${skill}`, 70, 180 + (index * 15));
  });

  // Experience section
  doc.moveDown(2)
    .fontSize(16)
    .text('Expérience', 50, 280);
  
  doc.fontSize(10)
    .text(profile.experience || 'Pas d\'expérience renseignée', 70, 310);

  // Desired sectors
  doc.moveDown(2)
    .fontSize(16)
    .text('Secteurs souhaités', 50, 380);
  
  profile.desiredSectors.forEach((sector, index) => {
    doc.fontSize(10)
      .text(`• ${sector}`, 70, 410 + (index * 15));
  });

  // Footer
  doc.fontSize(8)
    .text(`CV généré le ${formatDate(new Date())}`, 50, 700)
    .text('Via JobLink - Plateforme inclusive de recherche d\'emploi', 50, 715);

  doc.end();
  return Buffer.concat(buffers);
}
