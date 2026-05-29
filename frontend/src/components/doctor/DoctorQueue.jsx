import { Clock } from 'lucide-react';

export default function DoctorQueue({
  doctorQueue,
  handleUpdateQueueStatus,
}) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card shadow-xs text-foreground">

      <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
        <Clock className="h-4.5 w-4.5 text-primary" />
        Active Operations Queue Controller
      </h3>
      <p className="text-xs text-muted-foreground mb-6 font-medium leading-relaxed">
        Manage patient call sequences for live monitors. Update status from waiting to active calling.
      </p>

      {doctorQueue.length === 0 ? (
        <p className="text-center py-6 text-muted-foreground text-xs font-semibold">No checked-in patients in queue today.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctorQueue.map((t) => (
            <div
              key={t.id}
              className={`p-5 rounded-xl border shadow-xs relative overflow-hidden flex flex-col justify-between ${t.status === 'CALLING' ? 'border-primary bg-primary/10' : 'border-border bg-secondary/30'}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xl font-bold text-foreground">Token #{t.tokenNumber}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${t.status === 'CALLING' ? 'bg-primary/20 text-primary border-primary/30' : t.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'}`}>
                  {t.status}
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold text-foreground">{t.patient.name}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Contact: {t.patient.phoneNumber}</p>
              </div>

              <div className="mt-6 flex gap-2">
                {t.status === 'WAITING' && (
                  <button
                    onClick={() => handleUpdateQueueStatus(t.id, 'CALLING')}
                    className="flex-1 py-1.5 bg-primary text-primary-foreground font-semibold text-xxs rounded hover:bg-primary/95 transition-colors cursor-pointer"
                  >
                    Call Patient
                  </button>
                )}
                {t.status === 'CALLING' && (
                  <>
                    <button
                      onClick={() => handleUpdateQueueStatus(t.id, 'COMPLETED')}
                      className="flex-1 py-1.5 bg-primary text-primary-foreground font-semibold text-xxs rounded hover:bg-primary/95 transition-colors cursor-pointer"
                    >
                      Consulted
                    </button>
                    <button
                      onClick={() => handleUpdateQueueStatus(t.id, 'SKIPPED')}
                      className="flex-1 py-1.5 bg-destructive/15 text-destructive hover:bg-destructive hover:text-white border border-destructive/20 font-semibold text-xxs rounded transition-colors cursor-pointer"
                    >
                      Skip / No Show
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}