import { ClipboardList, Search, Trash2 } from 'lucide-react';

export default function PatientRegistry({
  patients,
  patientsLoading,
  patientSearch,
  setPatientSearch,
  patientGender,
  setPatientGender,
  patientsPagination,
  fetchPatients,
  handleQueueCheckin,
  handleDeletePatient,
  doctorsList,
  setSelectedPatientForCheckin,
  setIsCheckinModalOpen,
  // Destructure added modal props
  isCheckinModalOpen,
  selectedPatientForCheckin,
  selectedDoctorForCheckin,
  setSelectedDoctorForCheckin,
}) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card shadow-xs text-foreground">
      <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
        <ClipboardList className="h-4.5 w-4.5 text-primary" />
        Patient Lookup Directory
      </h3>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 rounded-lg shadow-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="block w-full pl-9 pr-3 py-2 border border-border bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-normal"
          />
        </div>

        <select
          value={patientGender}
          onChange={(e) => setPatientGender(e.target.value)}
          className="px-3 py-2 border border-border bg-background rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal cursor-pointer"
        >
          <option value="All">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Table listing */}
      {patientsLoading ? (
        <p className="text-center py-6 text-muted-foreground animate-pulse text-xs font-semibold">Synchronizing table data...</p>
      ) : patients.length === 0 ? (
        <p className="text-center py-6 text-muted-foreground text-xs font-semibold">No registered patients match this filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm text-left">
            <thead>
              <tr className="text-muted-foreground uppercase tracking-wider text-[10px] font-bold border-b border-border">
                <th className="pb-3">Name</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Age/Sex</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3 font-semibold text-foreground">
                    {p.name}
                    {p.email && <span className="block text-xxs text-muted-foreground font-normal mt-0.5">{p.email}</span>}
                  </td>
                  <td className="py-3 text-muted-foreground font-medium text-xs">{p.phoneNumber}</td>
                  <td className="py-3 text-muted-foreground text-xs">
                    {p.age} yrs / <span className="capitalize">{p.gender}</span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedPatientForCheckin(p);
                        setIsCheckinModalOpen(true);
                      }}
                      className="text-xxs px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/20 font-bold hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    >
                      Check In
                    </button>

                    <button
                      onClick={() => handleDeletePatient(p.id)}
                      className="text-xxs p-1.5 rounded bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                      title="Delete patient record"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination control */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground font-medium">
          Page {patientsPagination.page} of {patientsPagination.totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={patientsPagination.page <= 1}
            onClick={() => fetchPatients(patientsPagination.page - 1)}
            className="px-3 py-1 bg-card text-foreground rounded border border-border hover:bg-secondary disabled:opacity-40 text-xs font-semibold transition-colors cursor-pointer"
          >
            Prev
          </button>
          <button
            disabled={patientsPagination.page >= patientsPagination.totalPages}
            onClick={() => fetchPatients(patientsPagination.page + 1)}
            className="px-3 py-1 bg-card text-foreground rounded border border-border hover:bg-secondary disabled:opacity-40 text-xs font-semibold transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      {/* Standard Queue Check-in Modal Overlay */}
      {isCheckinModalOpen && selectedPatientForCheckin && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border shadow-md rounded-xl max-w-sm w-full p-6 space-y-4 text-foreground animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-base font-bold text-foreground">Patient Check-in</h3>
              <p className="text-xs text-muted-foreground mt-1 font-semibold">
                Generate an immediate active token for {selectedPatientForCheckin.name}.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-foreground/80 mb-1.5">Assign Practitioner*</label>
                <select
                  value={selectedDoctorForCheckin}
                  onChange={(e) => setSelectedDoctorForCheckin(e.target.value)}
                  className="block w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal cursor-pointer"
                >
                  <option value="">-- Choose Practitioner --</option>
                  {doctorsList.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsCheckinModalOpen(false);
                  setSelectedPatientForCheckin(null);
                  setSelectedDoctorForCheckin('');
                }}
                className="px-3 py-2 bg-secondary border border-border hover:bg-secondary/80 text-foreground font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedDoctorForCheckin}
                onClick={() => {
                  handleQueueCheckin(
                    selectedPatientForCheckin.id,
                    selectedDoctorForCheckin
                  );
                  setIsCheckinModalOpen(false);
                  setSelectedPatientForCheckin(null);
                  setSelectedDoctorForCheckin('');
                }}
                className="px-3.5 py-2 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                Confirm Check-in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}