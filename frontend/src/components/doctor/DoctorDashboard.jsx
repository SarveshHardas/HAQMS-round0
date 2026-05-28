import DoctorAppointments from './DoctorAppointments';
import DoctorQueue from './DoctorQueue';

export default function DoctorDashboard(props) {
    const { activeTab } = props;

    return (
        <>
            {activeTab === 'appointments' && (
                <DoctorAppointments {...props} />
            )}

            {activeTab === 'queue' && (
                <DoctorQueue {...props} />
            )}
        </>
    );
}