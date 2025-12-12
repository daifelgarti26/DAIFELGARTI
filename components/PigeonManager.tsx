import React, { useState } from 'react';
import { Plus, Trash2, Search, Filter, Bird } from 'lucide-react';
import { Pigeon, Sex, Status } from '../types';

interface PigeonManagerProps {
  pigeons: Pigeon[];
  setPigeons: React.Dispatch<React.SetStateAction<Pigeon[]>>;
}

const PigeonManager: React.FC<PigeonManagerProps> = ({ pigeons, setPigeons }) => {
  const [showForm, setShowForm] = useState(false);
  const [filterStrain, setFilterStrain] = useState('');
  
  const [newPigeon, setNewPigeon] = useState<Partial<Pigeon>>({
    sex: Sex.Male,
    status: Status.Active
  });

  const handleAddPigeon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPigeon.ringNumber || !newPigeon.strain) return;

    const pigeon: Pigeon = {
      id: Date.now().toString(),
      ringNumber: newPigeon.ringNumber,
      color: newPigeon.color || 'أزرق',
      strain: newPigeon.strain,
      sex: newPigeon.sex as Sex,
      status: newPigeon.status as Status,
      hatchDate: newPigeon.hatchDate || new Date().toISOString().split('T')[0],
      notes: newPigeon.notes || ''
    };

    setPigeons([pigeon, ...pigeons]);
    setNewPigeon({ sex: Sex.Male, status: Status.Active });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطائر؟')) {
      setPigeons(pigeons.filter(p => p.id !== id));
    }
  };

  const filteredPigeons = pigeons.filter(p => 
    p.ringNumber.includes(filterStrain) || p.strain.includes(filterStrain)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">سجل الطيور</h2>
          <p className="text-slate-500 text-sm">إدارة الحمام، السلالات، والحالة الصحية</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all"
        >
          <Plus size={20} />
          <span>إضافة طائر جديد</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 animate-fade-in">
          <h3 className="text-lg font-bold mb-4 text-primary-700">بيانات الطائر الجديد</h3>
          <form onSubmit={handleAddPigeon} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">رقم الحجل (الخاتم)</label>
              <input 
                required
                type="text" 
                placeholder="مثال: MA-2024-12345"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-black"
                value={newPigeon.ringNumber || ''}
                onChange={e => setNewPigeon({...newPigeon, ringNumber: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">السلالة</label>
              <input 
                required
                type="text" 
                placeholder="مثال: جانسين"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-black"
                value={newPigeon.strain || ''}
                onChange={e => setNewPigeon({...newPigeon, strain: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">اللون</label>
              <input 
                type="text" 
                placeholder="مثال: أزرق خطين"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-black"
                value={newPigeon.color || ''}
                onChange={e => setNewPigeon({...newPigeon, color: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">الجنس</label>
              <select 
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white text-black"
                value={newPigeon.sex}
                onChange={e => setNewPigeon({...newPigeon, sex: e.target.value as Sex})}
              >
                <option value={Sex.Male}>{Sex.Male}</option>
                <option value={Sex.Female}>{Sex.Female}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">الحالة</label>
              <select 
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white text-black"
                value={newPigeon.status}
                onChange={e => setNewPigeon({...newPigeon, status: e.target.value as Status})}
              >
                {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
             <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">تاريخ التفقيس</label>
              <input 
                type="date" 
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-black"
                value={newPigeon.hatchDate || ''}
                onChange={e => setNewPigeon({...newPigeon, hatchDate: e.target.value})}
              />
            </div>
            <div className="col-span-full mt-2 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                إلغاء
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-md"
              >
                حفظ البيانات
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="ابحث برقم الحجل أو السلالة..." 
          className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm text-black"
          value={filterStrain}
          onChange={(e) => setFilterStrain(e.target.value)}
        />
      </div>

      {/* Pigeon List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPigeons.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
            <Bird size={48} className="mx-auto mb-3 opacity-50" />
            <p>لا توجد طيور مسجلة حالياً تطابق بحثك</p>
          </div>
        ) : (
          filteredPigeons.map(pigeon => (
            <div key={pigeon.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group">
              <div className="flex justify-between items-start mb-3">
                <span className={`
                  px-3 py-1 rounded-full text-xs font-bold
                  ${pigeon.sex === Sex.Male ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}
                `}>
                  {pigeon.sex}
                </span>
                <span className={`
                  px-3 py-1 rounded-full text-xs font-bold
                  ${pigeon.status === Status.Active ? 'bg-green-100 text-green-700' : 
                    pigeon.status === Status.Breeding ? 'bg-amber-100 text-amber-700' : 
                    'bg-slate-100 text-slate-700'}
                `}>
                  {pigeon.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-1">{pigeon.ringNumber}</h3>
              <p className="text-primary-600 font-medium text-sm mb-4">{pigeon.strain}</p>
              
              <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-600">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">اللون</span>
                  <span>{pigeon.color}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">تاريخ التفقيس</span>
                  <span>{pigeon.hatchDate}</span>
                </div>
              </div>

              <button 
                onClick={() => handleDelete(pigeon.id)}
                className="absolute left-4 top-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PigeonManager;