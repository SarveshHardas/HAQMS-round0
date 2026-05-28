import PatientRegistry from './PatientRegistry';
import RegistrationForm from './RegistrationForm';
import BookingPanel from './BookingPanel';

export default function ReceptionistDashboard(props) {
    const { activeTab } = props;

    return (
        <>
            {activeTab === 'patients' && (
                <div className="space-y-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <PatientRegistry {...props} />
                        </div>

                        <RegistrationForm {...props} />
                    </div>
                </div>
            )}

            {activeTab === 'book' && (
                <BookingPanel {...props} />
            )}
        </>
    );
}