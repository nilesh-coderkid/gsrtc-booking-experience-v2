import React, { useState } from 'react';
import { BusPass } from '@gsrtc/types';
import { PassService } from '../../services/passService';
import { GSRTCStorageEngine } from '../../services/storageEngine';
import { CreditCard, QrCode, CheckCircle2, ShieldCheck, Printer, PlusCircle, GraduationCap, Building2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const BusPassSection: React.FC = () => {
  const { t } = useLanguage();
  const [passes, setPasses] = useState<BusPass[]>(PassService.getAllPasses());
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);

  const [passType, setPassType] = useState<'COMMUTER_MONTHLY' | 'STUDENT_SEMESTER' | 'SENIOR_CITIZEN'>('COMMUTER_MONTHLY');
  const [applicantName, setApplicantName] = useState('');
  const [sourceStation, setSourceStation] = useState('Ahmedabad (Geeta Mandir)');
  const [destinationStation, setDestinationStation] = useState('Gandhinagar (Sector 11)');
  const [routeVia, setRouteVia] = useState('Direct Express Highway');

  const stations = GSRTCStorageEngine.getStations();

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) return;

    const concessionPercentage = passType === 'STUDENT_SEMESTER' ? 80 : passType === 'SENIOR_CITIZEN' ? 100 : 60;
    const basePassRate = passType === 'STUDENT_SEMESTER' ? 1200 : passType === 'COMMUTER_MONTHLY' ? 800 : 0;
    const totalCost = basePassRate * (1 - concessionPercentage / 100);

    const created = PassService.applyForPass({
      passType,
      applicantName,
      sourceStation,
      destinationStation,
      routeVia,
      concessionPercentage,
      totalCost,
    });

    setPasses([created, ...passes]);
    setShowApplyModal(false);
    setApplicantName('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#E8590C]" />
            <h2 className="text-xl font-bold text-slate-900">
              GSRTC Digital Bus Pass Portal
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Apply, renew, and carry your government commuter or student bus pass on your mobile device
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="px-5 py-2.5 bg-[#002B49] hover:bg-[#00385F] text-white text-xs font-bold rounded-xl shadow transition cursor-pointer flex items-center gap-1.5 active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-orange-400" />
          <span>Apply New Bus Pass</span>
        </button>
      </div>

      {/* Pass Cards Grid */}
      {passes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {passes.map((pass) => (
            <div
              key={pass.passNumber}
              className="bg-gradient-to-br from-[#002B49] to-[#001729] text-white rounded-3xl p-6 border-2 border-white/15 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]"
            >
              {/* Top Pass Header */}
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#E8590C] flex items-center justify-center font-bold text-white text-xs">
                      GSRTC
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-amber-300">
                        {pass.passType.replace('_', ' ')} PASS
                      </div>
                      <span className="text-[9px] text-slate-400">Government of Gujarat Transit Pass</span>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold uppercase">
                    {pass.status}
                  </span>
                </div>

                {/* Passholder Details */}
                <div className="space-y-1.5">
                  <div className="text-lg font-black tracking-tight text-white font-serif">
                    {pass.applicantName}
                  </div>
                  <div className="text-xs text-slate-300 flex items-center gap-1">
                    <span>Route:</span>
                    <span className="font-bold text-white">{pass.sourceStation} ⇄ {pass.destinationStation}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Via: {pass.routeVia} • Concession: {pass.concessionPercentage}% Off
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-white/10 flex items-end justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-mono block">Pass No.</span>
                  <span className="text-xs font-mono font-bold text-amber-300">{pass.passNumber}</span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Valid: {pass.validFrom} to {pass.validTo}
                  </div>
                </div>

                {/* QR Code Indicator */}
                <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No active digital passes found</h3>
          <p className="text-xs text-slate-400 mb-4">
            Apply for a student or commuter pass with subsidized state road transit fare.
          </p>
          <button
            onClick={() => setShowApplyModal(true)}
            className="px-4 py-2 bg-[#002B49] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Apply Now
          </button>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Apply for Digital Bus Pass
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter applicant details to generate your state subsidized digital commuter pass.
            </p>

            <form onSubmit={handleApply} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Pass Category</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPassType('COMMUTER_MONTHLY')}
                    className={`p-2 rounded-xl text-xs font-bold border text-center transition cursor-pointer ${
                      passType === 'COMMUTER_MONTHLY' ? 'border-[#002B49] bg-blue-50 text-[#002B49]' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Monthly (60% Off)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPassType('STUDENT_SEMESTER')}
                    className={`p-2 rounded-xl text-xs font-bold border text-center transition cursor-pointer ${
                      passType === 'STUDENT_SEMESTER' ? 'border-[#002B49] bg-blue-50 text-[#002B49]' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Student (80% Off)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPassType('SENIOR_CITIZEN')}
                    className={`p-2 rounded-xl text-xs font-bold border text-center transition cursor-pointer ${
                      passType === 'SENIOR_CITIZEN' ? 'border-[#002B49] bg-blue-50 text-[#002B49]' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Senior (100% Off)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Applicant Full Name</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. Bhavik Joshi"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">From Station</label>
                  <select
                    value={sourceStation}
                    onChange={(e) => setSourceStation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    {stations.map((s) => (
                      <option key={s.id} value={s.nameEn}>{s.nameEn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">To Station</label>
                  <select
                    value={destinationStation}
                    onChange={(e) => setDestinationStation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    {stations.map((s) => (
                      <option key={s.id} value={s.nameEn}>{s.nameEn}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#E8590C] hover:bg-[#d04e08] text-white shadow-md cursor-pointer"
                >
                  Issue Digital Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
