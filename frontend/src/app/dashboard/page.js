'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/common/Navbar';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import DoctorDashboard from '@/components/doctor/DoctorDashboard';
import ReceptionistDashboard from '@/components/receptionist/ReceptionistDashboard';

export default function Dashboard() {
  const { user, token, API_BASE_URL } = useAuth();
  const router = useRouter();
  // Global State
  const [activeTab, setActiveTab] = useState('patients');

  // ==========================================
  // STATE FOR RECEPTIONIST WORKFLOWS
  // ==========================================
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [patientGender, setPatientGender] = useState('All');
  const [patientsPagination, setPatientsPagination] = useState({ page: 1, totalPages: 1 });
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [selectedPatientForCheckin, setSelectedPatientForCheckin] = useState(null);
  const [selectedDoctorForCheckin, setSelectedDoctorForCheckin] = useState('');

  // Registration Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState('Male');
  const [regHistory, setRegHistory] = useState('');
  const [regMessage, setRegMessage] = useState('');

  // Queue and Appointment Booking
  const [doctorsList, setDoctorsList] = useState([]);
  const [bookingPatientId, setBookingPatientId] = useState('');
  const [bookingDoctorId, setBookingDoctorId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [checkinMessage, setCheckinMessage] = useState('');

  // ==========================================
  // STATE FOR DOCTOR WORKFLOWS
  // ==========================================
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [doctorQueue, setDoctorQueue] = useState([]);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState(null);

  // ==========================================
  // STATE FOR ADMIN WORKFLOWS
  // ==========================================
  const [adminReportData, setAdminReportData] = useState(null);
  const [adminReportLoading, setAdminReportLoading] = useState(false);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);


  useEffect(() => {
    if (!user) return;

    if (user?.role === 'ADMIN') {
      setActiveTab('reports');
    } else if (user?.role === 'RECEPTIONIST') {
      setActiveTab('patients');
    } else {
      setActiveTab('appointments');
    }
  }, [user]);

  // ==========================================
  // RECEPTIONIST FUNCTIONS
  // ==========================================

  // Fetch Patients List
  const fetchPatients = async (page = 1) => {
    setPatientsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/patients?page=${page}&limit=5&search=${patientSearch}&gender=${patientGender}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPatients(data.data.patients);
        setPatientsPagination({
          page: data.data.pagination.page,
          totalPages: data.data.pagination.totalPages,
          totalPatients: data.data.pagination.total
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPatientsLoading(false);
    }
  };

  // Trigger Patient List Fetch
  useEffect(() => {
    if (user?.role === 'RECEPTIONIST' || user?.role === 'ADMIN') {
      fetchPatients(1);
    }
  }, [patientSearch, patientGender, token, user]);

  // Fetch Doctors for booking drop-down
  const fetchDoctorsDropdown = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/doctors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDoctorsList(data.data.doctors);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDoctorsDropdown();
  }, [token]);

  // Handle Patient Registration
  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    setRegMessage('');

    if (!regName || !regPhone || !regAge) {
      setRegMessage('Error: Name, Age and Phone number are required.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phoneNumber: regPhone,
          age: regAge,
          gender: regGender,
          medicalHistory: regHistory
        })
      });

      const data = await res.json();
      if (res.ok) {
        setRegMessage('Success: Patient registered successfully!');
        // Clear fields
        setRegName('');
        setRegEmail('');
        setRegPhone('');
        setRegAge('');
        setRegHistory('');
        // Refresh directory
        fetchPatients(1);
      } else {
        setRegMessage(`Error: ${data.message || 'Failed to register'}`);
      }
    } catch (err) {
      setRegMessage(`Error: ${err.message}`);
    }
  };

  // Handle Appointment Booking
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setBookingMessage('');

    if (!bookingPatientId || !bookingDoctorId || !bookingDate) {
      setBookingMessage('Error: All booking fields are required.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId: bookingPatientId,
          doctorId: bookingDoctorId,
          appointmentDate: bookingDate,
          reason: bookingReason
        })
      });

      const data = await res.json();
      if (res.ok) {
        setBookingMessage('Success: Appointment booked successfully!');
        setBookingReason('');
        if (user?.role === 'DOCTOR') fetchDoctorWorklist();
      } else {
        setBookingMessage(`Error: ${data.message || 'Failed to book'}`);
      }
    } catch (err) {
      setBookingMessage(`Error: ${err.message}`);
    }
  };

  // Delete Patient
  const handleDeletePatient = async (id) => {
    if (!confirm('Are you sure you want to delete this patient record?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Patient deleted.');
        fetchPatients(patientsPagination.page);
      } else {
        alert(`Error: ${data.message || 'Failed to delete'}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Queue Token Checkin
  const handleQueueCheckin = async (patientId, doctorId, appointmentId = null) => {
    setCheckinMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/queue/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ patientId, doctorId, appointmentId })
      });
      const data = await res.json();
      if (res.ok) {
        setCheckinMessage(`Checked in! Generated Token #${data.data.token.tokenNumber}`);
        if (user?.role === 'DOCTOR') fetchDoctorWorklist();
      } else {
        setCheckinMessage(`Error check-in: ${data.message}`);
      }
    } catch (err) {
      setCheckinMessage(`Error: ${err.message}`);
    }
  };

  // ==========================================
  // DOCTOR WORKFLOW FUNCTIONS
  // ==========================================
  const fetchDoctorWorklist = async () => {
    if (user?.role !== 'DOCTOR') return;
    try {
      // Find matching doctor from doctors dropdown using user ID link
      const matchedDoc = doctorsList.find(d => d.userId === user.id);
      if (!matchedDoc) return;

      // 1. Fetch appointments for this doctor
      const appRes = await fetch(`${API_BASE_URL}/appointments?doctorId=${matchedDoc.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const appData = await appRes.json();
      if (appData.success) {
        setDoctorAppointments(appData.data.appointments);
      }

      // 2. Fetch queue list for this doctor today
      const queueRes = await fetch(`${API_BASE_URL}/queue?doctorId=${matchedDoc.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const queueData = await queueRes.json();
      if (queueData.success) {
        setDoctorQueue(queueData.data.tokens);
      }

    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user?.role === 'DOCTOR' && doctorsList.length > 0) {
      fetchDoctorWorklist();
    }
  }, [doctorsList, user, token]);

  // Update token status (WAITING -> CALLING -> COMPLETED / SKIPPED)
  const handleUpdateQueueStatus = async (tokenId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/queue/${tokenId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchDoctorWorklist();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Complete consultation of an appointment
  const handleCompleteAppointment = async (appId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${appId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'COMPLETED' })
      });
      if (res.ok) {
        fetchDoctorWorklist();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ==========================================
  // ADMIN SYSTEM WORKFLOWS
  // ==========================================

  // Report generator fetch
  const generateSystemReport = async () => {
    setAdminReportLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reports/doctor-stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAdminReportData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdminReportLoading(false);
    }
  };

  // Search Doctors
  const searchPhysiciansAdmin = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/doctors?search=${encodeURIComponent(adminSearchQuery)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDoctorsList(data.data.doctors);
      } else {
        alert(`API Error: ${data.message || 'Search failed'}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ==========================================
  // SHARED PROPS FOR CHILD COMPONENTS
  // ==========================================
  const sharedProps = {
    activeTab,
    user,
    // Patient state
    patients,
    patientsLoading,
    patientSearch,
    setPatientSearch,
    patientGender,
    setPatientGender,
    patientsPagination,
    fetchPatients,
    // Registration form state
    regName, setRegName,
    regEmail, setRegEmail,
    regPhone, setRegPhone,
    regAge, setRegAge,
    regGender, setRegGender,
    regHistory, setRegHistory,
    regMessage,

    // Booking state
    doctorsList,
    bookingPatientId, setBookingPatientId,
    bookingDoctorId, setBookingDoctorId,
    bookingDate, setBookingDate,
    bookingReason, setBookingReason,
    bookingMessage, isCheckinModalOpen,
    setIsCheckinModalOpen,
    selectedPatientForCheckin,
    setSelectedPatientForCheckin,
    selectedDoctorForCheckin,
    setSelectedDoctorForCheckin,
    // Doctor state
    doctorAppointments,
    doctorQueue,
    selectedPatientHistory,
    setSelectedPatientHistory,
    // Admin state
    adminReportData,
    adminReportLoading,
    adminSearchQuery,
    setAdminSearchQuery,
    // Handlers
    handleRegisterPatient,
    handleBookAppointment,
    handleDeletePatient,
    handleQueueCheckin,
    handleUpdateQueueStatus,
    handleCompleteAppointment,
    generateSystemReport,
    searchPhysiciansAdmin,
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8">

        {/* Navigation Tabs based on Role */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto gap-4">
          {user?.role === 'ADMIN' && (
            <>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-3.5 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'reports' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-400'}`}
              >
                System Audit Reports
              </button>
              <button
                onClick={() => setActiveTab('physicians')}
                className={`py-3.5 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'physicians' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-400'}`}
              >
                Physician Registry
              </button>
            </>
          )}

          {(user?.role === 'RECEPTIONIST' || user?.role === 'ADMIN') && (
            <>
              <button
                onClick={() => setActiveTab('patients')}
                className={`py-3.5 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'patients' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-400'}`}
              >
                Patient Registry Directory
              </button>
              <button
                onClick={() => setActiveTab('book')}
                className={`py-3.5 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'book' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-400'}`}
              >
                Scheduling / Check-in Portal
              </button>
            </>
          )}

          {user?.role === 'DOCTOR' && (
            <>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-3.5 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'appointments' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-400'}`}
              >
                My Scheduled Bookings
              </button>
              <button
                onClick={() => setActiveTab('queue')}
                className={`py-3.5 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'queue' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-400'}`}
              >
                Active Calling Queue
              </button>
            </>
          )}
        </div>

        {/* Global Notifications Panel */}
        {checkinMessage && (
          <div className="p-4 mb-6 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-between text-sm">
            <span>{checkinMessage}</span>
            <button onClick={() => setCheckinMessage('')} className="font-bold underline text-xs">Dismiss</button>
          </div>
        )}

        {/* Role-based Dashboard Rendering */}
        {user?.role === 'ADMIN' && (
          <>
            <AdminDashboard {...sharedProps} />
            <ReceptionistDashboard {...sharedProps} />
          </>
        )}

        {user?.role === 'RECEPTIONIST' && (
          <ReceptionistDashboard {...sharedProps} />
        )}

        {user?.role === 'DOCTOR' && (
          <DoctorDashboard {...sharedProps} />
        )}
      </main>
    </div>
  );
}
