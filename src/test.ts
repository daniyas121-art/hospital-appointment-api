import prisma from './lib/prisma.js';
import { bookAppointment, cancelAllPatientAppointments, deleteAppointment, getAppointmentFull, getDoctorUpcomingAppointments, setAppointmentStatus } from './appointments.js';
import { createDoctor, deleteDoctor, getDoctor, listDoctorsBySpecialty } from './doctors.js';
import { createPatient, deletePatient, getPatient, searchPatients, updatePatientPhone } from './patients.js';

async function main(): Promise<void> {
  console.log('\n── Patients ──────────────────────────');
  const patient = await createPatient({
    name: 'Test Patient',
    email: `test.patient.${Date.now()}@example.com`,
    phone: '9999999999',
  });
  console.log('Created:', patient.name, patient.id);

  const foundPatient = await getPatient(patient.id);
  console.log('Found:', foundPatient.name);

  const updatedPatient = await updatePatientPhone(patient.id, '8888888888');
  console.log('Updated phone:', updatedPatient.phone);

  const searchResults = await searchPatients('Test Patient');
  console.log('Search results:', searchResults.length);

  console.log('\n── Doctors ───────────────────────────');
  const doctor = await createDoctor({
    name: 'Dr. Test',
    specialty: 'General Medicine',
    email: `dr.test.${Date.now()}@hospital.io`,
  });
  console.log('Created:', doctor.name, doctor.id);

  const foundDoctor = await getDoctor(doctor.id);
  console.log('Found:', foundDoctor.name);

  const specialists = await listDoctorsBySpecialty('General');
  console.log('General Medicine doctors:', specialists.length);

  console.log('\n── Appointments ──────────────────────');
  const appointmentDate = new Date();
  appointmentDate.setDate(appointmentDate.getDate() + 1);
  const booked = await bookAppointment(patient.id, doctor.id, appointmentDate, 'Initial consultation');
  console.log('Booked:', booked.id, 'for', booked.patient.name);

  const fullAppointment = await getAppointmentFull(booked.id);
  console.log('Full fetch:', fullAppointment.patient.name, 'with', fullAppointment.doctor.name);

  const schedule = await getDoctorUpcomingAppointments(doctor.id);
  console.log('Doctor schedule:', schedule.length, 'appointment(s)');

  let restrictionEnforced = false;
  try {
    await deleteDoctor(doctor.id);
  } catch (error: unknown) {
    if (!(error instanceof Error)) throw error;
    restrictionEnforced = true;
    console.log('Doctor delete restricted while appointments exist.');
  }
  if (!restrictionEnforced) {
    throw new Error('Expected deleting a doctor with an appointment to be restricted.');
  }

  const completed = await setAppointmentStatus(booked.id, 'completed');
  console.log('Status updated to:', completed.status);

  const secondPatient = await createPatient({
    name: 'Cascade Test Patient',
    email: `cascade.${Date.now()}@example.com`,
  });
  const secondAppointment = await bookAppointment(secondPatient.id, doctor.id, appointmentDate);
  const cancelledCount = await cancelAllPatientAppointments(secondPatient.id);
  console.log('Cancelled scheduled appointments:', cancelledCount);

  await deleteAppointment(booked.id);
  console.log('Deleted appointment:', booked.id);

  // Patient deletion cascades to its remaining appointment.
  await deletePatient(secondPatient.id);
  console.log('Deleted patient with appointment (cascade):', secondPatient.id);

  await deletePatient(patient.id);
  await deleteDoctor(doctor.id);
  console.log('Deleted patient and doctor after appointment cleanup.');
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
