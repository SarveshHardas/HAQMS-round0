import ReportsPanel from './ReportsPanel';
import PhysicianRegistry from './PhysicianRegistry';

export default function AdminDashboard(props) {
  const { activeTab } = props;

  return (
    <>
      {activeTab === 'reports' && (
        <ReportsPanel {...props} />
      )}

      {activeTab === 'physicians' && (
        <PhysicianRegistry {...props} />
      )}
    </>
  );
}