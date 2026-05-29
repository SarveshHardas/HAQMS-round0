'use client';

import Link from 'next/link';
import { Activity, ShieldAlert, MonitorPlay, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen justify-between py-12 px-6 lg:px-8 bg-background text-foreground">
      <div className="max-w-4xl mx-auto w-full text-center mt-12 sm:mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20">
          <Activity className="h-3.5 w-3.5" />
          Live Queue Tracking Enabled
        </div>
        
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-primary">
          HAQMS
        </h1>
        <p className="text-xl sm:text-2xl font-bold mt-3 text-foreground">
          Hospital Appointment & Queue Management System
        </p>
        
        <p className="mt-6 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Welcome to the HAQMS testing environment. This portal serves as a deliberately flawed, 
          fully functional reference application designed to evaluate software engineering candidates.
        </p>

        {/* Action Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
          {/* Card 1: Staff Portal */}
          <Link href="/login" className="group block">  
            <div className="p-6 rounded-xl border border-border bg-card text-card-foreground text-left hover:border-primary hover:shadow-xs transition-all duration-200">
              <div className="p-2.5 bg-primary/10 text-primary rounded-lg w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-bold text-foreground flex items-center gap-1.5">
                Staff Portal
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </h2>
              <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
                Access your specialized dashboard. Supports role-based workflows for Administrators, Doctors, and Receptionists.
              </p>
            </div>
          </Link>

          {/* Card 2: Public Queue Monitor */}
          <Link href="/queue" className="group block">
            <div className="p-6 rounded-xl border border-border bg-card text-card-foreground text-left hover:border-primary hover:shadow-xs transition-all duration-200">
              <div className="p-2.5 bg-primary/10 text-primary rounded-lg w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                <MonitorPlay className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-bold text-foreground flex items-center gap-1.5">
                Live Public Monitor
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </h2>
              <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
                Real-time active queue board tracking patient check-ins and calling tokens by physician. Built with live refresh.
              </p>
            </div>
          </Link>
        </div>

        {/* Assessment Notice Box */}
        <div className="mt-12 max-w-xl mx-auto p-5 rounded-xl border border-destructive/20 bg-destructive/5 flex gap-4 text-left">
          <div className="p-2 bg-destructive/10 text-destructive rounded-lg h-fit shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">Assessment Environment Notice</h3>
            <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
              This repository contains critical architectural, database performance, frontend memory, and security bugs. 
              Your evaluation criteria will measure your ability to identify, trace, profile, and fix these issues systematically.
            </p>
          </div>
        </div>
      </div>

      <footer className="text-center text-muted-foreground text-xxs mt-16 border-t border-border/40 pt-6">
        HAQMS v1.0.0-deliberate-bugs &copy; {new Date().getFullYear()} Candidate Evaluation Framework.
      </footer>
    </div>
  );
}

