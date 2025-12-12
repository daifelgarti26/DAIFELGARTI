import React, { useState, useEffect } from 'react';
import { Search, Trophy, MapPin, Timer, Plus, ArrowRight, Medal, Calendar, Globe, Link as LinkIcon, Download, Loader2, CheckCircle } from 'lucide-react';
import { Pigeon, RaceResult, ImportedResult } from '../types';
import { parseRaceResults } from '../services/geminiService';

interface RaceResultsProps {
  pigeons: Pigeon[];
  setPigeons: React.Dispatch<React.SetStateAction<Pigeon[]>>;
}

const RaceResults: React.FC<RaceResultsProps> = ({ pigeons, setPigeons }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPigeonId, setSelectedPigeonId] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [importText, setImportText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [importedResults, setImportedResults] = useState<ImportedResult[]>([]);
  
  // Load saved URL
  useEffect(() => {
    const savedUrl = localStorage.getItem('raceResultsUrl');
    if (savedUrl) setWebsiteUrl(savedUrl);
  }, []);

  const handleSaveUrl = () => {
    localStorage.setItem('raceResultsUrl', websiteUrl);
    alert('تم حفظ رابط الموقع بنجاح');
  };

  const [newResult, setNewResult] = useState<Partial<RaceResult>>({
    date: new Date().toISOString().split('T')[0],
    rank: 1,
    velocity: 0,
    stage: '',
    releaseLocation: ''
  });

  const selectedPigeon = pigeons.find(p => p.id === selectedPigeonId);
  
  const filteredPigeons = pigeons.filter(p => 
    p.ringNumber.includes(searchTerm) || p.strain.includes(searchTerm)
  );

  const handleAddResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPigeon || !newResult.releaseLocation || !newResult.velocity) return;

    const result: RaceResult = {
      id: Date.now().toString(),
      releaseLocation: newResult.releaseLocation,
      stage: newResult.stage || 'غير محدد',
      rank: Number(newResult.rank),
      velocity: Number(newResult.velocity),
      date: newResult.date || new Date().toISOString().split('T')[0]
    };

    const updatedPigeons = pigeons.map(p => {
      if (p.id === selectedPigeon.id) {
        return {
          ...p,
          raceResults: [result, ...(p.raceResults || [])]
        };
      }
      return p;
    });

    setPigeons(updatedPigeons);
    setNewResult({
      date: new Date().toISOString().split('T')[0],
      rank: 1,
      velocity: 0,
      stage: '',
      releaseLocation: ''
    });
  };

  const handleRemoveResult = (resultId: string) => {
    if (!selectedPigeon) return;
    if (!window.confirm('هل أنت متأكد من حذف هذه النتيجة؟')) return;

    const updatedPigeons = pigeons.map(p => {
      if (p.id === selectedPigeon.id) {
        return {
          ...p,
          raceResults: p.raceResults?.filter(r => r.id !== resultId)
        };
      }
      return p;
    });
    setPigeons(updatedPigeons);
  };

  const handleAnalyzeText = async () => {
    if (!importText.trim()) return;
    setIsAnalyzing(true);
    setImportedResults([]);
    
    const results = await parseRaceResults(importText);
    
    // Filter results to only show ones that match existing pigeons
    const matchedResults = results.map(r => {
        // Simple fuzzy match: check if ring number contains the imported one or vice versa
        const match = pigeons.find(p => p.ringNumber.includes(r.ringNumber) || r.ringNumber.includes(p.ringNumber));
        return match ? { ...r, ringNumber: match.ringNumber } : null; // Normalize ring number to ours
    }).filter(Boolean) as ImportedResult[];

    setImportedResults(matchedResults);
    setIsAnalyzing(false);
  };

  const confirmImport = () => {
    if (importedResults.length === 0) return;

    const updatedPigeons = [...pigeons];

    importedResults.forEach(imported => {
      const pigeonIndex = updatedPigeons.findIndex(p => p.ringNumber === imported.ringNumber);
      if (pigeonIndex !== -1) {
        const newRaceResult: RaceResult = {
          id: Date.now().toString() + Math.random(),
          date: imported.date,
          rank: imported.rank,
          velocity: imported.velocity,
          stage: imported.stage,
          releaseLocation: imported.releaseLocation
        };
        
        // Add if not duplicate (simple check)
        const exists = updatedPigeons[pigeonIndex].raceResults?.some(r => 
          r.releaseLocation === newRaceResult.releaseLocation && r.rank === newRaceResult.rank
        );

        if (!exists) {
          updatedPigeons[pigeonIndex] = {
            ...updatedPigeons[pigeonIndex],
            raceResults: [newRaceResult, ...(updatedPigeons[pigeonIndex].raceResults || [])]
          };
        }
      }
    });

    setPigeons(updatedPigeons);
    setImportText('');
    setImportedResults([]);
    setShowImportModal(false);
    alert('تم استيراد النتائج بنجاح وإضافتها للطيور المطابقة!');
  };

  if (selectedPigeon) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button 
          onClick={() => setSelectedPigeonId(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors font-medium"
        >
          <ArrowRight size={20} />
          <span>العودة للقائمة</span>
        </button>

        {/* Pigeon Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
              <Trophy size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{selectedPigeon.ringNumber}</h2>
              <p className="text-slate-500">{selectedPigeon.strain} | {selectedPigeon.color}</p>
            </div>
          </div>
          <div className="bg-slate-50 px-6 py-3 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-400 font-bold mb-1">عدد السباقات</p>
            <p className="text-xl font-bold text-slate-800 text-center">{selectedPigeon.raceResults?.length || 0}</p>
          </div>
        </div>

        {/* Add Result Form */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-700">
            <Plus size={20} className="text-primary-600" />
            إضافة نتيجة سباق يدوياً
          </h3>
          <form onSubmit={handleAddResult} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-1 space-y-1">
               <label className="text-xs font-bold text-slate-500">اسم منطقة الإطلاق</label>
               <input 
                 required
                 type="text"
                 placeholder="مثال: الصويرة"
                 className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-black"
                 value={newResult.releaseLocation}
                 onChange={e => setNewResult({...newResult, releaseLocation: e.target.value})}
               />
            </div>
            <div className="lg:col-span-1 space-y-1">
               <label className="text-xs font-bold text-slate-500">المرحلة</label>
               <input 
                 required
                 type="text"
                 placeholder="مثال: سرعة / نصف طويل"
                 className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-black"
                 value={newResult.stage}
                 onChange={e => setNewResult({...newResult, stage: e.target.value})}
               />
            </div>
            <div className="lg:col-span-1 space-y-1">
               <label className="text-xs font-bold text-slate-500">المرتبة</label>
               <input 
                 required
                 type="number"
                 min="1"
                 className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-black"
                 value={newResult.rank}
                 onChange={e => setNewResult({...newResult, rank: Number(e.target.value)})}
               />
            </div>
            <div className="lg:col-span-1 space-y-1">
               <label className="text-xs font-bold text-slate-500">السرعة (م/د)</label>
               <input 
                 required
                 type="number"
                 step="0.001"
                 className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-black"
                 value={newResult.velocity}
                 onChange={e => setNewResult({...newResult, velocity: Number(e.target.value)})}
               />
            </div>
            <button 
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white p-2.5 rounded-lg font-bold transition-colors h-[42px]"
            >
              حفظ النتيجة
            </button>
          </form>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-700 text-lg">سجل السباقات</h3>
          {!selectedPigeon.raceResults || selectedPigeon.raceResults.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
              <Trophy size={40} className="mx-auto mb-2 opacity-30" />
              <p>لا توجد نتائج مسجلة لهذا الطائر بعد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedPigeon.raceResults.map(result => (
                <div key={result.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all relative group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                       <MapPin size={18} className="text-primary-500" />
                       <span className="font-bold text-lg text-slate-800">{result.releaseLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                       <Medal size={14} className={result.rank === 1 ? 'text-yellow-500' : result.rank <= 3 ? 'text-slate-400' : 'text-slate-400'} />
                       <span className="font-bold text-sm text-slate-700">المركز {result.rank}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <Timer size={12} /> السرعة
                      </p>
                      <p className="font-mono font-bold text-primary-700">{result.velocity.toFixed(3)} م/د</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <Calendar size={12} /> المرحلة/التاريخ
                      </p>
                      <p className="font-medium text-slate-700 text-sm">{result.stage}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleRemoveResult(result.id)}
                    className="absolute top-4 left-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">أرشيف السباقات</h2>
          <p className="text-slate-500">تتبع إنجازات أبطالك في السباقات</p>
        </div>
        <button 
          onClick={() => setShowImportModal(true)}
          className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-all"
        >
          <Globe size={18} />
          <span>ربط الموقع / استيراد</span>
        </button>
      </div>

      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
               <h3 className="font-bold text-lg flex items-center gap-2">
                 <Download className="text-primary-400" />
                 استيراد النتائج من الموقع
               </h3>
               <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white">إغلاق</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Web Link Section */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-sm font-bold text-slate-700 mb-2 block">رابط موقع النتائج (للجمعية أو النادي)</label>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    className="flex-1 p-2 border border-slate-300 rounded-lg outline-none focus:border-primary-500 ltr text-black"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                  <button onClick={handleSaveUrl} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold text-sm">حفظ</button>
                  {websiteUrl && (
                    <a href={websiteUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 hover:bg-primary-700">
                      <LinkIcon size={16} /> فتح
                    </a>
                  )}
                </div>
              </div>

              {/* Import Section */}
              <div className="space-y-3">
                 <p className="text-slate-600 text-sm">
                   قم بنسخ جدول النتائج أو النص من الموقع والصقه هنا. سيقوم الذكاء الاصطناعي باستخراج النتائج ومطابقتها مع طيورك.
                 </p>
                 <textarea 
                   className="w-full h-32 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm font-mono text-black"
                   placeholder="مثال: 1. MA-24-12345 - 1200 m/m - Essaouira..."
                   value={importText}
                   onChange={(e) => setImportText(e.target.value)}
                 ></textarea>
                 
                 <button 
                   onClick={handleAnalyzeText}
                   disabled={isAnalyzing || !importText}
                   className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                 >
                   {isAnalyzing ? <><Loader2 className="animate-spin" /> جاري التحليل...</> : 'تحليل واستخراج النتائج'}
                 </button>
              </div>

              {/* Analysis Results */}
              {importedResults.length > 0 && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800">النتائج المطابقة ({importedResults.length})</h4>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">تم العثور على طيورك!</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-sm text-right">
                      <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                          <th className="p-3">الطائر</th>
                          <th className="p-3">الرتبة</th>
                          <th className="p-3">السرعة</th>
                          <th className="p-3">المنطقة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importedResults.map((r, i) => (
                          <tr key={i} className="border-t border-slate-100">
                            <td className="p-3 font-bold text-slate-800 dir-ltr">{r.ringNumber}</td>
                            <td className="p-3">{r.rank}</td>
                            <td className="p-3 font-mono">{r.velocity}</td>
                            <td className="p-3">{r.releaseLocation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button 
                    onClick={confirmImport}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md"
                  >
                    <CheckCircle size={20} />
                    تأكيد وإضافة لقاعدة البيانات
                  </button>
                </div>
              )}
               {/* No Results Message */}
              {!isAnalyzing && importText && importedResults.length === 0 && (
                  <p className="text-center text-sm text-slate-400 mt-2">
                      لم يتم العثور على نتائج مطابقة لطيورك المسجلة في النص المدخل.
                  </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto relative">
        <input 
          type="text" 
          placeholder="أدخل رقم الحجل للبحث (مثال: MA-24...)" 
          className="w-full pl-4 pr-12 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-primary-500 outline-none text-lg text-center font-mono text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {filteredPigeons.length === 0 ? (
          <div className="col-span-full text-center text-slate-400 mt-8">
            <p>لا توجد طيور مطابقة للبحث</p>
          </div>
        ) : (
          filteredPigeons.map(pigeon => (
            <button 
              key={pigeon.id}
              onClick={() => setSelectedPigeonId(pigeon.id)}
              className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-primary-500 hover:shadow-md transition-all text-right group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-1 h-full bg-slate-200 group-hover:bg-primary-500 transition-colors"></div>
              <div className="flex justify-between items-start pr-3">
                <span className="font-bold text-lg text-slate-800 group-hover:text-primary-600 transition-colors dir-ltr">{pigeon.ringNumber}</span>
                <span className={`text-xs px-2 py-1 rounded font-bold ${pigeon.raceResults?.length ? 'bg-primary-50 text-primary-700' : 'bg-slate-100 text-slate-500'}`}>
                  {pigeon.raceResults?.length || 0} سباق
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1 pr-3">{pigeon.strain}</p>
              {pigeon.raceResults && pigeon.raceResults.length > 0 && (
                <div className="mt-3 pr-3 pt-3 border-t border-dashed border-slate-100 flex items-center gap-2 text-xs text-slate-400">
                  <Trophy size={14} className="text-yellow-500" />
                  <span>آخر سباق: {pigeon.raceResults[0].releaseLocation} (#{pigeon.raceResults[0].rank})</span>
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default RaceResults;