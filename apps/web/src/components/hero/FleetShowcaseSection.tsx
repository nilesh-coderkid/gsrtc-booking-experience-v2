import React from 'react';
import { Bus, Moon, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { BusClass } from '@gsrtc/types';
import { useLanguage } from '../../hooks/useLanguage';

interface FleetShowcaseSectionProps {
  onSelectFleetClass: (busClass: BusClass | 'ALL', filterAc?: boolean) => void;
}

export const FleetShowcaseSection: React.FC<FleetShowcaseSectionProps> = ({
  onSelectFleetClass,
}) => {
  const { lang } = useLanguage();

  const handleBookService = (busClass: BusClass | 'ALL', filterAc = false) => {
    onSelectFleetClass(busClass, filterAc);
    const el = document.getElementById('booking-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-[1260px] mx-auto px-4 sm:px-6 py-10" id="fleet-section">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-2 border-b border-slate-200/70">
        <div>
          <span className="text-xs font-bold text-[#E8590C] uppercase tracking-wider">
            {lang === 'gu' ? 'પસંદગી મુજબ મુસાફરી' : 'Tailored Travel Choices'}
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#0B1E33] mt-0.5">
            {lang === 'gu' ? 'નિગમની પ્રમુખ બસ સેવાઓ' : 'Premier GSRTC Bus Services'}
          </h2>
        </div>
        <span className="text-xs text-slate-500 mt-2 sm:mt-0">
          {lang === 'gu' ? 'આધુનિક સુવિધાઓ સાથે રોજિંદી સલામત સવારી' : 'Safe daily rides with modern passenger amenities'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. GURJARNAGARI EXPRESS */}
        <div className="bg-white rounded-3xl p-6 shadow-soft-card border border-slate-100 hover:shadow-xl transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <span className="px-3 py-1 rounded-full bg-orange-50 text-[#E8590C] text-xs font-bold flex items-center gap-1">
                <Bus className="w-3.5 h-3.5" />
                <span>{lang === 'gu' ? 'ગુજરાતની શાન' : 'Pride of Gujarat'}</span>
              </span>
              <span className="text-xs font-bold text-slate-500">2x2 Push-Back</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#b91d20] transition-colors">
              {lang === 'gu' ? 'ગુર્જરનગરી એક્સપ્રેસ' : 'Gurjarnagari Express'}
            </h3>
            <p className="text-xs text-slate-400 font-sans">Gurjarnagari Intercity Express</p>

            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              {lang === 'gu'
                ? 'દરેક તાલુકા, જિલ્લા મથક અને મોટા ઔદ્યોગિક કેન્દ્રોને સીધી રીતે જોડતી સમયબદ્ધ અને અત્યંત લોકપ્રિય સેવા.'
                : 'Direct, punctual and dependable point-to-point transit connecting district headquarters and major industrial belts.'}
            </p>

            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>{lang === 'gu' ? 'આરામદાયક પુશબેક બેઠક વ્યવસ્થા' : 'Ergonomic 2x2 push-back seating'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>{lang === 'gu' ? 'લાઈવ જીપીએસ સ્પીડ ટ્રેકિંગ' : 'Live GPS location & speed tracking'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>{lang === 'gu' ? 'સામાન રાખવા માટે વિશાળ જગ્યા' : 'Spacious luggage compartment'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">{lang === 'gu' ? 'ભાડું શરૂ થાય છે' : 'Fares from'}</span>
              <span className="text-2xl font-extrabold text-[#0B1E33]">
                ₹૧૮૫<span className="text-xs font-normal text-slate-500"> {lang === 'gu' ? 'થી' : 'onwards'}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleBookService('GURJARNAGARI')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-[#b91d20] hover:text-white text-slate-800 text-sm font-bold transition-all cursor-pointer"
            >
              {lang === 'gu' ? 'બુક કરો' : 'Book Now'}
            </button>
          </div>
        </div>

        {/* 2. VOLVO / AC SLEEPER */}
        <div className="bg-white rounded-3xl p-6 shadow-soft-card border border-slate-100 hover:shadow-xl transition-all flex flex-col justify-between group ring-1 ring-red-100">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center gap-1">
                <Moon className="w-3.5 h-3.5" />
                <span>{lang === 'gu' ? 'રાત્રિ પ્રવાસ' : 'Night Transit'}</span>
              </span>
              <span className="text-xs font-bold text-[#b91d20]">AC Sleeper / Berth</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#b91d20] transition-colors">
              {lang === 'gu' ? 'વોલ્વો / AC સ્લીપર' : 'Volvo Multi-Axle & Sleeper'}
            </h3>
            <p className="text-xs text-slate-400 font-sans">Volvo Multi-Axle & Luxury Sleeper</p>

            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              {lang === 'gu'
                ? 'સૌરાષ્ટ્ર, કચ્છ અને ઉત્તર ગુજરાતના લાંબા રૂટ માટે શાંત, અવાજરહિત કેબિન અને પ્રીમિયમ આરામદાયક બર્થ.'
                : 'Whisper-quiet premium coaches and plush berths designed for overnight journeys across Saurashtra and Kutch.'}
            </p>

            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>{lang === 'gu' ? 'સિંગલ અને ડબલ સ્લીપિંગ બર્થ' : 'Single & double sleeper berths'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>{lang === 'gu' ? 'મોબાઇલ ચાર્જિંગ પોઇન્ટ અને રીડિંગ લાઇટ' : 'USB charging ports & reading lights'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>{lang === 'gu' ? 'મહિલાઓ માટે અલાયદી સુરક્ષિત બેઠકો' : 'Reserved female berths in private cabin'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">{lang === 'gu' ? 'ભાડું શરૂ થાય છે' : 'Fares from'}</span>
              <span className="text-2xl font-extrabold text-[#b91d20]">
                ₹૪૫૦<span className="text-xs font-normal text-slate-500"> {lang === 'gu' ? 'થી' : 'onwards'}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleBookService('VOLVO_AC', true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b91d20] to-[#9b1619] hover:shadow-md text-white text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{lang === 'gu' ? 'વોલ્વો બુક કરો' : 'Book Volvo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. ELECTRIC AC EXPRESS */}
        <div className="bg-white rounded-3xl p-6 shadow-soft-card border border-slate-100 hover:shadow-xl transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#059669] text-xs font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>{lang === 'gu' ? 'ગ્રીન મોબિલિટી' : 'Green Mobility'}</span>
              </span>
              <span className="text-xs font-bold text-[#059669]">Zero Emissions</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#b91d20] transition-colors">
              {lang === 'gu' ? 'ઇલેક્ટ્રિક AC એક્સપ્રેસ' : 'Electric AC Express Fleet'}
            </h3>
            <p className="text-xs text-slate-400 font-sans">100% Electric Eco Fleet</p>

            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              {lang === 'gu'
                ? 'ગાંધીનગર, વડોદરા, ધોલેરા SIR જેવા ગ્રીન કોરિડોર પર સંપૂર્ણ ઇલેક્ટ્રિક અને અત્યાધુનિક નિઃશબ્દ વાહન.'
                : 'Eco-friendly zero-emission EV express coaches cruising smart green corridors across Gandhinagar and Dholera SIR.'}
            </p>

            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>{lang === 'gu' ? '૧૦૦% શૂન્ય પ્રદૂષણ સાયલન્ટ મોટર' : '100% silent electric motor'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>{lang === 'gu' ? 'ડિજિટલ ટિકિટિંગ અને ફાસ્ટ USB ચાર્જિંગ' : 'Fast USB charging & digital contactless'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>{lang === 'gu' ? 'ઓટોમેટિક ઈમરજન્સી બ્રેકિંગ સેફ્ટી' : 'Automatic Emergency Braking Safety'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">{lang === 'gu' ? 'ભાડું શરૂ થાય છે' : 'Fares from'}</span>
              <span className="text-2xl font-extrabold text-[#059669]">
                ₹૩૪૦<span className="text-xs font-normal text-slate-500"> {lang === 'gu' ? 'થી' : 'onwards'}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleBookService('ELECTRIC_EXPRESS', true)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-[#059669] hover:text-white text-slate-800 text-sm font-bold transition-all cursor-pointer"
            >
              {lang === 'gu' ? 'ઇ-બસ બુક કરો' : 'Book E-Bus'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
