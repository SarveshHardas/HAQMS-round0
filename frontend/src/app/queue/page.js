'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import { Bell, Monitor, RefreshCw, AlertCircle } from 'lucide-react';

export default function QueueMonitor() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/queue`);
        const data = await res.json();

        if (mounted) {
          setTokens(data.data?.tokens || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 3000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Group tokens by doctor
  const groupedTokens = (tokens || []).reduce((groups, token) => {
    const docId = token.doctorId;
    if (!groups[docId]) {
      groups[docId] = {
        doctorName: token.doctor?.name || 'Unknown Doctor',
        specialization: token.doctor?.specialization || 'Unknown Specialization',
        calling: null,
        waiting: [],
      };
    }

    if (token.status === 'CALLING') {
      groups[docId].calling = token;
    } else if (token.status === 'WAITING') {
      groups[docId].waiting.push(token);
    }
    return groups;
  }, {});

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8">
        {/* Header Dashboard Banner */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-xs mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg shrink-0">
              <Monitor className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                Live Public Monitor Board
              </h1>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Real-time physician calling boards. Auto-syncs every 3 seconds.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xxs font-bold uppercase tracking-wider border border-primary/20">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Auto Refreshing
            </span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 mb-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3 text-sm font-medium">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <strong>Sync Error:</strong> {error} - Please verify that the backend API server is online.
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && tokens.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="pulse-loader">
              <div></div>
              <div></div>
            </div>
            <p className="mt-4 text-xs font-semibold text-muted-foreground">Loading active token queues...</p>
          </div>
        ) : Object.keys(groupedTokens).length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-card border border-dashed border-border">
            <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-bold text-foreground">No Active Tokens</h3>
            <p className="mt-1 text-muted-foreground text-xs max-w-md mx-auto leading-relaxed">
              There are currently no patient check-ins registered for today. Use the receptionist portal in the Staff Dashboard to check-in patients.
            </p>
          </div>
        ) : (
          /* Grid of Doctor Calling Boards */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groupedTokens).map(([docId, docInfo]) => (
              <div
                key={docId}
                className="rounded-xl border border-border bg-card shadow-xs overflow-hidden flex flex-col h-full hover:border-primary/45 hover:shadow-xs transition-all duration-200"
              >
                {/* Doctor Title Header */}
                <div className="bg-secondary/30 p-4 border-b border-border">
                  <h3 className="font-bold text-base text-foreground">{docInfo.doctorName}</h3>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-0.5">
                    {docInfo.specialization}
                  </p>
                </div>

                {/* Token Display Grid */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  {/* Current Active Token Box */}
                  <div className="mb-5">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Now Calling
                    </h4>
                    {docInfo.calling ? (
                      <div className="bg-primary/5 border border-primary/20 p-5 rounded-lg text-center shadow-xs">
                        <span className="block text-4xl font-extrabold text-primary tracking-wide">
                          #{docInfo.calling.tokenNumber}
                        </span>
                        <span className="block text-xxs font-semibold text-muted-foreground uppercase tracking-wider mt-1.5">
                          Patient: {docInfo.calling.patient?.name || 'Unknown Patient'}
                        </span>
                      </div>
                    ) : (
                      <div className="bg-secondary/40 border border-border p-5 rounded-lg text-center shadow-xs">
                        <span className="block text-xl font-bold text-muted-foreground tracking-wider italic">
                          Idle
                        </span>
                        <span className="block text-xxs text-muted-foreground/80 mt-1">
                          No active patients being called
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Upcoming Tokens list */}
                  <div>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Queue List
                    </h4>
                    {docInfo.waiting.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {docInfo.waiting.map((token) => (
                          <div
                            key={token.id}
                            className="px-2.5 py-1 rounded-md bg-secondary border border-border text-xxs font-bold text-foreground"
                            title={`Patient: ${token.patient?.name}`}
                          >
                            #{token.tokenNumber}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xxs text-muted-foreground italic block">
                        No upcoming patients in queue
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


