import prisma from './lib/prisma.js';

async function main(): Promise<void> {
  // This seed script is for a development database; it replaces existing rows.
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();

  const [drPriya, drVikram] = await Promise.all([
    prisma.doctor.create({
      data: {
        name: 'Dr. Priya Sharma',
        specialty: 'Cardiology',
        email: 'priya.sharma@hospital.io',
      },
    }),
    prisma.doctor.create({
      data: {
        name: 'Dr. Vikram Rao',
        specialty: 'Neurology',
        email: 'vikram.rao@hospital.io',
      },
    }),
  ]);

  const [aditi, rahul] = await Promise.all([
    prisma.patient.create({
      data: {
        name: 'Aditi Mehra',
        email: 'aditi@example.com',
        phone: '9876543210',
        dateOfBirth: new Date('1990-04-12T00:00:00.000Z'),
      },
    }),
    prisma.patient.create({
      data: { name: 'Rahul Singh', email: 'rahul@example.com' },
    }),
  ]);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const dayAfter = new Date(nextWeek);
  dayAfter.setDate(dayAfter.getDate() + 1);

  await prisma.appointment.createMany({
    data: [
      {
        appointmentDate: nextWeek,
        status: 'scheduled',
        notes: 'Annual cardiac checkup',
        patientId: aditi.id,
        doctorId: drPriya.id,
      },
      {
        appointmentDate: dayAfter,
        status: 'scheduled',
        patientId: rahul.id,
        doctorId: drVikram.id,
      },
    ],
  });

  console.log('Seed complete:');
  console.log(' Doctors:', 2);
  console.log(' Patients:', 2);
  console.log(' Appointments:', 2);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
