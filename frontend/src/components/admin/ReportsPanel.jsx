import { TrendingUp } from 'lucide-react';

export default function ReportsPanel({
  generateSystemReport,
  adminReportLoading,
  adminReportData,
}) {
  return (
    <div className="space-y-8">
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              Doctor Revenue & Operations Report
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
              System-wide practitioner performance audits. Computes completed bookings and potential sales.
            </p>
          </div>
          <button
            onClick={generateSystemReport}
            disabled={adminReportLoading}
            className="glow-btn px-4 py-2 bg-teal-600 text-white font-extrabold text-xs rounded-lg shadow hover:bg-teal-700 disabled:opacity-50 transition-colors"
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
            <p className="mt-4 text-xs font-semibold text-slate-400 animate-pulse">
              Executing sequential nested loop aggregates. Event loop is locked...
            </p>
          </div>
        ) : !adminReportData ? (
          <div className="p-8 text-center bg-slate-100 dark:bg-slate-800/40 rounded-xl text-slate-400 text-xs font-semibold border border-dashed border-slate-200 dark:border-slate-700">
            Click the button above to load reports. Warning: Endpoint is extremely slow on larger doctor count tables!
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary widgets */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 bg-slate-500/5 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold">Total Physicians</span>
                <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{adminReportData.data.reports.length}</h4>
              </div>
              <div className="p-4 bg-slate-500/5 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold">Sum appointments</span>
                <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
                  {adminReportData.data.reports.reduce((sum, item) => sum + item.totalAppointments, 0)}
                </h4>
              </div>
              <div className="p-4 bg-slate-500/5 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold">Total Sales ($)</span>
                <h4 className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
                  ${adminReportData.data.reports.reduce((sum, item) => sum + item.revenue, 0)}
                </h4>
              </div>
            </div>

            {/* Table representation */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm text-left">
                <thead>
                  <tr className="text-slate-400 uppercase tracking-widest text-xxs font-bold border-b border-slate-200 dark:border-slate-800">
                    <th className="pb-3">Doctor</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3 text-center">Consultations</th>
                    <th className="pb-3 text-center">Today Queue</th>
                    <th className="pb-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {adminReportData.data.reports.length > 0 ? (
                    adminReportData.data.reports.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-500/5 transition-colors"
                      >
                        <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">
                          {item.name}

                          <span className="block text-xxs text-teal-600 dark:text-teal-400 font-semibold uppercase mt-0.5">
                            {item.specialization}
                          </span>
                        </td>

                        <td className="py-3.5 text-slate-500 dark:text-slate-400">
                          {item.department}
                        </td>

                        <td className="py-3.5 text-center text-slate-500 dark:text-slate-400">
                          {item.completedAppointments} Completed / {item.totalAppointments} Total
                        </td>

                        <td className="py-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                          {item.todayQueueSize} in queue
                        </td>

                        <td className="py-3.5 text-right font-bold text-teal-600 dark:text-teal-400">
                          ${item.revenue}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 text-center text-sm text-slate-400"
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