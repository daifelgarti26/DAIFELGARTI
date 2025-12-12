import React, { useState } from 'react';
import { Timer, MapPin, ArrowDown, Clock, Wind, Calculator } from 'lucide-react';
import { VelocityResult } from '../types';

const VelocityCalculator: React.FC = () => {
  const [mode, setMode] = useState<'velocity' | 'arrival'>('velocity');

  // Shared State
  const [distance, setDistance] = useState<number>(0); // in km
  const [releaseTime, setReleaseTime] = useState<string>('07:00');

  // Velocity Calc State
  const [arrivalTime, setArrivalTime] = useState<string>('12:00');
  const [arrivalDayOffset, setArrivalDayOffset] = useState<number>(0);
  const [velocityResult, setVelocityResult] = useState<VelocityResult | null>(null);

  // Arrival Prediction State
  const [estimatedSpeed, setEstimatedSpeed] = useState<number>(1300); // m/min default
  const [predictedArrival, setPredictedArrival] = useState<string | null>(null);
  const [flightDuration, setFlightDuration] = useState<string | null>(null);

  const calculateVelocity = () => {
    if (!distance || !releaseTime || !arrivalTime) return;

    const [rHours, rMinutes] = releaseTime.split(':').map(Number);
    const [aHours, aMinutes] = arrivalTime.split(':').map(Number);

    const rDate = new Date();
    rDate.setHours(rHours, rMinutes, 0, 0);

    const aDate = new Date();
    aDate.setHours(aHours, aMinutes, 0, 0);
    aDate.setDate(aDate.getDate() + arrivalDayOffset);

    // Auto-detect next day if offset is 0 but arrival is before release (e.g. overnight race)
    if (aDate.getTime() < rDate.getTime() && arrivalDayOffset === 0) {
       aDate.setDate(aDate.getDate() + 1);
    }

    const diffMs = aDate.getTime() - rDate.getTime();
    const flightTimeMinutes = diffMs / (1000 * 60);

    if (flightTimeMinutes <= 0) {
      alert("وقت الوصول يجب أن يكون بعد وقت الإطلاق");
      return;
    }

    const distanceMeters = distance * 1000;
    const velocity = distanceMeters / flightTimeMinutes;

    setVelocityResult({
      velocity: parseFloat(velocity.toFixed(3)),
      flightTimeMinutes: parseFloat(flightTimeMinutes.toFixed(1))
    });
  };

  const calculateArrival = () => {
    if (!distance || !releaseTime || !estimatedSpeed) return;

    const distanceMeters = distance * 1000;
    // Time = Distance / Speed
    const durationMinutes = distanceMeters / estimatedSpeed;

    const [rHours, rMinutes] = releaseTime.split(':').map(Number);
    const arrivalDate = new Date();
    arrivalDate.setHours(rHours, rMinutes, 0, 0);
    
    // Add duration using milliseconds for precision
    const durationMs = durationMinutes * 60 * 1000;
    arrivalDate.setTime(arrivalDate.getTime() + durationMs);

    // Format output
    const hours = arrivalDate.getHours().toString().padStart(2, '0');
    const minutes = arrivalDate.getMinutes().toString().padStart(2, '0');
    
    // Check if next day
    const rDate = new Date();
    rDate.setHours(rHours, rMinutes, 0, 0);
    const isNextDay = arrivalDate.getDate() !== rDate.getDate();

    setPredictedArrival(`${hours}:${minutes}${isNextDay ? ' (+1 يوم)' : ''}`);
    
    const h = Math.floor(durationMinutes / 60);
    const m = Math.round(durationMinutes % 60);
    setFlightDuration(`${h} ساعة و ${m} دقيقة`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Mode Switcher */}
      <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
        <button
          onClick={() => setMode('velocity')}
          className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2
            ${mode === 'velocity' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Calculator size={18} />
          حساب السرعة (بعد الوصول)
        </button>
        <button
          onClick={() => setMode('arrival')}
          className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2
            ${mode === 'arrival' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Clock size={18} />
          توقع وقت الوصول (قبل السباق)
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Common Inputs */}
          <div className="col-span-full">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <MapPin size={18} className="text-primary-500" />
              مسافة السباق (كيلومتر)
            </label>
            <input 
              type="number" 
              value={distance || ''}
              onChange={(e) => setDistance(parseFloat(e.target.value))}
              placeholder="مثال: 150.5"
              step="0.001"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-mono text-lg text-black"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <Timer size={18} className="text-primary-500" />
              وقت الإطلاق
            </label>
            <input 
              type="time" 
              value={releaseTime}
              onChange={(e) => setReleaseTime(e.target.value)}
              step="1"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-mono text-lg text-black"
            />
          </div>

          {/* MODE: VELOCITY CALCULATOR */}
          {mode === 'velocity' && (
            <>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <ArrowDown size={18} className="text-primary-500" />
                  وقت الوصول
                </label>
                <input 
                  type="time" 
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  step="1"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-mono text-lg text-black"
                />
              </div>

              <div className="col-span-full">
                <label className="text-sm font-medium text-slate-600 mb-2 block">أيام إضافية</label>
                <div className="flex gap-4">
                  {[0, 1, 2].map(day => (
                    <button
                      key={day}
                      onClick={() => setArrivalDayOffset(day)}
                      className={`flex-1 py-2 rounded-lg border transition-all ${arrivalDayOffset === day ? 'bg-primary-500 text-white border-primary-500' : 'bg-white border-slate-200 text-slate-600'}`}
                    >
                      {day === 0 ? 'نفس اليوم' : day === 1 ? '+1 يوم' : `+${day} أيام`}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={calculateVelocity}
                className="col-span-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg mt-4"
              >
                احسب السرعة
              </button>

              {velocityResult && (
                <div className="col-span-full mt-4 pt-6 border-t border-dashed border-slate-200 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-primary-50 p-4 rounded-2xl">
                      <p className="text-primary-600 text-sm font-bold mb-1">السرعة المحققة</p>
                      <p className="text-3xl font-black text-primary-700 font-mono">
                        {velocityResult.velocity} <span className="text-base font-normal">م/د</span>
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-slate-500 text-sm font-bold mb-1">زمن الطيران</p>
                      <p className="text-xl font-bold text-slate-700 font-mono">
                        {Math.floor(velocityResult.flightTimeMinutes / 60)}h {Math.round(velocityResult.flightTimeMinutes % 60)}m
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* MODE: ARRIVAL PREDICTION */}
          {mode === 'arrival' && (
            <>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <Wind size={18} className="text-primary-500" />
                  السرعة المتوقعة (م/د)
                </label>
                <input 
                  type="number" 
                  value={estimatedSpeed || ''}
                  onChange={(e) => setEstimatedSpeed(parseFloat(e.target.value))}
                  placeholder="مثال: 1300"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-mono text-lg text-black"
                />
              </div>

              {/* Speed Presets */}
              <div className="col-span-full">
                 <p className="text-xs font-bold text-slate-400 mb-2">اختصارات حسب الطقس:</p>
                 <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setEstimatedSpeed(1100)} className="p-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100">
                       رياح معاكسة (1100)
                    </button>
                    <button onClick={() => setEstimatedSpeed(1300)} className="p-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100">
                       جو عادي (1300)
                    </button>
                    <button onClick={() => setEstimatedSpeed(1600)} className="p-2 bg-green-50 text-green-600 rounded-lg text-xs font-bold hover:bg-green-100">
                       رياح مساعدة (1600)
                    </button>
                 </div>
              </div>

              <button 
                onClick={calculateArrival}
                className="col-span-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg mt-4"
              >
                توقع وقت الوصول
              </button>

              {predictedArrival && (
                <div className="col-span-full mt-4 pt-6 border-t border-dashed border-slate-200 animate-fade-in text-center">
                   <p className="text-slate-500 text-sm font-bold mb-2">وقت الوصول المتوقع</p>
                   <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl inline-block min-w-[200px]">
                      <span className="text-4xl font-mono font-bold tracking-wider">{predictedArrival}</span>
                   </div>
                   <p className="mt-3 text-sm text-primary-600 font-medium">
                     مدة الطيران: {flightDuration}
                   </p>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default VelocityCalculator;