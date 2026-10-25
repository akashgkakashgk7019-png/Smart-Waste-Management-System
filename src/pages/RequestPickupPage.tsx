import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Truck, Calendar, Clock, MapPin, Phone, CheckCircle2, ShieldCheck, AlertCircle, ArrowRight, Compass, Navigation, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BackButton } from '../components/BackButton';

interface PickupSlot {
  id: string;
  label: string;
  maxCapacity: number;
  bookedCount: number;
  remainingCapacity: number;
  isAvailable: boolean;
}

export const RequestPickupPage: React.FC<{ setCurrentTab: (tab: string) => void; onBack?: () => void }> = ({ setCurrentTab, onBack }) => {
  const { t } = useLanguage();
  const { user, openAuthModal } = useAuth();

  const [wasteType, setWasteType] = useState('Bulky Furniture & Mattresses');
  const [estimatedQtyKg, setEstimatedQtyKg] = useState(25);
  const [address, setAddress] = useState(user?.address || '');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsNotice, setGpsNotice] = useState<string | null>(null);
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('09:00 AM - 11:30 AM (Morning)');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [instructions, setInstructions] = useState('');

  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    id: string;
    smsNotice: string;
  } | null>(null);

  // Fetch slots whenever preferredDate changes
  useEffect(() => {
    setLoadingSlots(true);
    fetch(`/api/pickups/slots?date=${preferredDate}`)
      .then(res => res.json())
      .then(data => {
        if (data.slots) {
          setSlots(data.slots);
          // Set first available slot
          const firstAvail = data.slots.find((s: PickupSlot) => s.isAvailable);
          if (firstAvail) setPreferredTimeSlot(firstAvail.label);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingSlots(false));
  }, [preferredDate]);

  useEffect(() => {
    if (user) {
      if (user.address && !address) setAddress(user.address);
      if (user.mobile && !mobile) setMobile(user.mobile);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const token = localStorage.getItem('smartwaste_token');
      const res = await fetch('/api/pickups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          wasteType,
          estimatedQtyKg,
          address,
          preferredDate,
          preferredTimeSlot,
          mobile,
          instructions
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Failed to schedule pickup');
      } else {
        setBookingConfirmation({
          id: data.pickupRequest.id,
          smsNotice: data.smsDeliveryNotice
        });
        confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGpsNotice('GPS Geolocation is not supported by your current browser.');
      return;
    }
    setGpsLoading(true);
    setGpsNotice('Detecting device GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const detectedLat = parseFloat(pos.coords.latitude.toFixed(5));
        const detectedLng = parseFloat(pos.coords.longitude.toFixed(5));
        try {
          const res = await fetch(`/api/locations/reverse-geocode?lat=${detectedLat}&lng=${detectedLng}`);
          const data = await res.json();
          if (data && data.success && data.formatted_address) {
            setAddress(data.formatted_address);
            setGpsNotice(`✓ Address fetched: ${data.formatted_address}`);
          } else {
            setAddress(`${detectedLat}° N, ${detectedLng}° E`);
            setGpsNotice(`Coordinates acquired: ${detectedLat}° N, ${detectedLng}° E`);
          }
        } catch {
          setAddress(`${detectedLat}° N, ${detectedLng}° E`);
          setGpsNotice(`Coordinates acquired: ${detectedLat}° N, ${detectedLng}° E`);
        } finally {
          setGpsLoading(false);
        }
      },
      err => {
        setGpsLoading(false);
        setGpsNotice('Could not acquire GPS fix. Please verify location permissions.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <BackButton onClick={onBack} setCurrentTab={setCurrentTab} fallbackTab="home" />
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
          Doorstep Scheduled Collection
        </span>
      </div>

      <div className="text-center space-y-1">
        <span className="text-xs uppercase font-bold tracking-wider text-emerald-700">
          Municipal Doorstep Service
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {t.pickupTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          {t.pickupSubtitle}
        </p>
      </div>

      {!bookingConfirmation ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Waste Type */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t.wasteTypeLabel} *
              </label>
              <select
                value={wasteType}
                onChange={e => setWasteType(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Bulky Furniture & Mattresses">Bulky Furniture & Mattresses</option>
                <option value="Electronic E-Waste (Computers, TVs, Appliances)">Electronic E-Waste (Computers, TVs, Appliances)</option>
                <option value="Garden Pruned Branches & Green Debris">Garden Pruned Branches & Green Debris</option>
                <option value="Bulk Cardboard & Packaging Material">Bulk Cardboard & Packaging Material</option>
                <option value="Dry Recyclable Plastic Scrap">Dry Recyclable Plastic Scrap</option>
                <option value="Minor C&D Rubble (Tiles, Bricks)">Minor C&D Rubble (Tiles, Bricks)</option>
              </select>
            </div>

            {/* Estimated Quantity */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t.estimatedQtyLabel} *
              </label>
              <input
                type="number"
                min="5"
                max="500"
                required
                value={estimatedQtyKg}
                onChange={e => setEstimatedQtyKg(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 font-mono"
              />
            </div>
          </div>

          {/* Date & Time Slot selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t.preferredDateLabel} *
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                required
                value={preferredDate}
                onChange={e => setPreferredDate(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t.preferredSlotLabel} (Capacity-Checked) *
              </label>
              {loadingSlots ? (
                <p className="p-2.5 text-slate-400 text-xs">Checking slot capacity...</p>
              ) : (
                <select
                  value={preferredTimeSlot}
                  onChange={e => setPreferredTimeSlot(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                >
                  {slots.map(s => (
                    <option key={s.id} value={s.label} disabled={!s.isAvailable}>
                      {s.label} ({s.remainingCapacity} slots left)
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Address & Instructions */}
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 block">
                  {t.addressLabel} *
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={gpsLoading}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  <Compass className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin text-emerald-700' : 'text-emerald-700'}`} />
                  <span>{gpsLoading ? 'Locating...' : '📍 Use My Current Location'}</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="e.g. #42, 6th Cross, 3rd Block, Koramangala, Bengaluru"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
              {gpsNotice && (
                <p className="mt-1 text-[11px] font-medium text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{gpsNotice}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {t.instructionsLabel}
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="e.g. Placed near building security gate, lift access available"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Transparent SMS notification note */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              Real-time SMS gateway notification notice: Confirmation alerts are delivered via the in-app notification center. SMS dispatch runs in municipal simulated sandbox mode.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Truck className="w-4 h-4" />
            <span>{isSubmitting ? 'Confirming Capacity & Booking...' : t.btnBookPickup}</span>
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Pickup Request Confirmed!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Your doorstep bulk collection has been scheduled with the local ward sanitation team.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 inline-block text-left max-w-sm w-full space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Pickup Request ID:</span>
              <span className="font-mono font-bold text-emerald-700 text-sm">{bookingConfirmation.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Scheduled Date:</span>
              <span className="font-bold text-slate-800">{preferredDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Time Slot:</span>
              <span className="font-medium text-slate-800">{preferredTimeSlot}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentTab('track')}
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Track Pickup Request &rarr;
            </button>
            <button
              onClick={() => setBookingConfirmation(null)}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Book Another Pickup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
