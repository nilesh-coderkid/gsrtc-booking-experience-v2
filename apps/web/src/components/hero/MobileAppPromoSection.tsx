import React from 'react';
import { Smartphone, QrCode } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const MobileAppPromoSection: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <section className="max-w-[1260px] mx-auto px-4 sm:px-6 py-8 pb-16">
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-white rounded-3xl p-6 sm:p-8 border border-slate-200/70 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-soft-card">
        <div className="space-y-3 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#b91d20] text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm">
            <Smartphone className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? 'નવી ૨૦૨૬ મોબાઇલ આવૃત્તિ' : 'Official 2026 Mobile App'}</span>
          </div>

          <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900">
            {lang === 'gu' ? '"આપણી GSRTC" મોબાઇલ એપ્લિકેશન' : '"Aapni GSRTC" Mobile App'}
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed">
            {lang === 'gu'
              ? 'લાઈવ બસ ટ્રેકિંગ, ઈમરજન્સી SOS, ડિજિટલ બસ પાસ, સીટ સિલેક્શન અને UPI દ્વારા શૂન્ય કન્વીનિયન્સ ફી સાથે ગુજરાતી ભાષામાં ટિકિટ બુકિંગ કરો.'
              : 'Live GPS bus tracking, emergency SOS, student passes, seat layout matrices, and zero-fee UPI checkout directly on your smartphone.'}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <div className="flex items-center gap-2 bg-[#0B1E33] text-white px-4 py-2.5 rounded-2xl cursor-pointer hover:bg-slate-800 transition-all shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-[#E8590C]/20 flex items-center justify-center font-bold text-xs text-[#E8590C]">
                ▶
              </div>
              <div className="text-left leading-tight">
                <div className="text-[10px] text-white/70">{lang === 'gu' ? 'ડાઉનલોડ કરો' : 'Download on'}</div>
                <div className="text-xs font-bold font-sans">Google Play</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#0B1E33] text-white px-4 py-2.5 rounded-2xl cursor-pointer hover:bg-slate-800 transition-all shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center font-bold text-xs text-blue-300">
                
              </div>
              <div className="text-left leading-tight">
                <div className="text-[10px] text-white/70">{lang === 'gu' ? 'ડાઉનલોડ કરો' : 'Download on'}</div>
                <div className="text-xs font-bold font-sans">Apple App Store</div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Widget */}
        <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm shrink-0">
          <div className="w-20 h-20 bg-slate-50 rounded-xl p-2 flex items-center justify-center border border-slate-100">
            <QrCode className="w-full h-full text-slate-900" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#b91d20] uppercase tracking-wider">
              {lang === 'gu' ? 'ઇન્સ્ટન્ટ ડાઉનલોડ' : 'Instant Scan'}
            </span>
            <div className="text-sm font-bold text-slate-900">
              {lang === 'gu' ? 'QR કોડ સ્કેન કરો' : 'Scan to Install'}
            </div>
            <p className="text-[11px] text-slate-500 max-w-[140px]">
              {lang === 'gu' ? 'મોબાઇલ કેમેરાથી સીધી એપ ડાઉનલોડ કરો.' : 'Point your phone camera to download.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
