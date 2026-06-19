import React, { createContext, useState, useContext } from 'react';

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
    if (upperCode === 'WELCOME10') discountPercent = 0.10; // ลด 10%
    if (upperCode === 'PROMO20') discountPercent = 0.20; // ลด 20%
    
    setBookingState(prev => ({ ...prev, promoCode: upperCode, discount: discountPercent }));
    return discountPercent > 0;
  };

  const clearBooking = () => setBookingState({
    checkIn: '', checkOut: '', guests: 1, selectedRoom: null, promoCode: '', discount: 0,
    guestInfo: { firstName: '', lastName: '', email: '', phone: '', specialRequests: '' }, bookingReference: null
  });

  const finalizeBooking = () => {
    // จำลองการสุ่มรหัส Booking ID จาก Backend
    const randomRef = 'HTL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setBookingState(prev => ({ ...prev, bookingReference: randomRef }));
    return randomRef;
  };

  return (
    <BookingContext.Provider value={{ bookingState, updateBookingDates, selectRoom, updateGuestInfo, applyPromoCode, finalizeBooking, clearBooking }}>
      {children}
    </BookingContext.Provider>
  );
};