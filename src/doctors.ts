import prisma from './lib/prisma.js';

export interface CreateDoctorInput {
  name: string;
  specialty: string;
  email: string;
}

export async function createDoctor(data: CreateDoctorInput) {
  return prisma.doctor.create({ data });
}

export async function getDoctor(id: number) {
  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (doctor === null) throw new Error(`Doctor ${id} not found`);
  return doctor;
}

export async function listDoctorsBySpecialty(specialty: string) {
  return prisma.doctor.findMany({
    where: { specialty: { contains: specialty } },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, specialty: true, email: true },
  });
}

// Deleting a doctor with appointments is rejected by the database (ON DELETE RESTRICT).
export async function deleteDoctor(id: number) {
  return prisma.doctor.delete({ where: { id } });
}
