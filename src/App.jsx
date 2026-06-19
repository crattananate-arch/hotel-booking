import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Hotel, Calendar, MapPin, Phone, Mail, Clock,
  Users, Maximize, Wifi, Coffee, ArrowRight,
  Copy, Check, Sparkles, ShieldCheck, Waves,
  Utensils, CreditCard, CheckCircle2, Ticket, Building,
  Trees, Building2, ChevronDown, Eye, X, Wind, Tv, ShowerHead, Lock,
  Loader2, AlertCircle, ArrowLeft, MessageSquareText, Minus, Plus, Moon, Search
} from 'lucide-react';

// ==========================================
// 0. ข้อมูลโซนและห้องพัก (Zones & Rooms)
// ==========================================
const ZONES = [
  {
    id: 'tideline',
    icon: Waves,
    name: 'The Tideline Wing',
    nameTh: 'เรือนริมทะเล',
    tagline: 'ห้องพักทุกห้องหันหน้าสู่อ่าวไทย เสียงคลื่นคือเสียงปลุกทุกเช้า',
    image: 'photo-1571003123894-1f0594d2b5d9',
  },
  {
    id: 'canopy',
    icon: Trees,
    name: 'The Canopy Wing',
    nameTh: 'เรือนป่าเขียว',
    tagline: 'ที่ซ่อนตัวกลางความเขียวครึ้มและความเงียบ ไกลจากทุกสิ่งที่ไม่จำเป็น',
    image: 'photo-1582719478250-c89cae4dc85b',
  },
  {
    id: 'sky',
    icon: Building2,
    name: 'The Sky Pavilion',
    nameTh: 'ชั้นดาดฟ้า',
    tagline: 'เหนือเส้นขอบฟ้า ใกล้ดวงดาวกว่าใคร วิวพาโนรามาที่ไม่ต้องแบ่งใคร',
    image: 'photo-1455587734955-081b22074882',
  },
];

const ROOMS = [
  // The Tideline Wing — Ocean Breeze
  { id: 'tideline-standard', zoneId: 'tideline', name: 'Tideline Standard', price: 2500, capacity: 2, size: 32, image: 'photo-1618773928121-c32242e63f39', description: 'ห้องเริ่มต้นที่เปิดรับแสงเช้าจากสวนปาล์ม ก้าวออกไปไม่กี่นาทีก็ถึงผืนทรายและเสียงคลื่น' },
  { id: 'tideline-deluxe', zoneId: 'tideline', name: 'Tideline Deluxe', price: 3200, capacity: 2, size: 40, image: 'photo-1551882547-ff40c63fe5fa', description: 'ระเบียงส่วนตัวหันหน้าสู่อ่าวไทยเต็มผืน นอนฟังเสียงทะเลได้ตั้งแต่ตื่นจนหลับ' },
  { id: 'horizon-suite', zoneId: 'tideline', name: 'Horizon Suite', price: 4800, capacity: 2, size: 58, image: 'photo-1564501049412-61c2a3083791', description: 'ห้องนั่งเล่นกระจกโอบรอบรับวิวทะเล 180 องศา ออกแบบให้เส้นขอบฟ้าเป็นส่วนหนึ่งของห้อง' },
  { id: 'tidepool-family', zoneId: 'tideline', name: 'Tidepool Family Room', price: 5600, capacity: 4, size: 75, image: 'photo-1542314831-068cd1dbfeeb', description: 'ห้องเชื่อมสองห้องนอนพร้อมระเบียงชั้นล่างขนาดใหญ่ เหมาะสำหรับครอบครัวที่อยากเดินลงหาดได้ทันที' },
  { id: 'tideline-penthouse', zoneId: 'tideline', name: 'The Tideline Penthouse', price: 8500, capacity: 2, size: 95, image: 'photo-1571003123894-1f0594d2b5d9', description: 'เพนต์เฮาส์ชั้นบนสุดของเรือนริมทะเล พร้อมสระพลันจ์ส่วนตัวเหนือเส้นน้ำ มองเห็นพระอาทิตย์ตกได้จากในอ่างอาบน้ำ' },
  // The Canopy Wing — Forest / Zen
  { id: 'canopy-standard', zoneId: 'canopy', name: 'Canopy Standard', price: 2700, capacity: 2, size: 30, image: 'photo-1605346434674-a440ca4dc4c0', description: 'ห้องชั้นล่างกลางต้นลีลาวดี เปิดหน้าต่างรับลมและเสียงใบไม้แทนเสียงเมือง' },
  { id: 'canopy-deluxe', zoneId: 'canopy', name: 'Canopy Deluxe', price: 3400, capacity: 2, size: 38, image: 'photo-1611892440504-42a792e24d32', description: 'ห้องยกพื้นพร้อมศาลาไม้ส่วนตัว มองลงไปเห็นเรือนยอดไม้เขียวครึ้มรอบทิศ' },
  { id: 'lotus-pond-suite', zoneId: 'canopy', name: 'Lotus Pond Suite', price: 4600, capacity: 2, size: 52, image: 'photo-1540555700478-4be289fbecef', description: 'สวีทริมบึงบัว พร้อมห้องอาบน้ำเปิดโล่งกลางแจ้ง ฟังเสียงน้ำพรมใบบัวยามเช้า' },
  { id: 'canopy-retreat-villa', zoneId: 'canopy', name: 'Canopy Retreat Villa', price: 6200, capacity: 4, size: 90, image: 'photo-1611048268330-53de574cae3b', description: 'วิลล่าเดี่ยวซ่อนตัวหลังแนวไม้พุ่ม มีสวนส่วนตัวล้อมรอบ ไม่มีห้องไหนมองเห็น' },
  { id: 'canopy-sanctuary', zoneId: 'canopy', name: 'The Canopy Sanctuary', price: 8000, capacity: 2, size: 110, image: 'photo-1582719478250-c89cae4dc85b', description: 'วิลล่าระดับสูงสุดของเรือนป่าเขียว อ่างแช่ตัวกลางแจ้งท่ามกลางสวนปิด เงียบสงบราวกับเป็นป่าส่วนตัว' },
  // The Sky Pavilion — Modern City / Rooftop
  { id: 'skyline-standard', zoneId: 'sky', name: 'Skyline Standard', price: 3000, capacity: 2, size: 34, image: 'photo-1505693416388-ac5ce068fe85', description: 'ห้องชั้นสูงมองเห็นแนวชายฝั่งไกลลิบ ตกแต่งเรียบหรูด้วยเฟอร์นิเจอร์ไม้เข้ม' },
  { id: 'skyline-deluxe', zoneId: 'sky', name: 'Skyline Deluxe', price: 3800, capacity: 2, size: 42, image: 'photo-1592229505726-ca121723b8ef', description: 'ห้องมุมกระจกรอบด้าน รับแสงเมืองและขอบฟ้ายามเย็นพร้อมกันในที่เดียว' },
  { id: 'horizon-loft-suite', zoneId: 'sky', name: 'Horizon Loft Suite', price: 5200, capacity: 2, size: 65, image: 'photo-1559599189-fe84dea4eb79', description: 'สวีทดูเพล็กซ์สองชั้น มีบันไดขึ้นสู่ระเบียงดาดฟ้าส่วนตัว สัมผัสเส้นขอบฟ้าได้ใกล้ที่สุด' },
  { id: 'sky-terrace-suite', zoneId: 'sky', name: 'Sky Terrace Suite', price: 6800, capacity: 3, size: 80, image: 'photo-1590490360182-c33d57733427', description: 'ระเบียงดาดฟ้าส่วนตัวขนาดใหญ่พร้อมเตียงเดย์เบด เหมาะกับค็อกเทลยามพระอาทิตย์ตก' },
  { id: 'sky-pavilion-penthouse', zoneId: 'sky', name: 'The Sky Pavilion Penthouse', price: 8500, capacity: 2, size: 100, image: 'photo-1455587734955-081b22074882', description: 'เพนต์เฮาส์สูงสุดของหอดูฟ้า วิวพาโนรามา 270 องศา พร้อมอ่างอาบน้ำอินฟินิตี้ลอยเหนือเส้นฟ้า' },
];

const getZone = (zoneId) => ZONES.find((z) => z.id === zoneId);

// สิ่งอำนวยความสะดวกในห้อง (ใช้ร่วมกันทุกห้อง + วิวเฉพาะของแต่ละโซน)
const ROOM_AMENITIES = [
  { icon: Wifi, label: 'อินเทอร์เน็ตไร้สายความเร็วสูง' },
  { icon: Wind, label: 'เครื่องปรับอากาศปรับระดับได้' },
  { icon: Tv, label: 'สมาร์ททีวีจอแบน' },
  { icon: ShowerHead, label: 'ห้องอาบน้ำฝักบัวแยกสัด' },
  { icon: Lock, label: 'ตู้เซฟส่วนตัวในห้อง' },
  { icon: Coffee, label: 'ชุดชา-กาแฟพร้อมเครื่องชง' },
];

const HOTEL_SERVICES = [
  { icon: Waves, title: 'สระว่ายน้ำอินฟินิตี้', desc: 'ผ่อนคลายในสระว่ายน้ำขนาดใหญ่ขนานเส้นขอบฟ้าและวิวทะเล เปิดให้ใช้บริการทุกวันตั้งแต่ 06:00–20:00 น.' },
  { icon: Utensils, title: 'ห้องอาหารนานาชาติ', desc: 'ลิ้มลองเมนูเลิศรสปรุงสดใหม่จากเชฟระดับมิชลินสตาร์ตลอดทั้งวัน รวมอาหารเช้าในทุกการจอง' },
  { icon: ShieldCheck, title: 'ปลอดภัย ไร้กังวล', desc: 'ระบบจองแบบใช้รหัสอ้างอิงยืนยันตัวตน มีเจ้าหน้าที่ดูแลความปลอดภัยตลอด 24 ชั่วโมง' },
];

// ==========================================
// 0.1 Motion hooks (scroll-reveal + parallax)
// ==========================================
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function useReveal() {
  const ref = useRef(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) { setHidden(false); return; }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setHidden(false); observer.disconnect(); }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, hidden];
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// speed controls drift rate; maxOffset bounds it to the image's actual
// overflow so the parallax never reveals an edge, regardless of scroll distance.
function useParallax(speed = 0.3, maxOffset = 100) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let frame = null;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const rect = el.parentElement.getBoundingClientRect();
        const offset = clamp(rect.top * -speed, -maxOffset, maxOffset);
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
        frame = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed, maxOffset]);

  return ref;
}

// ==========================================
// 1. ระบบจัดการข้อมูลการจอง (Context)
// ==========================================
const BOOKINGS_STORAGE_KEY = 'serene-haven-bookings';

export const getStoredBookings = () => {
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const BookingContext = createContext();
export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookingState, setBookingState] = useState({
    checkIn: '', checkOut: '', guests: 1, selectedRoom: null,
    promoCode: '', discount: 0,
    guestInfo: { firstName: '', lastName: '', email: '', phone: '', specialRequests: '' },
    bookingReference: null
  });

  const updateBookingDates = (checkIn, checkOut, guests) => setBookingState(prev => ({ ...prev, checkIn, checkOut, guests }));
  const selectRoom = (room) => setBookingState(prev => ({ ...prev, selectedRoom: room }));
  const updateGuestInfo = (info) => setBookingState(prev => ({ ...prev, guestInfo: { ...prev.guestInfo, ...info } }));
  
  const applyPromoCode = (code) => {
    const upperCode = code.toUpperCase();
    let discountPercent = 0;
    if (upperCode === 'WELCOME10') discountPercent = 0.10;
    if (upperCode === 'PROMO20') discountPercent = 0.20;
    setBookingState(prev => ({ ...prev, promoCode: upperCode, discount: discountPercent }));
    return discountPercent > 0;
  };

  const clearBooking = () => setBookingState({
    checkIn: '', checkOut: '', guests: 1, selectedRoom: null, promoCode: '', discount: 0,
    guestInfo: { firstName: '', lastName: '', email: '', phone: '', specialRequests: '' }, bookingReference: null
  });

  const finalizeBooking = () => {
    const randomRef = 'HTL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const nights = bookingState.checkIn && bookingState.checkOut
      ? Math.max(1, Math.round((new Date(bookingState.checkOut) - new Date(bookingState.checkIn)) / 86400000))
      : 1;
    const record = {
      reference: randomRef,
      firstName: bookingState.guestInfo.firstName,
      lastName: bookingState.guestInfo.lastName,
      phone: bookingState.guestInfo.phone,
      email: bookingState.guestInfo.email,
      roomName: bookingState.selectedRoom?.name ?? '',
      checkIn: bookingState.checkIn,
      checkOut: bookingState.checkOut,
      nights,
      guests: bookingState.guests,
      total: Math.round((bookingState.selectedRoom?.price ?? 0) * nights * (1 - bookingState.discount)),
      createdAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify([...getStoredBookings(), record]));
    } catch {
      // localStorage unavailable (private browsing, quota) — booking still completes, just unsearchable later
    }
    setBookingState(prev => ({ ...prev, bookingReference: randomRef }));
    return randomRef;
  };

  return (
    <BookingContext.Provider value={{ bookingState, updateBookingDates, selectRoom, updateGuestInfo, applyPromoCode, finalizeBooking, clearBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

// ==========================================
// 2. ส่วนประกอบย่อย (Components)
// ==========================================
const Navbar = () => {
  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path
      ? 'text-hotel-600 font-semibold after:w-full'
      : 'text-slate-600 hover:text-hotel-600 after:w-0 hover:after:w-full';

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-50 shadow-[0_1px_12px_-4px_oklch(0.46_0.135_228_/_0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-hotel-700 font-display font-medium text-xl tracking-wide transition-colors hover:text-hotel-600">
              <Hotel className="h-6 w-6 text-hotel-600" />
              <span>THE HAVEN</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`relative pb-1 text-label after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-hotel-600 after:rounded-full after:transition-[width] after:duration-300 transition-colors ${isActive('/')}`}>หน้าแรก</Link>
            <Link to="/rooms" className={`relative pb-1 text-label after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-hotel-600 after:rounded-full after:transition-[width] after:duration-300 transition-colors ${isActive('/rooms')}`}>ห้องพักของเรา</Link>
            <Link to="/check-booking" className={`relative pb-1 text-label after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-hotel-600 after:rounded-full after:transition-[width] after:duration-300 transition-colors ${isActive('/check-booking')}`}>ตรวจสอบการจอง</Link>
            <Link to="/rooms" className="bg-hotel-600 hover:bg-hotel-700 text-white px-5 py-2.5 rounded-lg text-label font-medium flex items-center gap-2 transition-all duration-300 ease-out-expo shadow-[0_4px_16px_-4px_oklch(0.46_0.135_228_/_0.45)] hover:shadow-[0_8px_20px_-4px_oklch(0.46_0.135_228_/_0.55)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hotel-600">
              <Calendar className="h-4 w-4" />
              จองห้องพักเลย
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-hotel-950 text-slate-300 pt-16 pb-8 border-t border-hotel-900 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
      <div>
        <h3 className="text-white font-display font-medium text-title mb-4 tracking-wide">THE HAVEN</h3>
        <p className="text-sm leading-relaxed mb-4">
          สัมผัสประสบการณ์การพักผ่อนระดับพรีเมียมท่ามกลางธรรมชาติและความเงียบสงบ พร้อมการบริการที่ใส่ใจทุกรายละเอียด
        </p>
      </div>
      <div>
        <h3 className="text-white font-semibold text-label mb-4">ติดต่อเรา</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-3"><MapPin className="h-5 w-5 text-hotel-400 shrink-0 mt-0.5" /><span>123 ถนนเลียบชายหาด จ.ชลบุรี 20130</span></li>
          <li className="flex items-center gap-3"><Phone className="h-5 w-5 text-hotel-400 shrink-0" /><span>038-123-456, 081-234-5678</span></li>
          <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-hotel-400 shrink-0" /><span>contact@theserenehaven.com</span></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white font-semibold text-label mb-4">นโยบายการจองแบบ Guest</h3>
        <p className="text-sm leading-relaxed">
          ท่านสามารถจองห้องพักได้ทันทีโดยไม่ต้องสมัครสมาชิก ระบบจะออกรหัสการจองให้หลังทำรายการสำเร็จ
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs bg-hotel-900/60 p-3 rounded-lg text-slate-200 border border-hotel-800/60">
          <Clock className="h-4 w-4 text-aqua-400" />
          <span>เช็คอิน: 14:00 น. | เช็คเอาต์: 12:00 น.</span>
        </div>
      </div>
    </div>
  </footer>
);

// z-index scale: dropdown (30) < sticky nav (50) < modal backdrop (60) < modal panel (70)
const ZoneDropdown = ({ activeZone, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const options = [{ id: 'all', nameTh: 'ทุกโซน', icon: Hotel }, ...ZONES];
  const active = options.find((o) => o.id === activeZone) || options[0];

  useEffect(() => {
    if (!open) return;
    const onClickAway = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClickAway);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickAway);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative inline-block mb-12">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl pl-5 pr-4 py-3 min-w-[260px] justify-between hover:border-hotel-300 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hotel-600"
      >
        <span className="flex items-center gap-2.5 text-label font-medium text-slate-800">
          <active.icon className="h-4 w-4 text-hotel-600" />
          {active.nameTh}
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ease-out-expo ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full mt-2 w-full min-w-[260px] bg-white border border-slate-200 rounded-xl shadow-[0_16px_40px_-10px_oklch(0.22_0.08_228_/_0.28)] overflow-hidden py-1.5 z-30"
        >
          {options.map((opt) => {
            const isActive = activeZone === opt.id;
            return (
              <li key={opt.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => { onChange(opt.id); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-label transition-colors duration-150 ${isActive ? 'bg-hotel-50 text-hotel-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <opt.icon className={`h-4 w-4 ${isActive ? 'text-hotel-600' : 'text-slate-400'}`} />
                  {opt.nameTh}
                  {isActive && <Check className="h-3.5 w-3.5 ml-auto text-hotel-600" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const RoomDetailModal = ({ room, onClose, onBook }) => {
  const [activeImg, setActiveImg] = useState(0);
  const closeRef = useRef(null);
  const zone = room ? getZone(room.zoneId) : null;
  const gallery = room ? Array.from(new Set([room.image, zone?.image].filter(Boolean))) : [];

  useEffect(() => { setActiveImg(0); }, [room?.id]);

  useEffect(() => {
    if (!room) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [room, onClose]);

  if (!room) return null;

  return (
    <div
      className="modal-overlay fixed inset-0 h-dvh bg-hotel-950/70 backdrop-blur-sm flex flex-col sm:items-center sm:justify-center sm:p-4 z-[60]"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-modal-title"
        className="modal-panel relative bg-white w-full h-dvh sm:h-auto sm:max-w-3xl sm:max-h-[min(88dvh,calc(100dvh-2rem))] sm:rounded-3xl overflow-y-auto shadow-2xl z-[70]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="ปิดหน้าต่างรายละเอียดห้อง"
          style={{ top: 'max(1rem, calc(env(safe-area-inset-top) + 0.5rem))', right: 'max(1rem, env(safe-area-inset-right))' }}
          className="absolute h-10 w-10 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-white shadow-md transition-colors duration-200 z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hotel-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="h-72 sm:h-80 bg-slate-200 relative overflow-hidden sm:rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-t from-hotel-950/50 to-transparent z-10" />
          <img
            src={`https://images.unsplash.com/${gallery[activeImg]}?auto=format&fit=crop&w=1200&q=80`}
            alt={`${room.name} — ภาพที่ ${activeImg + 1}`}
            className="w-full h-full object-cover"
          />
          {zone && (
            <div className="absolute top-4 left-4 bg-hotel-950/70 backdrop-blur-sm px-3 py-1 rounded-full text-label font-medium text-white z-20">{zone.nameTh}</div>
          )}
          {gallery.length > 1 && (
            <div className="absolute bottom-4 left-4 flex gap-2 z-20">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  aria-label={`ดูภาพที่ ${i + 1}`}
                  aria-current={activeImg === i}
                  className={`h-14 w-14 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${activeImg === i ? 'border-white' : 'border-white/40 hover:border-white/70'}`}
                >
                  <img src={`https://images.unsplash.com/${src}?auto=format&fit=crop&w=150&q=80`} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-8">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h2 id="room-modal-title" className="font-display text-headline font-normal text-slate-900">{room.name}</h2>
            <div className="text-right shrink-0">
              <span className="text-price font-bold text-hotel-600 tabular-nums">฿{room.price.toLocaleString()}</span>
              <span className="text-xs text-slate-500 block">/ คืน</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 mb-6">
            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-hotel-600" /><span>สูงสุด {room.capacity} ท่าน</span></div>
            <div className="flex items-center gap-2"><Maximize className="h-4 w-4 text-hotel-600" /><span>{room.size} ตร.ม.</span></div>
            {zone && <div className="flex items-center gap-2"><zone.icon className="h-4 w-4 text-hotel-600" /><span>{zone.name}</span></div>}
          </div>

          <p className="text-slate-700 leading-relaxed mb-8 max-w-[68ch]">{room.description}</p>

          <div className="mb-8">
            <h3 className="font-display text-title font-medium text-slate-900 mb-4">สิ่งอำนวยความสะดวกในห้อง</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
              {zone && (
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <zone.icon className="h-4 w-4 text-hotel-600 shrink-0" />
                  <span>วิว{zone.nameTh}จากห้อง</span>
                </div>
              )}
              {ROOM_AMENITIES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm text-slate-700">
                  <Icon className="h-4 w-4 text-hotel-600 shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 pt-6 border-t border-slate-100">
            <h3 className="font-display text-title font-medium text-slate-900 mb-4">บริการของโรงแรม</h3>
            <div className="space-y-4">
              {HOTEL_SERVICES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <Icon className="h-5 w-5 text-hotel-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <div>
              <div className="text-xs text-slate-500">ราคารวม / คืน</div>
              <span className="text-price font-bold text-hotel-600 tabular-nums">฿{room.price.toLocaleString()}</span>
            </div>
            <button
              type="button"
              onClick={() => onBook(room)}
              className="bg-hotel-600 hover:bg-hotel-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 ease-out-expo shadow-[0_8px_24px_-6px_oklch(0.46_0.135_228_/_0.45)] hover:-translate-y-0.5 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hotel-600"
            >
              จองห้องนี้เลย <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoomCard = ({ room, onSelect, onViewDetails, delay = 0 }) => {
  const [ref, hidden] = useReveal();
  const parallaxRef = useParallax(0.08, 16);
  const zone = getZone(room.zoneId);
  return (
    <div
      ref={ref}
      className={`reveal bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_1px_4px_0_oklch(0_0_0_/_0.06)] hover:shadow-[0_12px_32px_-8px_oklch(0.46_0.135_228_/_0.18)] transition-shadow duration-300 flex flex-col h-full ${hidden ? 'reveal-hidden' : ''}`}
      style={{ transitionDelay: hidden ? '0ms' : `${delay}ms` }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onViewDetails(room)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onViewDetails(room); } }}
        aria-label={`ดูรายละเอียดห้อง ${room.name}`}
        className="h-64 bg-slate-200 relative overflow-hidden cursor-pointer group/img focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hotel-600"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-hotel-950/40 to-transparent z-10"></div>
        <img ref={parallaxRef} src={`https://images.unsplash.com/${room.image}?auto=format&fit=crop&w=800&q=80`} alt={room.name} className="w-full h-[112%] object-cover transform group-hover/img:scale-105 transition-transform duration-500 ease-out-expo will-change-transform" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-800 z-20">ว่างพร้อมจอง</div>
        {zone && (
          <div className="absolute top-4 left-4 bg-hotel-950/70 backdrop-blur-sm px-3 py-1 rounded-full text-label font-medium text-white z-20">{zone.nameTh}</div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-hotel-950/0 group-hover/img:bg-hotel-950/30 transition-colors duration-300 z-20 pointer-events-none">
          <span className="opacity-0 translate-y-1 group-hover/img:opacity-100 group-hover/img:translate-y-0 transition-all duration-300 bg-white/95 backdrop-blur-sm text-slate-900 text-label font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
            <Eye className="h-4 w-4" /> ดูรายละเอียด
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display text-title font-medium text-slate-900">{room.name}</h3>
          <div className="text-right">
            <span className="text-price font-bold text-hotel-600 tabular-nums">฿{room.price.toLocaleString()}</span>
            <span className="text-xs text-slate-500 block">/ คืน</span>
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-5 line-clamp-2 leading-relaxed">{room.description}</p>
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-slate-600 border-t border-b border-slate-100 py-4 mb-6">
          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-400" /><span>สูงสุด {room.capacity} ท่าน</span></div>
          <div className="flex items-center gap-2"><Maximize className="h-4 w-4 text-slate-400" /><span>{room.size} ตร.ม.</span></div>
          <div className="flex items-center gap-2"><Wifi className="h-4 w-4 text-slate-400" /><span>ฟรี Wi-Fi</span></div>
          <div className="flex items-center gap-2"><Coffee className="h-4 w-4 text-slate-400" /><span>รวมอาหารเช้า</span></div>
        </div>
        <div className="flex gap-2 mt-auto">
          <button onClick={() => onViewDetails(room)} className="flex-1 border border-slate-200 hover:border-hotel-300 text-slate-700 hover:text-hotel-700 font-medium py-3 px-4 rounded-xl transition-colors duration-300 ease-out-expo flex items-center justify-center gap-2 text-label focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hotel-600">
            <Eye className="h-4 w-4" /> รายละเอียด
          </button>
          <button onClick={() => onSelect(room)} className="flex-[1.4] bg-hotel-950 hover:bg-hotel-600 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-300 ease-out-expo flex items-center justify-center gap-2 text-label group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hotel-600">
            จองทันที <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. หน้าต่างๆ (Pages)
// ==========================================
const Hero = () => {
  const navigate = useNavigate();
  const parallaxRef = useParallax(0.35, 100);
  const orbARef = useParallax(0.12, 60);
  const orbBRef = useParallax(0.2, 70);

  return (
    <section className="relative h-[680px] bg-hotel-950 flex items-center justify-center overflow-hidden">
      <img
        ref={parallaxRef}
        src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80"
        alt="สระอินฟินิตี้และเรือนพักของ THE SERENE HAVEN ยามพลบค่ำ"
        className="absolute inset-0 w-full h-[130%] object-cover opacity-55 will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-hotel-950/80 via-hotel-950/15 to-hotel-950/50" />
      <div ref={orbARef} className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-aqua-400/20 blur-[120px] pointer-events-none will-change-transform" aria-hidden="true" />
      <div ref={orbBRef} className="absolute -bottom-24 right-1/5 h-80 w-80 rounded-full bg-hotel-400/25 blur-[110px] pointer-events-none will-change-transform" aria-hidden="true" />
      <div className="hero-animate relative z-10 max-w-4xl mx-auto text-center px-4 text-white">
        <h1 className="font-display font-light text-display mb-6">
          สวรรค์แห่งการพักผ่อน <br /><span className="text-hotel-300">ที่คุณออกแบบได้เอง</span>
        </h1>
        <p className="text-lg leading-relaxed tracking-[0.01em] text-slate-200 mb-10 max-w-2xl mx-auto">
          สามโซนพักผ่อน 15 ห้องพักที่แตกต่าง จองง่ายใน 3 ขั้นตอนด้วยระบบ Guest Booking ไม่ต้องสมัครสมาชิก
        </p>
        <button onClick={() => navigate('/rooms')} className="bg-hotel-500 hover:bg-hotel-400 text-white font-semibold px-8 py-4 rounded-xl shadow-[0_8px_28px_-6px_oklch(0.54_0.125_228_/_0.55)] hover:shadow-[0_12px_36px_-6px_oklch(0.54_0.125_228_/_0.65)] hover:-translate-y-0.5 transition-all duration-300 ease-out-expo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua-400">
          ดูห้องพักและจองเลย
        </button>
      </div>
    </section>
  );
};

const ZoneCard = ({ zone, index }) => {
  const [ref, hidden] = useReveal();
  const parallaxRef = useParallax(0.12, 30);
  const Icon = zone.icon;
  return (
    <Link
      ref={ref}
      to={`/rooms?zone=${zone.id}`}
      className={`reveal group relative h-96 rounded-3xl overflow-hidden block shadow-[0_1px_4px_0_oklch(0_0_0_/_0.06)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-10px_oklch(0.22_0.08_228_/_0.45)] ${hidden ? 'reveal-hidden' : ''}`}
      style={{ transitionDelay: hidden ? '0ms' : `${index * 120}ms` }}
    >
      <img
        ref={parallaxRef}
        src={`https://images.unsplash.com/${zone.image}?auto=format&fit=crop&w=900&q=80`}
        alt={zone.name}
        className="absolute inset-0 w-full h-[118%] object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110 will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-hotel-950/85 via-hotel-950/25 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-end p-7 text-white">
        <Icon className="h-7 w-7 text-aqua-300 mb-3" />
        <h3 className="font-display text-title font-medium mb-1">{zone.nameTh}</h3>
        <p className="text-label text-slate-200/90 uppercase tracking-wide mb-3">{zone.name}</p>
        <p className="text-sm text-slate-200 leading-relaxed mb-4">{zone.tagline}</p>
        <span className="inline-flex items-center gap-1.5 text-label font-semibold text-aqua-300">
          ดูห้องพักในโซนนี้ <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
};

const FeatureCard = ({ feature, index }) => {
  const [ref, hidden] = useReveal();
  const Icon = feature.icon;
  return (
    <div
      ref={ref}
      className={`reveal bg-white border border-slate-100 p-8 rounded-2xl shadow-[0_1px_4px_0_oklch(0_0_0_/_0.06)] hover:shadow-[0_12px_28px_-8px_oklch(0.46_0.135_228_/_0.16)] transition-shadow duration-300 text-center ${hidden ? 'reveal-hidden' : ''}`}
      style={{ transitionDelay: hidden ? '0ms' : `${index * 100}ms` }}
    >
      <Icon className="h-10 w-10 text-hotel-600 mx-auto mb-4" />
      <h3 className="font-display text-title font-medium mb-2">{feature.title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
    </div>
  );
};

const PromoCard = ({ promo, index, copiedCode, onCopy }) => {
  const [ref, hidden] = useReveal();
  const isCopied = copiedCode === promo.code;
  return (
    <div
      ref={ref}
      className={`reveal bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_4px_0_oklch(0_0_0_/_0.06)] ${hidden ? 'reveal-hidden' : ''}`}
      style={{ transitionDelay: hidden ? '0ms' : `${index * 100}ms` }}
    >
      <h3 className="font-display text-title font-medium mb-2">{promo.title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed mb-6">{promo.desc}</p>
      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex justify-between items-center">
        <span className="font-mono font-bold text-lg text-hotel-700 tabular-nums">{promo.code}</span>
        <button onClick={() => onCopy(promo.code)} className={`px-4 py-2 rounded-lg text-label font-semibold flex items-center gap-1.5 transition-colors duration-300 ${isCopied ? 'bg-emerald-500 text-white' : 'bg-hotel-950 hover:bg-hotel-700 text-white'}`}>
          {isCopied ? <span key="copied" className="pop-confirm flex items-center gap-1.5"><Check className="h-3.5 w-3.5"/> คัดลอกแล้ว</span> : <><Copy className="h-3.5 w-3.5"/> คัดลอก</>}
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const [copiedCode, setCopiedCode] = useState('');
  const [zonesRef, zonesHidden] = useReveal();

  const promos = [
    { code: 'WELCOME10', title: 'ต้อนรับผู้เข้าพักใหม่', desc: 'รับส่วนลด 10% สำหรับการจองห้องพักทุกประเภท' },
    { code: 'PROMO20', title: 'พักผ่อนยาวคุ้มกว่า', desc: 'รับส่วนลด 20% สำหรับห้องพักประเภท Suite ขึ้นไป' }
  ];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="space-y-20 pb-20">
      <Hero />

      <section className="max-w-7xl mx-auto px-4">
        <div ref={zonesRef} className={`reveal max-w-2xl mb-10 ${zonesHidden ? 'reveal-hidden' : ''}`}>
          <h2 className="font-display text-headline font-normal mb-3">สามโซนพักผ่อน</h2>
          <p className="text-slate-600 leading-relaxed"></p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ZONES.map((zone, i) => <ZoneCard key={zone.id} zone={zone} index={i} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOTEL_SERVICES.map((feature, i) => <FeatureCard key={feature.title} feature={feature} index={i} />)}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 bg-hotel-50/70 py-16 rounded-3xl border border-hotel-100">
        <h2 className="font-display text-headline font-normal text-center mb-8">โปรโมชันพิเศษและโค้ดส่วนลด</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promos.map((promo, i) => (
            <PromoCard key={promo.code} promo={promo} index={i} copiedCode={copiedCode} onCopy={handleCopy} />
          ))}
        </div>
      </section>
    </div>
  );
};

const Rooms = () => {
  const navigate = useNavigate();
  const { selectRoom } = useBooking();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeZone = searchParams.get('zone') || 'all';
  const [detailRoom, setDetailRoom] = useState(null);

  const handleSelectRoom = (room) => {
    selectRoom(room);
    navigate('/booking');
  };

  const handleBookFromModal = (room) => {
    setDetailRoom(null);
    handleSelectRoom(room);
  };

  const setZone = (zoneId) => {
    if (zoneId === 'all') setSearchParams({});
    else setSearchParams({ zone: zoneId });
  };

  const visibleZones = activeZone === 'all' ? ZONES : ZONES.filter((z) => z.id === activeZone);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-headline font-normal mb-3">เลือกห้องพักที่เหมาะกับคุณ</h1>
      <p className="text-slate-600 leading-relaxed mb-6 max-w-2xl">15 ห้องพักใน 3 โซน แต่ละโซนมีบุคลิกของตัวเอง เลือกโซนที่ตรงกับความรู้สึกที่อยากได้</p>

      <ZoneDropdown activeZone={activeZone} onChange={setZone} />

      <div className="space-y-16">
        {visibleZones.map((zone) => (
          <section key={zone.id}>
            <div className="flex items-baseline gap-3 mb-6 border-b border-slate-100 pb-4">
              <h2 className="font-display text-title font-medium text-slate-900">{zone.nameTh}</h2>
              <span className="text-sm text-slate-500">{zone.name}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ROOMS.filter((room) => room.zoneId === zone.id).map((room, i) => (
                <RoomCard key={room.id} room={room} onSelect={handleSelectRoom} onViewDetails={setDetailRoom} delay={(i % 3) * 90} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <RoomDetailModal room={detailRoom} onClose={() => setDetailRoom(null)} onBook={handleBookFromModal} />
    </div>
  );
};

const StepBadge = ({ n }) => (
  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-hotel-600 text-white text-xs font-bold shrink-0">{n}</span>
);

const FieldLabel = ({ children, required }) => (
  <label className="text-label font-semibold text-slate-600 block mb-1.5">
    {children}{required && <span className="text-hotel-600"> *</span>}
  </label>
);

const Booking = () => {
  const navigate = useNavigate();
  const { bookingState, updateBookingDates, updateGuestInfo, applyPromoCode, finalizeBooking, clearBooking } = useBooking();
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState({ text: '', error: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [touched, setTouched] = useState(false);

  if (!bookingState.selectedRoom && !bookingState.bookingReference) {
    return (
      <div className="text-center py-24">
        <Building className="h-16 w-16 text-hotel-300 mx-auto mb-4" />
        <h2 className="font-display text-title font-medium mb-4">คุณยังไม่ได้เลือกห้องพัก</h2>
        <button onClick={() => navigate('/rooms')} className="bg-hotel-600 hover:bg-hotel-700 text-white px-6 py-2.5 rounded-xl transition-colors duration-300 ease-out-expo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hotel-600">ไปหน้ารายการห้องพัก</button>
      </div>
    );
  }

  if (bookingState.bookingReference) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <CheckCircle2 className="success-flourish h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="font-display text-headline font-normal mb-2">ยืนยันการจองสำเร็จ!</h1>
          <p className="text-slate-600 mb-6">รหัสอ้างอิงของคุณคือ: <span className="font-bold text-hotel-700 bg-hotel-50 px-3 py-1 rounded tabular-nums">{bookingState.bookingReference}</span></p>
          <button onClick={() => { clearBooking(); navigate('/'); }} className="bg-hotel-950 hover:bg-hotel-700 text-white px-6 py-3 rounded-xl transition-colors duration-300 ease-out-expo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hotel-600">กลับสู่หน้าหลัก</button>
        </div>
      </div>
    );
  }

  const { selectedRoom, discount } = bookingState;
  const todayISO = new Date().toISOString().split('T')[0];
  const nights = (() => {
    if (!bookingState.checkIn || !bookingState.checkOut) return 0;
    const diff = Math.round((new Date(bookingState.checkOut) - new Date(bookingState.checkIn)) / 86400000);
    return diff > 0 ? diff : 0;
  })();
  const dateRangeInvalid = Boolean(bookingState.checkIn && bookingState.checkOut && nights <= 0);
  const subtotal = selectedRoom.price * (nights || 1);
  const totalPrice = subtotal * (1 - discount);

  const missing = {
    checkIn: touched && !bookingState.checkIn,
    checkOut: touched && (!bookingState.checkOut || dateRangeInvalid),
    firstName: touched && !bookingState.guestInfo.firstName,
    phone: touched && !bookingState.guestInfo.phone,
  };

  const fieldClass = (invalid) =>
    `border rounded-xl px-3 py-2.5 w-full transition-colors duration-200 focus:outline-none focus:ring-3 focus:ring-hotel-500/15 ${invalid ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-hotel-500'}`;

  const requiredFieldsComplete = Boolean(
    bookingState.checkIn && bookingState.checkOut && !dateRangeInvalid &&
    bookingState.guestInfo.firstName && bookingState.guestInfo.phone
  );

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!requiredFieldsComplete) {
      setTouched(true);
      return;
    }
    if (applyPromoCode(promoInput)) setPromoMsg({ text: 'ใช้ส่วนลดสำเร็จ!', error: false });
    else setPromoMsg({ text: 'รหัสไม่ถูกต้อง ลองตรวจสอบอีกครั้ง', error: true });
  };

  const handleRemovePromo = () => {
    applyPromoCode('');
    setPromoInput('');
    setPromoMsg({ text: '', error: false });
  };

  const handleSubmit = () => {
    setTouched(true);
    if (!requiredFieldsComplete) {
      setErrorMsg(dateRangeInvalid ? 'วันที่เช็คเอาต์ต้องอยู่หลังวันที่เช็คอิน' : 'กรุณากรอกวันที่เข้าพักและข้อมูลผู้ติดต่อให้ครบถ้วน');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    setTimeout(() => { finalizeBooking(); setIsSubmitting(false); }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button onClick={() => navigate('/rooms')} className="inline-flex items-center gap-1.5 text-label text-slate-500 hover:text-hotel-600 transition-colors duration-200 mb-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hotel-600 rounded">
        <ArrowLeft className="h-4 w-4" /> กลับไปเลือกห้องพัก
      </button>
      <h1 className="font-display text-headline font-normal mb-2">ขั้นตอนสุดท้ายในการจอง</h1>
      <p className="text-slate-500 mb-8 max-w-[60ch]">กรอกข้อมูลให้ครบถ้วน ทีมงานของเราจะยืนยันการเข้าพักของคุณกลับทางอีเมลภายในไม่กี่นาที</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="font-display text-title font-medium flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
              <StepBadge n={1} /> วันที่เข้าพัก
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel required>เช็คอิน</FieldLabel>
                <input
                  type="date"
                  min={todayISO}
                  aria-invalid={missing.checkIn}
                  className={fieldClass(missing.checkIn)}
                  value={bookingState.checkIn}
                  onChange={(e) => updateBookingDates(e.target.value, bookingState.checkOut, bookingState.guests)}
                />
              </div>
              <div>
                <FieldLabel required>เช็คเอาต์</FieldLabel>
                <input
                  type="date"
                  min={bookingState.checkIn || todayISO}
                  aria-invalid={missing.checkOut}
                  className={fieldClass(missing.checkOut)}
                  value={bookingState.checkOut}
                  onChange={(e) => updateBookingDates(bookingState.checkIn, e.target.value, bookingState.guests)}
                />
              </div>
            </div>
            {dateRangeInvalid && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5" /> วันที่เช็คเอาต์ต้องอยู่หลังวันที่เช็คอิน</p>
            )}
            {!dateRangeInvalid && nights > 0 && (
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5"><Moon className="h-3.5 w-3.5 text-hotel-500" /> เข้าพักทั้งหมด {nights} คืน</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="font-display text-title font-medium flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
              <StepBadge n={2} /> ข้อมูลผู้เข้าพัก <span className="text-xs font-normal text-slate-400">(ไม่ต้องล็อกอิน)</span>
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <FieldLabel required>ชื่อจริง</FieldLabel>
                <input type="text" aria-invalid={missing.firstName} className={fieldClass(missing.firstName)} value={bookingState.guestInfo.firstName} onChange={(e) => updateGuestInfo({ firstName: e.target.value })} />
              </div>
              <div>
                <FieldLabel>นามสกุล</FieldLabel>
                <input type="text" className={fieldClass(false)} value={bookingState.guestInfo.lastName} onChange={(e) => updateGuestInfo({ lastName: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <FieldLabel>อีเมล</FieldLabel>
                <input type="email" className={fieldClass(false)} value={bookingState.guestInfo.email} onChange={(e) => updateGuestInfo({ email: e.target.value })} />
              </div>
              <div>
                <FieldLabel required>เบอร์โทรศัพท์</FieldLabel>
                <input type="tel" aria-invalid={missing.phone} className={fieldClass(missing.phone)} value={bookingState.guestInfo.phone} onChange={(e) => updateGuestInfo({ phone: e.target.value })} />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 mb-4 py-3 border-t border-slate-100">
              <div>
                <span className="text-label font-semibold text-slate-600 block">จำนวนผู้เข้าพัก</span>
                <span className="text-xs text-slate-400">สูงสุด {selectedRoom.capacity} ท่านต่อห้อง</span>
              </div>
              <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-2 py-1.5">
                <button
                  type="button"
                  aria-label="ลดจำนวนผู้เข้าพัก"
                  onClick={() => updateBookingDates(bookingState.checkIn, bookingState.checkOut, Math.max(1, bookingState.guests - 1))}
                  disabled={bookingState.guests <= 1}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors duration-150"
                ><Minus className="h-4 w-4" /></button>
                <span className="w-6 text-center font-semibold tabular-nums">{bookingState.guests}</span>
                <button
                  type="button"
                  aria-label="เพิ่มจำนวนผู้เข้าพัก"
                  onClick={() => updateBookingDates(bookingState.checkIn, bookingState.checkOut, Math.min(selectedRoom.capacity, bookingState.guests + 1))}
                  disabled={bookingState.guests >= selectedRoom.capacity}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors duration-150"
                ><Plus className="h-4 w-4" /></button>
              </div>
            </div>

            <div>
              <FieldLabel>ความต้องการพิเศษ <span className="text-slate-400 font-normal">(ถ้ามี)</span></FieldLabel>
              <div className="relative">
                <MessageSquareText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <textarea
                  rows={3}
                  placeholder="เช่น ขอเตียงเสริม, ฉลองวันครบรอบ, ห้องเงียบ"
                  className="border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 w-full text-sm transition-colors duration-200 focus:outline-none focus:border-hotel-500 focus:ring-3 focus:ring-hotel-500/15 resize-none"
                  value={bookingState.guestInfo.specialRequests}
                  onChange={(e) => updateGuestInfo({ specialRequests: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit sticky top-24">
          <h2 className="font-display text-title font-medium flex items-center gap-2 mb-4 border-b border-slate-100 pb-3"><CreditCard className="h-5 w-5 text-hotel-600"/> สรุปยอดค่าบริการ</h2>
          <div className="flex gap-3 mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <img src={`https://images.unsplash.com/${selectedRoom.image}?auto=format&fit=crop&w=150&q=80`} className="w-16 h-16 rounded-lg object-cover" alt={selectedRoom.name}/>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{selectedRoom.name}</h3>
              <span className="text-xs text-slate-500 tabular-nums">฿{selectedRoom.price.toLocaleString()} / คืน</span>
            </div>
          </div>

          <form onSubmit={handleApplyPromo} className="mb-5">
            <FieldLabel>กรอกโค้ดส่วนลด</FieldLabel>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Ticket className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="เช่น WELCOME10"
                  disabled={!requiredFieldsComplete || discount > 0}
                  className="border border-slate-200 rounded-xl pl-9 pr-3 py-2 w-full text-sm uppercase transition-colors duration-200 focus:outline-none focus:border-hotel-500 focus:ring-3 focus:ring-hotel-500/15 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={!requiredFieldsComplete || discount > 0}
                className="bg-hotel-950 hover:bg-hotel-700 disabled:opacity-40 disabled:hover:bg-hotel-950 disabled:cursor-not-allowed text-white px-3 rounded-xl text-label font-semibold transition-colors duration-300 ease-out-expo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hotel-600"
              >ใช้โค้ด</button>
            </div>
            {!requiredFieldsComplete && (
              <p className="text-xs text-slate-400 mt-1.5">กรอกวันที่เข้าพักและข้อมูลผู้ติดต่อ (ชื่อจริง, เบอร์โทรศัพท์) ให้ครบก่อน จึงจะใช้โค้ดส่วนลดได้</p>
            )}
            {requiredFieldsComplete && discount > 0 && (
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs flex items-center gap-1.5 text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> ใช้โค้ด {bookingState.promoCode} แล้ว</p>
                <button type="button" onClick={handleRemovePromo} className="text-xs text-slate-400 hover:text-hotel-600 underline transition-colors duration-150">เปลี่ยนโค้ด</button>
              </div>
            )}
            {requiredFieldsComplete && discount === 0 && promoMsg.text && (
              <p className={`text-xs mt-1.5 flex items-center gap-1.5 ${promoMsg.error ? 'text-red-500' : 'text-emerald-600'}`}>
                {promoMsg.error ? <AlertCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />} {promoMsg.text}
              </p>
            )}
          </form>

          <div className="border-t border-slate-100 pt-4 mb-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>฿{selectedRoom.price.toLocaleString()} × {nights || 1} คืน</span>
              <span className="tabular-nums">฿{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-hotel-600">
                <span>ส่วนลด {Math.round(discount * 100)}%</span>
                <span className="tabular-nums">−฿{(subtotal * discount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg items-end pt-2 border-t border-slate-100">
              <span>ยอดสุทธิ</span>
              <span className="text-price text-hotel-600 tabular-nums">฿{totalPrice.toLocaleString()}</span>
            </div>
          </div>
          {errorMsg && <p className="text-red-500 text-xs mb-3 font-semibold text-center flex items-center justify-center gap-1.5"><AlertCircle className="h-3.5 w-3.5" /> {errorMsg}</p>}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-hotel-600 hover:bg-hotel-700 disabled:opacity-60 disabled:hover:bg-hotel-600 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-300 ease-out-expo shadow-[0_8px_24px_-6px_oklch(0.46_0.135_228_/_0.35)] flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hotel-600"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'กำลังประมวลผล...' : 'ยืนยันการจองห้องพัก'}
          </button>
        </div>
      </div>
    </div>
  );
};

const formatThaiDate = (iso) =>
  new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });

const getStayStatus = (checkIn, checkOut) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (today < inDate) return { label: 'กำลังจะมาถึง', className: 'bg-hotel-50 text-hotel-700 border border-hotel-200' };
  if (today < outDate) return { label: 'กำลังเข้าพัก', className: 'bg-hotel-600 text-white' };
  return { label: 'เข้าพักเสร็จสิ้น', className: 'bg-slate-100 text-slate-500' };
};

const BookingResultCard = ({ booking }) => {
  const status = getStayStatus(booking.checkIn, booking.checkOut);
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-title font-medium text-slate-900">{booking.roomName}</h3>
          <p className="text-sm text-slate-500">{booking.firstName} {booking.lastName}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${status.className}`}>{status.label}</span>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 mb-4">
        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-hotel-600" /><span>เช็คอิน {formatThaiDate(booking.checkIn)}</span></div>
        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-hotel-600" /><span>เช็คเอาต์ {formatThaiDate(booking.checkOut)}</span></div>
        <div className="flex items-center gap-2"><Moon className="h-4 w-4 text-hotel-600" /><span>{booking.nights} คืน · {booking.guests} ท่าน</span></div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Ticket className="h-4 w-4 text-slate-400" />
          <span className="font-mono tabular-nums">{booking.reference}</span>
        </div>
        <span className="text-title font-bold text-hotel-600 tabular-nums">฿{booking.total.toLocaleString()}</span>
      </div>
    </div>
  );
};

const BookingLookup = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const qLower = q.toLowerCase();
    const qDigits = q.replace(/\D/g, '');
    const matches = getStoredBookings()
      .filter((b) => {
        const fullName = `${b.firstName} ${b.lastName}`.toLowerCase();
        const phoneDigits = (b.phone || '').replace(/\D/g, '');
        const nameMatch = fullName.includes(qLower);
        const phoneMatch = qDigits.length >= 4 && phoneDigits.includes(qDigits);
        return nameMatch || phoneMatch;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setResults(matches);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-headline font-normal mb-2">ตรวจสอบการจองของคุณ</h1>
      <p className="text-slate-500 mb-8 max-w-[60ch]">กรอกชื่อ-นามสกุล หรือเบอร์โทรศัพท์ที่ใช้ตอนจอง เพื่อตรวจสอบว่ามีห้องพักจองไว้หรือไม่ และเข้าพักวันไหน</p>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="ชื่อ-นามสกุล หรือ เบอร์โทรศัพท์"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-slate-200 rounded-xl pl-10 pr-3 py-3 w-full transition-colors duration-200 focus:outline-none focus:border-hotel-500 focus:ring-3 focus:ring-hotel-500/15"
          />
        </div>
        <button
          type="submit"
          className="bg-hotel-600 hover:bg-hotel-700 text-white font-semibold px-6 rounded-xl transition-colors duration-300 ease-out-expo shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hotel-600"
        >
          ค้นหา
        </button>
      </form>

      {results === null && (
        <div className="text-center py-16 text-slate-400">
          <Search className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <p>กรอกข้อมูลด้านบนเพื่อค้นหาการจองของคุณ</p>
        </div>
      )}

      {results !== null && results.length === 0 && (
        <div className="text-center py-16">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-hotel-300" />
          <h2 className="font-display text-title font-medium text-slate-900 mb-2">ไม่พบการจองที่ตรงกับข้อมูลนี้</h2>
          <p className="text-slate-500 max-w-[50ch] mx-auto">ตรวจสอบการสะกดชื่อ หรือลองค้นหาด้วยเบอร์โทรศัพท์ที่ใช้ตอนทำการจองอีกครั้ง</p>
        </div>
      )}

      {results !== null && results.length > 0 && (
        <div className="space-y-4">
          {results.map((booking) => <BookingResultCard key={booking.reference} booking={booking} />)}
        </div>
      )}
    </div>
  );
};

const PageTransition = ({ children }) => {
  const location = useLocation();
  return <div key={location.pathname} className="page-transition">{children}</div>;
};

// ==========================================
// 4. Component หลัก (App)
// ==========================================
export default function App() {
  return (
    <BookingProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
          <Navbar />
          <main className="flex-grow">
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/check-booking" element={<BookingLookup />} />
              </Routes>
            </PageTransition>
          </main>
          <Footer />
        </div>
      </Router>
    </BookingProvider>
  );
}