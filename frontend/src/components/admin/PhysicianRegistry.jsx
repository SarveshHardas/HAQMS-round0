import { Award, Search } from 'lucide-react';

export default function PhysicianRegistry({
  adminSearchQuery,
  setAdminSearchQuery,
  searchPhysiciansAdmin,
  doctorsList,
}) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card shadow-xs space-y-6 text-foreground">
      <div>
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Award className="h-4.5 w-4.5 text-primary" />
          Staff Physicians Registry Lookup
        </h3>
        <p className="text-xs text-muted-foreground font-medium mt-0.5">
          Database lookup for credentials. Uses a raw SQL interpolation backend query.
        </p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 rounded-lg shadow-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={adminSearchQuery}
            onChange={(e) => setAdminSearchQuery(e.target.value)}
            placeholder="Enter physician name search criteria (raw syntax supported)..."
            className="block w-full pl-9 pr-3 py-2 border border-border bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-normal"
          />
        </div>

        <button
          onClick={searchPhysiciansAdmin}
          className="px-4 py-2 bg-primary text-primary-foreground font-semibold text-xs rounded-lg hover:bg-primary/95 transition-colors cursor-pointer"
        >
          Execute SQL Query
        </button>
      </div>

      {/* Doctors Result List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {doctorsList.length > 0 ? (
          doctorsList.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-xl border border-border bg-secondary/20 flex flex-col justify-between"
            >
              <div>
                <span className="inline-flex px-1.5 py-0.5 rounded text-xxs font-semibold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20 mb-2">
                  {doc.department}
                </span>

                <h4 className="font-bold text-foreground text-sm">
                  {doc.name}
                </h4>

                <p className="text-xxs text-muted-foreground mt-0.5 font-medium">
                  {doc.specialization}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
                <span>Exp: {doc.experience} yrs</span>

                <span className="font-bold text-primary">
                  Fee: ${doc.consultationFee}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-xs text-muted-foreground font-medium">
            No physicians found.
          </div>
        )}
      </div>
    </div>
  );
}