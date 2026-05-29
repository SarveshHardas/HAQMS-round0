import { CalendarDays, Activity } from 'lucide-react';

export default function BookingPanel({
  patients,
  doctorsList,
  bookingPatientId,
  setBookingPatientId,
  bookingDoctorId,
  setBookingDoctorId,
  bookingDate,
  setBookingDate,
  bookingReason,
  setBookingReason,
  bookingMessage,
  handleBookAppointment,
  handleQueueCheckin,
  walkinPatientId,
  setWalkinPatientId,
  walkinDoctorId,
  setWalkinDoctorId,
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2 text-foreground">
      {/* Book Appointment Card */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-xs">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
          <CalendarDays className="h-4.5 w-4.5 text-primary" />
          Schedule Appointment Slot
        </h3>

        {bookingMessage && (
          <div className={`p-3 text-xs rounded-lg mb-4 font-medium ${bookingMessage.toLowerCase().includes('success') ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
            {bookingMessage}
          </div>
        )}

        <form onSubmit={handleBookAppointment} className="space-y-4 text-xs font-semibold text-foreground/80">
          <div>
            <label className="block mb-1.5">Select Registered Patient*</label>
            <select
              required
              value={bookingPatientId}
              onChange={(e) => setBookingPatientId(e.target.value)}
              className="block w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal cursor-pointer"
            >
              <option value="">-- Choose Patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.phoneNumber})</option>
              ))}
            </select>
            <span className="text-[10px] text-muted-foreground block mt-1 font-medium">If patient is missing, register them in the Patient Directory first.</span>
          </div>

          <div>
            <label className="block mb-1.5">Select Physician*</label>
            <select
              required
              value={bookingDoctorId}
              onChange={(e) => setBookingDoctorId(e.target.value)}
              className="block w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal cursor-pointer"
            >
              <option value="">-- Choose Physician --</option>
              {doctorsList.map(d => (
                <option key={d.id} value={d.id}>{d.name} - {d.specialization} (${d.consultationFee})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1.5">Appointment Date & Time*</label>
            <input
              type="datetime-local"
              required
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="block w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal cursor-pointer"
            />
          </div>

          <div>
            <label className="block mb-1.5">Consultation Objective / Reason</label>
            <input
              type="text"
              value={bookingReason}
              onChange={(e) => setBookingReason(e.target.value)}
              placeholder="Regular diagnostic review, suture removal..."
              className="block w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer mt-2"
          >
            Book Appointment Slot
          </button>
        </form>
      </div>

      {/* Quick Walkin Checkin Token Board */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-xs">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
          <Activity className="h-4.5 w-4.5 text-primary" />
          Active Direct Queue Check-In
        </h3>
        <p className="text-xs text-muted-foreground mb-6 font-medium leading-relaxed">
          Generate an immediate waiting token for a direct walk-in patient. Allocates active positions under selected practitioners.
        </p>

        <div className="space-y-6">
          <div className="space-y-4 text-xs font-semibold text-foreground/80">
            <div>
              <label className="block mb-1.5">Select Walk-in Patient*</label>
              <select
                value={walkinPatientId}
                onChange={(e) => setWalkinPatientId(e.target.value)}
                className="block w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal cursor-pointer"
              >
                <option value="">-- Choose Patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1.5">Assign Physician*</label>
              <select
                value={walkinDoctorId}
                onChange={(e) => setWalkinDoctorId(e.target.value)}
                className="block w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal cursor-pointer"
              >
                <option value="">-- Choose Physician --</option>
                {doctorsList.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                if (!walkinPatientId || !walkinDoctorId) {
                  return;
                }
                handleQueueCheckin(
                  walkinPatientId,
                  walkinDoctorId
                );
              }}
              className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer mt-2"
            >
              Generate Live Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}