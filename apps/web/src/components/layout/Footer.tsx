import React from 'react';
import { Bus, ShieldCheck, PhoneCall, Mail, RotateCcw, CheckCircle2, Lock } from 'lucide-react';
import { GSRTCStorageEngine } from '../../services/storageEngine';
import { useLanguage } from '../../hooks/useLanguage';

export const Footer: React.FC = () => {
  const { lang } = useLanguage();

  const handleResetData = () => {
    if (window.confirm('Reset all demo bookings, seat locks, and local storage to factory defaults?')) {
      GSRTCStorageEngine.resetToFactoryDefaults();
      window.location.reload();
    }
  };

  const divisions = [
    'અમદાવાદ', 'વડોદરા', 'સુરત', 'રાજકોટ', 'ભાવનગર', 'ભુજ (કચ્છ)',
    'મહેસાણા', 'પાલનપુર', 'ગોધરા', 'ભરૂચ', 'વલસાડ', 'જૂનાગઢ',
    'જામનગર', 'અમરેલી', 'હિંમતનગર', 'નડિયાદ'
  ];

  return (
    <footer className="w-full bg-[#0B1E33] text-white text-sm" id="footer-hub">
      <div className="max-w-[1260px] mx-auto px-4 sm:px-6 pt-12 pb-8">
        {/* Top Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 border-b border-white/10">
          {/* Col 1 & 2: Logo and About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col gap-2">
              <div className="bg-white px-3 py-2 rounded-xl inline-flex items-center w-fit shadow-md">
                <img
                  src="/gsrtc_original_logo.png"
                  alt="GSRTC - Gujarat State Road Transport Corporation"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="text-xs text-[#E8590C] font-semibold mt-1">
                {lang === 'gu' ? 'ગુજરાત સરકારનું જાહેર સાહસ (સ્થાપના: ૧૯૬૦)' : 'Government of Gujarat Undertaking (Est. 1960)'}
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              {lang === 'gu'
                ? 'સમગ્ર ગુજરાતના ૧૮,૦૦૦+ ગામો અને ૨૫૦+ સેન્ટ્રલ બસ સ્ટેશનોને સાંકળતી સલામત, વિશ્વસનીય અને સુલભ જનસેવા.'
                : 'Connecting 18,000+ villages and 250+ central bus stations with safe, punctual and accessible public mobility.'}
            </p>

            <div className="pt-2">
              <div className="text-xs text-[#E8590C] font-bold">
                {lang === 'gu' ? '૨૪x૭ સેન્ટ્રલ કંટ્રોલ રૂમ અને હેલ્પલાઇન:' : '24x7 Central Helpline:'}
              </div>
              <div className="text-xl font-bold font-sans text-white mt-0.5">
                1800 233 6655 / 079 2283 5000
              </div>
              <div className="text-xs text-white/60 font-sans mt-0.5">
                customercare@gsrtc.in | complaints@gsrtc.in
              </div>
            </div>
          </div>

          {/* Col 3: Citizen Services */}
          <div>
            <div className="font-bold text-white mb-3 border-l-2 border-[#E8590C] pl-2">
              {lang === 'gu' ? 'નાગરિક સેવાઓ' : 'Passenger Services'}
            </div>
            <ul className="space-y-2 text-xs text-white/70">
              <li><a className="hover:text-[#E8590C] transition-colors" href="#booking-section">{lang === 'gu' ? 'ઓનલાઇન ઈ-ટિકિટિંગ' : 'Online E-Ticketing'}</a></li>
              <li><a className="hover:text-[#E8590C] transition-colors" href="#quick-actions">{lang === 'gu' ? 'VTMS લાઈવ બસ ટ્રેકિંગ' : 'Live Bus Tracker'}</a></li>
              <li><a className="hover:text-[#E8590C] transition-colors" href="#quick-actions">{lang === 'gu' ? 'વિદ્યાર્થી અને દૈનિક પાસ' : 'Student & Monthly Pass'}</a></li>
              <li><a className="hover:text-[#E8590C] transition-colors" href="#quick-actions">{lang === 'gu' ? 'લગેજ & પાર્સલ સર્વિસ' : 'Luggage & Parcel Service'}</a></li>
              <li><a className="hover:text-[#E8590C] transition-colors" href="#fleet-section">{lang === 'gu' ? 'વોલ્વો અને સ્લીપર સેવા' : 'Volvo & Sleeper Coaches'}</a></li>
              <li><a className="hover:text-[#E8590C] transition-colors" href="#quick-actions">{lang === 'gu' ? 'ટિકિટ રદ્દીકરણ અને રિફંડ' : 'Cancellation & Refund'}</a></li>
            </ul>
          </div>

          {/* Col 4: Governance & RTI */}
          <div>
            <div className="font-bold text-white mb-3 border-l-2 border-[#E8590C] pl-2">
              {lang === 'gu' ? 'વહીવટ & RTI' : 'Governance & RTI'}
            </div>
            <ul className="space-y-2 text-xs text-white/70">
              <li><span className="hover:text-[#E8590C] cursor-pointer transition-colors">{lang === 'gu' ? 'નાગરિક અધિકાર પત્ર' : 'Citizen Charter'}</span></li>
              <li><span className="hover:text-[#E8590C] cursor-pointer transition-colors">{lang === 'gu' ? 'માહિતી અધિકાર અધિનિયમ (RTI)' : 'Right to Information (RTI)'}</span></li>
              <li><span className="hover:text-[#E8590C] cursor-pointer transition-colors">{lang === 'gu' ? 'ચાલુ ટેન્ડરો અને પ્રક્રિયાઓ' : 'Active Tenders'}</span></li>
              <li><span className="hover:text-[#E8590C] cursor-pointer transition-colors">{lang === 'gu' ? 'ભરતી ૨૦૨૬ / જાહેરાતો' : 'Recruitment 2026'}</span></li>
              <li><span className="hover:text-[#E8590C] cursor-pointer transition-colors">{lang === 'gu' ? 'બોર્ડ ઓફ ડિરેક્ટર્સ' : 'Board of Directors'}</span></li>
              <li><span className="hover:text-[#E8590C] cursor-pointer transition-colors">{lang === 'gu' ? 'વાર્ષિક ઓડિટ અહેવાલ' : 'Annual Audit Report'}</span></li>
            </ul>
          </div>

          {/* Col 5: Certifications, Security & Reset */}
          <div>
            <div className="font-bold text-white mb-3 border-l-2 border-[#E8590C] pl-2">
              {lang === 'gu' ? 'પ્રમાણપત્રો અને સુરક્ષા' : 'Certifications & Trust'}
            </div>
            <p className="text-xs text-white/70 mb-3">
              {lang === 'gu' ? 'ગુજરાત સરકાર માન્ય સુરક્ષિત ડિજિટલ પેમેન્ટ ગેટવે.' : 'Government approved secure payment & transit gateway.'}
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-white font-sans">ISO 9001:2015</div>
                  <div className="text-[10px] text-white/60">Quality Transit Standard</div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
                <Lock className="w-4 h-4 text-[#E8590C] shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-white font-sans">STQC Certified</div>
                  <div className="text-[10px] text-white/60">State Cyber Compliance</div>
                </div>
              </div>

              {/* Demo Data Reset Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  title="Reset demo bookings, seat locks and seed storage"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>{lang === 'gu' ? 'ડેમો ડેટા રીસેટ' : 'Reset Demo Seed Data'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 16 Gujarat ST Divisions */}
        <div className="py-4 border-b border-white/10 text-xs">
          <span className="font-bold text-[#E8590C] block mb-1.5">
            {lang === 'gu' ? 'ગુજરાતના ૧૬ મુખ્ય એસ.ટી. વિભાગો:' : '16 Regional ST Divisions of Gujarat:'}
          </span>
          <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-white/70">
            {divisions.map((div, i) => (
              <React.Fragment key={div}>
                <span className="hover:text-white cursor-pointer transition-colors">
                  {div}
                </span>
                {i < divisions.length - 1 && <span className="text-white/30">•</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <p className="pt-4 text-xs leading-relaxed text-white/60">
          {lang === 'gu'
            ? 'આ પ્લેટફોર્મ માત્ર પ્રદર્શન અને પરીક્ષણ માટેની ડેમો એપ્લિકેશન છે. અહીં દર્શાવેલી બુકિંગ, ચુકવણી અને લાઇવ ડેટા સેવાઓ વાસ્તવિક વ્યવહાર માટે નથી.'
            : 'This platform is a demonstration application for preview and testing. Bookings, payments, and live transit data shown here are not real transactions or production services.'}
        </p>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <div>
            © {new Date().getFullYear()} ગુજરાત રાજ્ય માર્ગ વાહનવ્યવહાર નિગમ (GSRTC). સર્વ હક સુરક્ષિત.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">{lang === 'gu' ? 'ગોપનીયતા નીતિ' : 'Privacy Policy'}</span>
            <span className="hover:text-white cursor-pointer">{lang === 'gu' ? 'નિયમો અને શરતો' : 'Terms & Conditions'}</span>
            <span className="hover:text-white cursor-pointer">{lang === 'gu' ? 'સહાય & FAQ' : 'Help & FAQ'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
