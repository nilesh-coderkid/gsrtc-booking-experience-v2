import React from 'react';
import { CheckCircle, Smartphone, Apple, Wallet, Users, Bus, Building2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const TelemetryStatsSection: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <section className="max-w-[1260px] mx-auto px-4 sm:px-6 py-6">
      <div className="bg-[#0B1E33] text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-white/10 gap-2">
          <div>
            <span className="text-xs font-bold text-[#E8590C] uppercase tracking-wider">
              {lang === 'gu' ? 'નિગમની પ્રગતિ' : 'Operational Milestones'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold mt-0.5">
              {lang === 'gu' ? 'આંકડાઓમાં આપણી GSRTC (૨૦૨૬ સ્થિતિ)' : 'Our GSRTC in Numbers (2026 Status)'}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1 rounded-full self-start sm:self-auto">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'gu' ? 'સત્તાવાર ઓપરેશનલ ડેટા' : 'Verified Transit Telemetry'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center sm:text-left">
          {/* Stat 1 */}
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-white font-sans">૬૩.૯ લાખ+</div>
            <div className="text-xs font-bold text-[#E8590C] mt-1 flex items-center gap-1 sm:justify-start justify-center">
              <Smartphone className="w-3 h-3" />
              <span>{lang === 'gu' ? 'એન્ડ્રોઇડ ડાઉનલોડ' : 'Android Users'}</span>
            </div>
            <div className="text-[11px] text-white/60">પ્લે સ્ટોર ૪.૬★ રેટિંગ</div>
          </div>

          {/* Stat 2 */}
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-white font-sans">૧૩.૦ લાખ+</div>
            <div className="text-xs font-bold text-[#E8590C] mt-1 flex items-center gap-1 sm:justify-start justify-center">
              <Apple className="w-3 h-3" />
              <span>{lang === 'gu' ? 'iOS ડાઉનલોડ' : 'iOS Users'}</span>
            </div>
            <div className="text-[11px] text-white/60">એપલ સ્ટોર સપોર્ટ</div>
          </div>

          {/* Stat 3 */}
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-white font-sans">૧૨.૮ લાખ+</div>
            <div className="text-xs font-bold text-[#E8590C] mt-1 flex items-center gap-1 sm:justify-start justify-center">
              <Wallet className="w-3 h-3" />
              <span>{lang === 'gu' ? 'સક્રિય વૉલેટ યુઝર્સ' : 'Smart Wallet'}</span>
            </div>
            <div className="text-[11px] text-white/60">સરળ ૧-ક્લિક ચુકવણી</div>
          </div>

          {/* Stat 4 */}
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-emerald-400 font-sans">૩૧.૩૭ કરોડ</div>
            <div className="text-xs font-bold text-[#E8590C] mt-1 flex items-center gap-1 sm:justify-start justify-center">
              <Users className="w-3 h-3" />
              <span>{lang === 'gu' ? 'વાર્ષિક મુસાફરો' : 'Annual Riders'}</span>
            </div>
            <div className="text-[11px] text-white/60">૧૮,૦૦૦+ ગામોનું જોડાણ</div>
          </div>

          {/* Stat 5 */}
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-white font-sans">૮,૪૨૦+</div>
            <div className="text-xs font-bold text-[#E8590C] mt-1 flex items-center gap-1 sm:justify-start justify-center">
              <Bus className="w-3 h-3" />
              <span>{lang === 'gu' ? 'કુલ બસ કાફલો' : 'Fleet Strength'}</span>
            </div>
            <div className="text-[11px] text-white/60">ઇકો અને EV બસો સહિત</div>
          </div>

          {/* Stat 6 */}
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-white font-sans">૧૬</div>
            <div className="text-xs font-bold text-[#E8590C] mt-1 flex items-center gap-1 sm:justify-start justify-center">
              <Building2 className="w-3 h-3" />
              <span>{lang === 'gu' ? 'જિલ્લા વિભાગો' : 'ST Divisions'}</span>
            </div>
            <div className="text-[11px] text-white/60">૨૫૦+ સેન્ટ્રલ બસ ડેપો</div>
          </div>
        </div>
      </div>
    </section>
  );
};
