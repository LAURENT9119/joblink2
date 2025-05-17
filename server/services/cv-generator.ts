
import PDFDocument from 'pdfkit';
import { JobSeeker } from '@shared/schema';

export async function generateCV(jobSeeker: JobSeeker): Promise<Buffer> {
  const doc = new PDFDocument();
  const buffers: Buffer[] = [];

  doc.on('data', buffers.push.bind(buffers));
  
  // Add content
  doc.fontSize(25).text(jobSeeker.firstName + ' ' + jobSeeker.lastName, 50, 50);
  doc.fontSize(10).text(jobSeeker.email, 50, 80);
  doc.fontSize(10).text(jobSeeker.phone, 50, 95);
  
  // Add skills
  doc.fontSize(16).text('Compétences', 50, 130);
  jobSeeker.skills.forEach((skill, index) => {
    doc.fontSize(10).text(`• ${skill}`, 70, 160 + (index * 15));
  });
  
  // Add experience
  doc.fontSize(16).text('Expérience', 50, 280);
  
  doc.end();
  
  return Buffer.concat(buffers);
}
