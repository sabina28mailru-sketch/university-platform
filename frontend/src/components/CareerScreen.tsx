import React, { useState } from "react";
import { CareerProfession } from "../types";
import { KAZ_PROFESSION_CATEGORIES, ProfessionItem } from "../utils/professionData";

interface CareerScreenProps {
  careers: CareerProfession[];
  onSelectCareerForCatalog: (careerName: string) => void;
  onSelectCareerForUni?: (careerName: string) => void;
}

export default function CareerScreen({ careers, onSelectCareerForCatalog, onSelectCareerForUni }: CareerScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("it");
  const [selectedProf, setSelectedProf] = useState<ProfessionItem | null>(
    KAZ_PROFESSION_CATEGORIES[0].subcategories[0].professions[0]
  );
  const [searchQuery, setSearchQuery] = useState("");

  const activeCategoryObj = KAZ_PROFESSION_CATEGORIES.find(c => c.id === selectedCategory);

  const searchResults = searchQuery.trim()
    ? (() => {
        const query = searchQuery.toLowerCase();
        const list: { prof: ProfessionItem; catName: string; subName: string }[] = [];
        KAZ_PROFESSION_CATEGORIES.forEach(cat => {
          cat.subcategories.forEach(sub => {
            sub.professions.forEach(p => {
              if (
                p.name.toLowerCase().includes(query) ||
                p.keywords.some(kw => kw.toLowerCase().includes(query)) ||
                p.bCodes.some(code => code.toLowerCase().includes(query))
              ) {
                list.push({ prof: p, catName: cat.name, subName: sub.name });
              }
            });
          });
        });
        return list;
      })()
    : [];

  const getDemandColor = (demand: string) => {
    if (demand.includes("Очень высокий") || demand.includes("Критически")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (demand.includes("Высокий")) return "bg-blue-100 text-blue-700 border-blue-200";
    if (demand.includes("Растущий")) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">

      <div
        className="bg-[#051F20] rounded-[32px] p-8 md:p-12 text-white shadow-xl relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'linear-gradient(to right, rgba(5,31,32,0.92) 50%, rgba(11,43,38,0.7) 100%), url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop")' }}
      >
        <div className="relative z-10 space-y-2.5 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8EB69B]/20 text-[#8EB69B] text-[10px] font-bold tracking-widest uppercase border border-[#8EB69B]/30 mb-2">
            Интерактивный справочник профессий РК
          </span>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
            Официальный классификатор профессий и специальностей
          </h1>
          <p className="text-[#E2F4E9]/90 text-xs md:text-sm leading-relaxed max-w-2xl">
            Подробно изучите востребованные и престижные направления рынка труда Казахстана. Поймите суть квалификации, перспективы карьеры, реальный уровень зарплат и найдите шифры образовательных программ (B-коды).
          </p>
          <div className="flex gap-4 pt-1 text-[10px] text-[#8EB69B] font-bold">
            <span>🎓 {KAZ_PROFESSION_CATEGORIES.reduce((a, c) => a + c.subcategories.reduce((b, s) => b + s.professions.length, 0), 0)} профессий</span>
            <span>📂 {KAZ_PROFESSION_CATEGORIES.length} сфер деятельности</span>
            <span>🇰🇿 Актуально для рынка РК</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <div className="lg:col-span-5 space-y-4">

          <div className="bg-white p-4 rounded-[20px] border border-[#8EB69B]/20 shadow-sm">
            <span className="text-[10px] font-bold text-[#235347] uppercase tracking-wider block mb-2">Быстрый поиск:</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#235347] text-sm">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию или коду программы..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#E2F4E9]/20 border border-[#8EB69B]/30 rounded-xl text-xs text-[#051F20] font-medium placeholder-slate-400 focus:outline-none focus:border-[#235347]"
              />
            </div>
          </div>

          {!searchQuery.trim() ? (
            <div className="bg-white p-4 rounded-[20px] border border-[#8EB69B]/20 shadow-sm">
              <span className="text-[10px] font-bold text-[#235347] uppercase tracking-wider block mb-3">Выберите сферу образования:</span>
              <div className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
                {KAZ_PROFESSION_CATEGORIES.map(cat => {
                  const isSelected = selectedCategory === cat.id;
                  const totalProfs = cat.subcategories.reduce((a, s) => a + s.professions.length, 0);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        if (cat.subcategories.length > 0 && cat.subcategories[0].professions.length > 0) {
                          setSelectedProf(cat.subcategories[0].professions[0]);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition duration-150 flex items-center justify-between cursor-pointer select-none ${
                        isSelected
                          ? "bg-[#235347] border-[#235347] text-white shadow-sm"
                          : "bg-white border-[#8EB69B]/15 text-[#051F20] hover:border-[#235347] hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-base">{cat.icon}</span>
                        <span className="text-xs font-bold truncate">{cat.name}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${isSelected ? "bg-white/20 text-white" : "bg-[#E2F4E9] text-[#235347]"}`}>
                        {totalProfs}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-[20px] border border-[#8EB69B]/20 shadow-sm">
              <span className="text-[10px] font-bold text-[#235347] uppercase tracking-wider block mb-3">Найдено: {searchResults.length}</span>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {searchResults.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6 font-semibold">Ничего не найдено</p>
                ) : (
                  searchResults.map((item, idx) => {
                    const isSelected = selectedProf?.id === item.prof.id;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedProf(item.prof)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition duration-150 cursor-pointer ${
                          isSelected ? "bg-[#235347] border-[#235347] text-white" : "bg-white border-[#8EB69B]/10 hover:border-[#235347]"
                        }`}
                      >
                        <h5 className="font-bold truncate">💼 {item.prof.name}</h5>
                        <div className="flex items-center justify-between text-[8px] opacity-75 mt-1">
                          <span className="truncate">{item.catName} • {item.subName}</span>
                          <span className="font-mono">{item.prof.bCodes.join(", ")}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {!searchQuery.trim() && activeCategoryObj && (
            <div className="bg-[#E2F4E9]/20 p-4 rounded-[20px] border border-[#8EB69B]/15 space-y-4 max-h-[45vh] overflow-y-auto pr-1">
              <span className="text-[10px] font-bold text-[#235347] uppercase tracking-wider block">Профессии по направлениям:</span>
              {activeCategoryObj.subcategories.map((sub, sIdx) => (
                <div key={sIdx} className="space-y-1.5">
                  <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block">{sub.name}</span>
                  <div className="grid grid-cols-1 gap-1">
                    {sub.professions.map((p, pIdx) => {
                      const isSelected = selectedProf?.id === p.id;
                      return (
                        <button
                          key={pIdx}
                          onClick={() => setSelectedProf(p)}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition duration-150 cursor-pointer font-semibold ${
                            isSelected
                              ? "bg-white border-[#235347] text-[#051F20] shadow-sm"
                              : "bg-white/50 border-slate-200/50 hover:bg-white text-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate">{p.name}</span>
                            <span className="text-[8px] font-mono py-0.5 px-1 bg-[#E2F4E9] text-[#235347] rounded shrink-0">
                              {p.bCodes[0]}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: DETAILED PROFESSION CARD */}
        <div className="lg:col-span-7 bg-white rounded-[24px] border border-[#8EB69B]/20 shadow-sm overflow-hidden">
          {selectedProf ? (
            <div className="animate-fadeIn">

              {/* Header */}
              <div className="bg-gradient-to-r from-[#051F20] to-[#0B2B26] p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl shrink-0">
                      💼
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[#8EB69B] text-[9px] font-bold uppercase tracking-widest block">Карьерная карта специалиста</span>
                      <h2 className="text-lg md:text-xl font-black text-white tracking-tight leading-tight">
                        {selectedProf.name}
                      </h2>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    {selectedProf.bCodes.map(code => (
                      <span key={code} className="px-2.5 py-1 bg-[#8EB69B]/20 text-[#8EB69B] text-[9px] font-mono font-black uppercase rounded-lg border border-[#8EB69B]/30">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key stats row */}
                <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/10">
                  <div>
                    <span className="text-[8px] text-[#8EB69B] font-bold uppercase tracking-wider block mb-0.5">Зарплата в РК</span>
                    <span className="text-xs text-white font-bold">{selectedProf.salary || "Уточняется"}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#8EB69B] font-bold uppercase tracking-wider block mb-0.5">Спрос на рынке</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block ${getDemandColor(selectedProf.demand || "")}`}>
                      {(selectedProf.demand || "Стабильный").split(" — ")[0]}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#8EB69B] font-bold uppercase tracking-wider block mb-0.5">Коды программ</span>
                    <span className="text-xs text-white font-bold">{selectedProf.bCodes.join(", ")}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="font-black text-[#051F20] text-xs uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#E2F4E9] text-[#235347] flex items-center justify-center text-xs">📋</span>
                    Суть и специфика профессии
                  </h4>
                  <p className="text-[#163832] text-sm leading-relaxed bg-[#E2F4E9]/20 p-4 rounded-xl border border-[#8EB69B]/10">
                    {selectedProf.description || `Специальность «${selectedProf.name}» входит в перечень приоритетных направлений подготовки кадров Республики Казахстан.`}
                  </p>
                </div>

                {/* Prospects */}
                {selectedProf.prospects && (
                  <div className="space-y-2">
                    <h4 className="font-black text-[#051F20] text-xs uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#E2F4E9] text-[#235347] flex items-center justify-center text-xs">🚀</span>
                      Карьерные перспективы
                    </h4>
                    <div className="bg-slate-50 rounded-xl border border-[#8EB69B]/10 p-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedProf.prospects.split(" → ").map((step, i, arr) => (
                          <React.Fragment key={i}>
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${i === arr.length - 1 ? "bg-[#235347] text-white border-[#235347]" : "bg-white text-[#051F20] border-[#8EB69B]/20"}`}>
                              {step}
                            </span>
                            {i < arr.length - 1 && <span className="text-[#8EB69B] font-bold self-center">→</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Market demand detail */}
                {selectedProf.demand && (
                  <div className="space-y-2">
                    <h4 className="font-black text-[#051F20] text-xs uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#E2F4E9] text-[#235347] flex items-center justify-center text-xs">📊</span>
                      Востребованность на рынке РК
                    </h4>
                    <div className="border-l-4 border-[#235347] pl-4 py-2 bg-slate-50 rounded-r-xl">
                      <p className="text-xs text-[#051F20] leading-relaxed font-medium">{selectedProf.demand}</p>
                    </div>
                  </div>
                )}

                {/* B-codes */}
                <div className="space-y-2">
                  <h4 className="font-black text-[#051F20] text-xs uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#E2F4E9] text-[#235347] flex items-center justify-center text-xs">🎓</span>
                    Образовательные шифры (B-коды МОН РК)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProf.bCodes.map((code, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-[#8EB69B]/10 flex items-center gap-3">
                        <span className="w-10 h-10 rounded-lg bg-[#235347] text-white flex items-center justify-center text-xs font-black shrink-0">{code}</span>
                        <div>
                          <p className="text-[10px] font-bold text-[#051F20]">Шифр программы</p>
                          <p className="text-[9px] text-slate-500">Даёт право на госгранты МОН РК</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-2 border-t border-[#8EB69B]/10 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectCareerForUni) {
                        onSelectCareerForUni(selectedProf.name);
                      } else {
                        onSelectCareerForCatalog(selectedProf.name);
                      }
                    }}
                    className="flex-grow py-3.5 bg-[#235347] hover:bg-[#0B2B26] transition text-white font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
                  >
                    🔍 Найти ВУЗы Казахстана с этой специальностью
                  </button>
                </div>

              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 space-y-3 p-8">
              <span className="text-3xl block animate-pulse">🧭</span>
              <h4 className="font-bold text-[#051F20] text-sm">Профессия не выбрана</h4>
              <p className="text-xs text-[#163832]/80 max-w-xs">
                Выберите интересующую специальность в списке слева, чтобы ознакомиться с карьерными перспективами и уровнем востребованности.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
