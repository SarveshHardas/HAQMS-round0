import { CalendarDays, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DoctorAppointments({
  doctorAppointments,
  selectedPatientHistory,
  setSelectedPatientHistory,
  doctorsList,
  user,
  handleQueueCheckin,
  handleCompleteAppointment,
}) {
  return (
    <div className="space-y-6 text-foreground">
      <div className="p-6 rounded-xl border border-border bg-card shadow-xs">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
          <CalendarDays className="h-4.5 w-4.5 text-primary" />
          Scheduled Daily Bookings List
        </h3>

        {doctorAppointments.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground text-xs font-semibold">No appointments scheduled for you today.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm text-left">
              <thead>
                <tr className="text-muted-foreground uppercase tracking-wider text-[10px] font-bold border-b border-border">
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Consultation Reason</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {doctorAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-secondary/35 transition-colors">
                    <td className="py-3 font-mono font-semibold text-foreground text-xs">
                      {new Date(app.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => setSelectedPatientHistory(app.patient)}
                        className="font-bold text-primary hover:underline transition-colors cursor-pointer"
                      >
                        {app.patient ? app.patient.name : 'Unknown Patient'}
                      </button>
                      <span className="block text-xxs text-muted-foreground mt-0.5 font-medium">Age: {app.patient?.age}</span>
                    </td>
                    <td className="py-3 text-muted-foreground font-semibold text-xs">{app.reason || 'None provided'}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-medium border ${app.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' : app.status === 'CANCELLED' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      {app.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => {
                              const matchedDoc = doctorsList.find(
                                (d) => d.userId === user.id
                              );

                              if (!matchedDoc) {
                                console.error('Doctor profile not found');
                                return;
                              }

                              handleQueueCheckin(
                                app.patientId,
                                matchedDoc.id,
                                app.id
                              );
                            }}
                            className="text-xxs px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/20 font-bold hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                          >
                            Check In
                          </button>
                          <button
                            onClick={() => handleCompleteAppointment(app.id)}
                            className="text-xxs px-2.5 py-1 rounded bg-secondary border border-border text-foreground hover:bg-secondary/80 font-bold transition-colors cursor-pointer"
                          >
                            Complete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Clinical History Modal Display */}
      {selectedPatientHistory && (
        <div className="p-6 rounded-xl border border-border bg-card shadow-xs space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Medical Records: {selectedPatientHistory.name}
              </h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                Gender: {selectedPatientHistory.gender} | Contact: {selectedPatientHistory.phoneNumber}
              </p>
            </div>
            <button
              onClick={() => setSelectedPatientHistory(null)}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="p-4 rounded-lg bg-secondary/30 border border-border text-xs space-y-2">
            <h4 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Clinical Background Information</h4>

            <p className="text-foreground leading-relaxed text-xs font-medium">
              {selectedPatientHistory.medicalHistory?.toUpperCase() || 'No medical history on file.'}
            </p>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <Link
              href={`/patients/${selectedPatientHistory.id}/history-records`}
              className="text-primary font-bold hover:underline flex items-center gap-1"
            >
              View Diagnostic Reports Details (Legacy App)
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}