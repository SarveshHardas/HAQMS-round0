import { UserPlus } from 'lucide-react';

export default function RegistrationForm({
  regName,
  setRegName,
  regEmail,
  setRegEmail,
  regPhone,
  setRegPhone,
  regAge,
  setRegAge,
  regGender,
  setRegGender,
  regHistory,
  setRegHistory,
  regMessage,
  handleRegisterPatient,
}) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card shadow-xs h-fit text-foreground">
      <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
        <UserPlus className="h-4 w-4 text-primary shrink-0" />
        New Patient Registration
      </h3>

      {regMessage && (
        <div className={`p-3 text-xs rounded-lg mb-4 font-medium ${regMessage.toLowerCase().includes('success') ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
          {regMessage}
        </div>
      )}

      <form onSubmit={handleRegisterPatient} className="space-y-4 text-xs font-semibold text-foreground/80">
        <div>
          <label className="block mb-1.5 text-xs font-semibold">Patient Full Name*</label>
          <input
            type="text"
            required
            maxLength={100}
            value={regName}
            onChange={(e) => setRegName(e.target.value)}
            placeholder="Bruce Wayne"
            className="block w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-normal"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-xs font-semibold">Age (Years)*</label>
            <input
              type="number"
              required
              min="0"
              max="100"
              value={regAge}
              onChange={(e) => setRegAge(e.target.value)}
              placeholder="35"
              className="block w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-normal"
            />
          </div>
          <div>
            <label className="block mb-1.5 text-xs font-semibold">Gender*</label>
            <select
              value={regGender}
              onChange={(e) => setRegGender(e.target.value)}
              className="block w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-normal cursor-pointer"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1.5 text-xs font-semibold">Contact Phone*</label>
          <input
            type="number"
            required
            value={regPhone}
            maxLength={15}
            onChange={(e) => setRegPhone(e.target.value)}
            placeholder="+1 555 0199"
            className="block w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-normal"
          />
        </div>

        <div>
          <label className="block mb-1.5 text-xs font-semibold">Email Address</label>
          <input
            type="email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            placeholder="bruce@wayne.com"
            className="block w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-normal"
          />
        </div>

        <div>
          <label className="block mb-1.5 text-xs font-semibold">Medical Anamnesis / History</label>
          <textarea
            value={regHistory}
            onChange={(e) => setRegHistory(e.target.value)}
            placeholder="E.g. cardiovascular risks, asthma..."
            rows="3"
            maxLength={1000}
            className="block w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-normal"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          Register Patient Record
        </button>
      </form>
    </div>

  );
}
