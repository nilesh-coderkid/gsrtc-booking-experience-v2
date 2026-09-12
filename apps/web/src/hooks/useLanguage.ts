import { useState, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'gu' | 'hi';

const DICTIONARY: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    portalTitle: 'Gujarat State Road Transport Corporation',
    portalSubtitle: 'Official Public Transit & Advance Bus Reservation Portal',
    bookBus: 'Book Bus',
    liveTracker: 'Live Bus Tracker',
    busPass: 'Bus Pass',
    cancelRefund: 'Cancel & Refund',
    myTickets: 'My Bookings',
    helpline: '24x7 Helpline',
    searchBuses: 'Search Bus Services',
    fromStation: 'From (Origin Depot)',
    toStation: 'To (Destination Depot)',
    journeyDate: 'Journey Date',
    selectQuota: 'Select Passenger Quota',
    quotaGeneral: 'General',
    quotaSingleLady: 'Single Lady',
    quotaDivyang: 'Divyang ♿',
    quotaMpMla: 'MP / MLA',
    quotaAwt: 'AWT Teachers',
    quotaElectric: 'Electric Bus',
    quotaSou: 'Statue of Unity',
    selectSeats: 'Select Seats',
    available: 'Available',
    selected: 'Selected (You)',
    lockedOther: 'Held by Another Passenger',
    booked: 'Booked',
    ladiesQuota: 'Ladies Quota',
    divyangQuota: 'Divyang Accessible',
    lowerDeck: 'Lower Deck',
    upperDeck: 'Upper Deck',
    holdTimer: 'Hold Time Remaining',
    proceedToBoarding: 'Continue to Boarding & Passenger Info',
    fareSummary: 'Fare Breakdown',
    payNow: 'Pay & Confirm E-Ticket',
    recentSearches: 'Recent Searches',
    foodStop: 'Highway Bhojanalay Stop',
    activeFleetOnRoad: 'Active Buses On Road',
    dailyPassengers: 'Daily Passengers Served',
    totalRoutes: 'Inter-District Routes',
  },
  gu: {
    portalTitle: 'ગુજરાત રાજ્ય માર્ગ વાહન વ્યવહાર નિગમ (GSRTC)',
    portalSubtitle: 'સત્તાવાર જાહેર પરિવહન અને એડવાન્સ બસ બુકિંગ પોર્ટલ',
    bookBus: 'બસ બુક કરો',
    liveTracker: 'લાઇવ બસ ટ્રેકર',
    busPass: 'બસ પાસ',
    cancelRefund: 'ટિકિટ રદ અને રિફંડ',
    myTickets: 'મારી બુકિંગ્સ',
    helpline: '૨૪x૭ હેલ્પલાઇન',
    searchBuses: 'બસ સેવાઓ શોધો',
    fromStation: 'ક્યાંથી (ઉપડવાનું સ્ટેશન)',
    toStation: 'ક્યાં પહોંચવું (ગંતવ્ય સ્ટેશન)',
    journeyDate: 'મુસાફરી તારીખ',
    selectQuota: 'મુસાફર ક્વોટા પસંદ કરો',
    quotaGeneral: 'સામાન્ય',
    quotaSingleLady: 'એકલી સ્ત્રી',
    quotaDivyang: 'દિવ્યાંગ ♿',
    quotaMpMla: 'સાંસદ / ધારાસભ્ય',
    quotaAwt: 'પુરસ્કૃત શિક્ષક',
    quotaElectric: 'ઇલેક્ટ્રિક બસ',
    quotaSou: 'સ્ટેચ્યુ ઓફ યુનિટી',
    selectSeats: 'સીટ પસંદ કરો',
    available: 'ઉપલબ્ધ',
    selected: 'પસંદ કરેલ (તમે)',
    lockedOther: 'અન્ય મુસાફર દ્વારા હોલ્ડ પર',
    booked: 'બુક થયેલ',
    ladiesQuota: 'મહિલા ક્વોટા',
    divyangQuota: 'દિવ્યાંગ ક્વોટા',
    lowerDeck: 'નીચલો ડેક',
    upperDeck: 'ઉપલો ડેક',
    holdTimer: 'હોલ્ડ સમય બાકી',
    proceedToBoarding: 'પેસેન્જર માહિતી આગળ વધારો',
    fareSummary: 'ભાડાની વિગત',
    payNow: 'ચૂકવણી કરી ટિકિટ કન્ફર્મ કરો',
    recentSearches: 'તાજેતરની શોધો',
    foodStop: 'હાઇવે ભોજનાલય સ્ટોપ',
    activeFleetOnRoad: 'રસ્તા પર સક્રિય બસો',
    dailyPassengers: 'દૈનિક મુસાફરો',
    totalRoutes: 'આંતર-જિલ્લા રૂટો',
  },
  hi: {
    portalTitle: 'गुजरात राज्य सड़क परिवहन निगम (GSRTC)',
    portalSubtitle: 'आधिकारिक सार्वजनिक परिवहन एवं अग्रिम बस बुकिंग पोर्टल',
    bookBus: 'बस बुक करें',
    liveTracker: 'लाइव बस ट्रैकर',
    busPass: 'बस पास',
    cancelRefund: 'टिकट रद्दीकरण एवं रिफंड',
    myTickets: 'मेरी बुकिंग',
    helpline: '२४x७ हेल्पलाइन',
    searchBuses: 'बस सेवाएं खोजें',
    fromStation: 'कहाँ से (प्रारंभिक डिपो)',
    toStation: 'कहाँ तक (गंतव्य स्टेशन)',
    journeyDate: 'यात्रा तिथि',
    selectQuota: 'यात्री कोटा चुनें',
    quotaGeneral: 'सामान्य',
    quotaSingleLady: 'एकल महिला',
    quotaDivyang: 'दिव्यांग ♿',
    quotaMpMla: 'सांसद / विधायक',
    quotaAwt: 'पुरस्कृत शिक्षक',
    quotaElectric: 'इलेक्ट्रिक बस',
    quotaSou: 'स्टैच्यू ऑफ यूनिटी',
    selectSeats: 'सीट चुनें',
    available: 'उपलब्ध',
    selected: 'चयनित (आप)',
    lockedOther: 'अन्य यात्री द्वारा होल्ड',
    booked: 'बुक की गई',
    ladiesQuota: 'महिला कोटा',
    divyangQuota: 'दिव्यांग कोटा',
    lowerDeck: 'निचला डेक',
    upperDeck: 'ऊपरी डेक',
    holdTimer: 'सीट होल्ड समय शेष',
    proceedToBoarding: 'यात्री विवरण आगे बढ़ाएं',
    fareSummary: 'किराया विवरण',
    payNow: 'भुगतान करें और ई-टिकट पाएं',
    recentSearches: 'हाल की खोजें',
    foodStop: 'हाईवे भोजनालय स्टॉप',
    activeFleetOnRoad: 'सड़क पर सक्रिय बसें',
    dailyPassengers: 'दैनिक यात्री',
    totalRoutes: 'अंतर-जिला मार्ग',
  },
};

export function useLanguage() {
  const [lang, setLang] = useState<SupportedLanguage>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gsrtc_lang') as SupportedLanguage;
      if (saved && (saved === 'en' || saved === 'gu' || saved === 'hi')) {
        setLang(saved);
      }
    }
  }, []);

  const changeLanguage = (newLang: SupportedLanguage) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gsrtc_lang', newLang);
      window.dispatchEvent(new CustomEvent('gsrtc_lang_change', { detail: newLang }));
    }
  };

  const t = (key: string): string => {
    return DICTIONARY[lang][key] || DICTIONARY.en[key] || key;
  };

  return { lang, changeLanguage, t };
}
