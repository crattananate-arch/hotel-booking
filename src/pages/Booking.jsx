import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, CreditCard, CheckCircle2, Ticket } from 'lucide-react';

export default function Booking() {
  const navigate = useNavigate();
  const { bookingState, updateBookingDates, updateGuestInfo, applyPromoCode, finalizeBooking, clearBooking } = useBooking();
  const [promoInput, setPromoInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ถ้ายังไม่เลือกห้อง ให้แสดงปุ่มกลับไปเลือกห้องก่อน
  if (!bookingState.selectedRoom && !bookingState.bookingReference) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold mb-4">ยังไม่ได้เลือกห้องพัก</h2>
        <button onClick={() => navigate('/rooms')} className="bg-hotel-600 text-white px-6 py-2 rounded-lg">กลับไปหน้าห้องพัก</button>
      </div>
    );
  }

  // หน้าจอสำเร็จ (Success Screen)
  if (bookingState.bookingReference) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="bg-white border p-8 rounded-3xl shadow-sm">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black mb-2">จองห้องพักสำเร็จ!</h1>
          <p className="text-stone-500 mb-6">รหัสอ้างอิงของคุณ: <span className="font-bold text-hotel-700 bg-hotel-50 px-3 py-1 rounded">{bookingState.bookingReference}</span></p>
          <button onClick={() => { clearBooking(); navigate('/'); }} className="bg-stone-900 text-white px-6 py-3 rounded-xl">กลับสู่หน้าหลัก</button>
        </div>
      </div>
    );
  }

  const { selectedRoom, discount } = bookingState;
  const totalPrice = selectedRoom.price - (selectedRoom.price * discount);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => { finalizeBooking(); setIsSubmitting(false); }, 1500); // จำลองการดีเลย์ของเซิร์ฟเวอร์
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">ข้อมูลการจองห้องพัก (Guest)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* ข้อมูลวันที่เข้าพัก */}
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold flex items-center gap-2 mb-4"><Calendar className="h-5 w-5 text-hotel-600"/> 1. วันที่เข้าพัก</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="date" className="border rounded-xl px-3 py-2" onChange={(e) => updateBookingDates(e.target.value, bookingState.checkOut, 1)} />
              <input type="date" className="border rounded-xl px-3 py-2" onChange={(e) => updateBookingDates(bookingState.checkIn, e.target.value, 1)} />
            </div>
          </div>
          {/* ข้อมูลผู้เข้าพัก */}
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="font-bold flex items-center gap-2 mb-4"><User className="h-5 w-5 text-hotel-600"/> 2. ข้อมูลติดต่อ (ไม่ต้องล็อกอิน)</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="ชื่อจริง" className="border rounded-xl px-3 py-2" onChange={(e) => updateGuestInfo({ firstName: e.target.value })} />
              <input type="text" placeholder="นามสกุล" className="border rounded-xl px-3 py-2" onChange={(e) => updateGuestInfo({ lastName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="email" placeholder="อีเมล" className="border rounded-xl px-3 py-2" onChange={(e) => updateGuestInfo({ email: e.target.value })} />
              <input type="tel" placeholder="เบอร์โทรศัพท์" className="border rounded-xl px-3 py-2" onChange={(e) => updateGuestInfo({ phone: e.target.value })} />
            </div>
          </div>
        </div>
        
        {/* สรุปราคาและโค้ดส่วนลด */}
        <div className="bg-white p-6 rounded-2xl border sticky top-10">
          <h2 className="font-bold flex items-center gap-2 mb-4 border-b pb-3"><CreditCard className="h-5 w-5 text-hotel-600"/> สรุปยอดค่าบริการ</h2>
          <div className="mb-4">
            <div className="font-bold">{selectedRoom.name}</div>
            <div className="text-sm text-stone-500">฿{selectedRoom.price.toLocaleString()} / คืน</div>
          </div>
          
          <div className="flex gap-2 mb-4">
            <input type="text" placeholder="เช่น WELCOME10" className="border rounded-xl px-3 py-2 w-full text-sm uppercase" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} />
            <button onClick={() => applyPromoCode(promoInput)} className="bg-stone-900 text-white px-3 rounded-xl text-sm">ใช้โค้ด</button>
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>ยอดรวมสุทธิ</span>
              <span className="text-hotel-600">฿{totalPrice.toLocaleString()}</span>
            </div>
          </div>
          <button onClick={handleSubmit} className="w-full bg-hotel-600 hover:bg-hotel-700 text-white font-bold py-3 rounded-xl transition-all">
            {isSubmitting ? 'กำลังประมวลผล...' : 'ยืนยันการจองห้องพัก'}
          </button>
        </div>
      </div>
    </div>
  );
}