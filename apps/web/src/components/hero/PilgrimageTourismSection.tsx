import React from 'react';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface PilgrimageTourismSectionProps {
  onSelectDestination: (destId: string, quotaType?: 'STATUE_OF_UNITY' | 'GENERAL') => void;
}

export const PilgrimageTourismSection: React.FC<PilgrimageTourismSectionProps> = ({
  onSelectDestination,
}) => {
  const { lang } = useLanguage();

  const destinations = [
    {
      id: 'SOU-NV',
      titleGu: 'સ્ટેચ્યુ ઓફ યુનિટી (એકતા નગર)',
      titleEn: 'Statue of Unity (Ekta Nagar)',
      tagGu: '૧૪ દૈનિક વોલ્વો',
      tagEn: '14 Daily Volvos',
      fare: '₹૩૮૦ થી',
      descGu: 'અમદાવાદ, વડોદરા અને સુરતથી ડાયરેક્ટ AC વોલ્વો અને એક્સપ્રેસ બસ કનેક્ટિવિટી.',
      descEn: 'Direct premium AC Volvo and express fleet from Ahmedabad, Vadodara and Surat.',
      btnGu: 'એકતા એક્સપ્રેસ બુક કરો',
      btnEn: 'Book Ekta Express',
      imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1UZi__DUtZJ5EJ8CZDPe9ErXnevBSozv814YSXc3_mz5qnwrZ_-_jkW0f3HaOmnhPcjhRg8XSePQyfny4HUacr7Ct7CSFipzUNzeJwUR2IzAAxjLDjzdvudcK-PqOT9bf1JRzM7ckukLVOGlNqhs5wKZZC5OFUWNbHmZt6Nc0MqK2a27zIdpXvHnrHtnn1pDPYrjs7bFWpy1iTHp2ZZ4gRRhF66aong8t3zhYpwLgzU95c9F3q8-4VatfQ',
      quota: 'STATUE_OF_UNITY' as const,
    },
    {
      id: 'SMN-TR',
      titleGu: 'સોમનાથ જ્યોતિર્લિંગ મંદિર',
      titleEn: 'Somnath Jyotirlinga Temple',
      tagGu: 'પ્રથમ જ્યોતિર્લિંગ',
      tagEn: 'First Jyotirlinga',
      fare: '₹૪૬૦ થી',
      descGu: 'દરરોજ રાત્રે ઉપડતી AC સ્લીપર કોચ સેવા, મંદિર પરિસર સુધી સીધી પહોંચ.',
      descEn: 'Daily overnight luxury AC sleeper berths stopping right outside temple complex.',
      btnGu: 'સોમનાથ સ્લીપર બુક કરો',
      btnEn: 'Book Somnath Sleeper',
      imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WC9_P0O8hHPJAiM6JRCLEVC8cCcHJJB62tVrJOaiF68_sQdxSMjplaCqDNDHAsAz3ZDvqAcoZPIHrVE8pp-w68bO_mykqf6QqX_HAzLezW9jlULaQDpIugeEa2H6jy2H9eDACYlmeRss-PzM7AI3i_0Bzpc7XjRYkBcXI_vcJOWBT6WkrkCGshAqv_h6oRQxkPL6nYNIdvry2VNdA09WXonzgoEU05QvsRjYXsFffYVKpqkNqu40YsIeAq',
    },
    {
      id: 'DWK-TR',
      titleGu: 'શ્રી દ્વારકાધીશ તીર્થ',
      titleEn: 'Dwarkadhish Tirth, Dwarka',
      tagGu: 'પવિત્ર તીર્થક્ષેત્ર',
      tagEn: 'Sacred Dham',
      fare: '₹૪૧૦ થી',
      descGu: 'સૌરાષ્ટ્ર હાઇવે થઈને બેટ દ્વારકા સુધી સરળ કનેક્ટિવિટી અને ગુર્જરનગરી સેવાઓ.',
      descEn: 'Smooth transit along Coastal Highway connecting directly to Bet Dwarka ferry port.',
      btnGu: 'દ્વારકા રૂટ બુક કરો',
      btnEn: 'Book Dwarka Route',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoMGHSmKdpQqYOR2c0U4t50OaWHWdx8u8B4GktILZ0Go1BIWnLXuRHXp_v4qQIct4YzqWUGEuJtoZVwtqyyJzfPzo2kf3YaLqGbROpBLjEkbhfcl4w_OktwcUFWLm_WME8gHRdXUHxiYyWQ_rg8whdwSFDcZ5Nx9WQJO2_Ovkjw7psHG87TW8dwvnZaC0WeSVT_tCJhPBWnpf0sXVVSaIIl-ayzCyaj2XeVBrhaS3M-zxFX_-2R5Gwow',
    },
    {
      id: 'BHJ-CB',
      titleGu: 'કચ્છનો સફેદ રણ (ધોરડો)',
      titleEn: 'White Rann of Kutch & Dhordo',
      tagGu: 'રણોત્સવ સ્પેશિયલ',
      tagEn: 'Rann Utsav Special',
      fare: '₹૫૫૦ થી',
      descGu: 'ભુજ સેન્ટ્રલ બસ સ્ટેશન સાથે જોડાયેલી ટેન્ટ સિટી ધોરડો માટે વિશેષ રાત્રિ બસો.',
      descEn: 'Dedicated night sleeper services connecting Bhuj Central directly to Tent City.',
      btnGu: 'કચ્છ એક્સપ્રેસ બુક કરો',
      btnEn: 'Book Kutch Express',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxXNIwa_jpeYBuMk-fzhwhBzbI1AwUzjrur404_-f7pp4U2lj5VtCkkc9j5Hikb-pUfnP5V05JwFJadB2yjndbuHiyq7CaIHhcYrD0QjqzY4D13aLkAQhdL7nBnS0yMrdbOUMxm8E3PEEyZGBupLyjJvQ8iq3tG9pMKygt2h4BAXSOId13UxUnj00fW8oV-BOLSMoEgDyZjPS0lEMLtPABtXNhNUgAQs6VjlKoaNQVzYCKzcuUdqjzhQ',
    },
  ];

  const handleSelect = (destId: string, quota?: 'STATUE_OF_UNITY') => {
    onSelectDestination(destId, quota);
    const el = document.getElementById('booking-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-[1260px] mx-auto px-4 sm:px-6 py-10" id="destination-section">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-2 border-b border-slate-200/70">
        <div>
          <span className="text-xs font-bold text-[#E8590C] uppercase tracking-widest">
            {lang === 'gu' ? 'ગુજરાત દર્શન' : 'Discover Gujarat'}
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#0B1E33] mt-0.5">
            {lang === 'gu' ? 'પવિત્ર યાત્રાધામ અને પર્યટન સ્થળો' : 'Sacred Pilgrimage & Cultural Destinations'}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => handleSelect('SOU-NV')}
          className="text-sm text-[#b91d20] font-bold hover:underline inline-flex items-center gap-1 mt-2 sm:mt-0 cursor-pointer"
        >
          <span>{lang === 'gu' ? 'તમામ ૮૦+ તીર્થ રૂટ્સ જુઓ' : 'View All 80+ Pilgrimage Routes'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((d) => (
          <div
            key={d.id}
            className="bg-white rounded-3xl overflow-hidden shadow-soft-card hover:shadow-xl transition-all group flex flex-col justify-between"
          >
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src={d.imageUrl}
                alt={lang === 'gu' ? d.titleGu : d.titleEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  // graceful fallback gradient if image fails to load
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute top-3 left-3 bg-[#0B1E33]/80 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#E8590C]" />
                <span>{lang === 'gu' ? d.tagGu : d.tagEn}</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-[#b91d20] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                {d.fare}
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#b91d20] transition-colors">
                  {lang === 'gu' ? d.titleGu : d.titleEn}
                </h3>
                <p className="text-xs text-slate-400 font-sans">{d.titleEn}</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {lang === 'gu' ? d.descGu : d.descEn}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSelect(d.id, d.quota)}
                className="mt-4 w-full py-2 rounded-xl bg-slate-100 hover:bg-[#b91d20] hover:text-white text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                {lang === 'gu' ? d.btnGu : d.btnEn}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
