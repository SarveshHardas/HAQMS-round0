import { TrendingUp } from 'lucide-react';

export default function ReportsPanel({
  generateSystemReport,
  adminReportLoading,
  adminReportData,
}) {
  return (
    <div className="space-y-6 text-foreground">
      <div className="p-6 rounded-xl border border-border bg-card shadow-xs">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
              Doctor Revenue & Operations Report
            </h3>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              System-wide practitioner performance audits. Computes completed bookings and potential sales.
            </p>
          </div>
          <button
            onClick={generateSystemReport}
            disabled={adminReportLoading}
            className="px-4 py-2 bg-primary text-primary-foreground font-semibold text-xs rounded-lg hover:bg-primary/95 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {adminReportLoading ? 'Aggregating...' : 'Load Doctor System Audit Report'}
          </button>
        </div>

        {adminReportLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="pulse-loader">
              <div></div>
              <div></div>
            </div>
            <p className="mt-4 text-xs font-semibold text-muted-foreground animate-pulse">
              Executing sequential nested loop aggregates. Event loop is locked...
            </p>
          </div>
        ) : !adminReportData ? (
          <div className="p-8 text-center bg-secondary border border-dashed border-border rounded-lg text-muted-foreground text-xs font-medium">
            Click the button above to load reports. Warning: Endpoint is extremely slow on larger doctor count tables!
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary widgets */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 bg-secondary/25 border border-border rounded-lg shadow-xs">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Total Physicians</span>
                <h4 className="text-xl font-bold text-foreground mt-1">{adminReportData.data.reports.length}</h4>
              </div>
              <div className="p-4 bg-secondary/25 border border-border rounded-lg shadow-xs">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Sum appointments</span>
                <h4 className="text-xl font-bold text-foreground mt-1">
                  {adminReportData.data.reports.reduce((sum, item) => sum + item.totalAppointments, 0)}
                </h4>
              </div>
              <div className="p-4 bg-secondary/25 border border-border rounded-lg shadow-xs">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Total Sales ($)</span>
                <h4 className="text-xl font-bold text-primary mt-1">
                  ${adminReportData.data.reports.reduce((sum, item) => sum + item.revenue, 0)}
                </h4>
              </div>
            </div>

            {/* Table representation */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-sm text-left">
                <thead>
                  <tr className="text-muted-foreground uppercase tracking-wider text-[10px] font-bold border-b border-border">
                    <th className="pb-3">Doctor</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3 text-center">Consultations</th>
                    <th className="pb-3 text-center">Today Queue</th>
                    <th className="pb-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {adminReportData.data.reports.length > 0 ? (
                    adminReportData.data.reports.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-secondary/30 transition-colors"
                      >
                        <td className="py-3 font-bold text-foreground">
                          {item.name}

                          <span className="block text-[10px] text-primary font-semibold uppercase mt-0.5">
                            {item.specialization}
                          </span>
                        </td>

                        <td className="py-3 text-muted-foreground font-medium text-xs">
                          {item.department}
                        </td>

                        <td className="py-3 text-center text-muted-foreground text-xs">
                          {item.completedAppointments} Completed / {item.totalAppointments} Total
                        </td>

                        <td className="py-3 text-center font-semibold text-foreground text-xs">
                          {item.todayQueueSize} in queue
                        </td>

                        <td className="py-3 text-right font-bold text-primary">
                          ${item.revenue}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 text-center text-xs text-muted-foreground font-medium"
                      >
                        No reports available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}