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

  // Filter matching professions based on search
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Visual Top Header */}
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
            Подробно изучите востребованные и престижные направления рынка труда Казахстана. Поймите суть квалификации, найдите шифры образовательных программ (B-коды) и мгновенно перейдите к ВУЗам.
          </p>
        </div>
      </div>

      {/* Main Multi-Level Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPACT NAVIGATION (Categories list + Search) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Search */}
          <div className="bg-white p-5 rounded-[24px] border border-[#8EB69B]/20 shadow-3xs space-y-3">
            <span className="text-[10px] font-bold text-[#235347] uppercase tracking-wider block">Быстрый поиск по реестру:</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#235347]">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию или коду программы..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#E2F4E9]/10 border border-[#8EB69B]/30 rounded-xl text-xs text-[#051F20] font-medium placeholder-slate-400 focus:outline-none focus:border-[#235347]"
              />
            </div>
          </div>

          {!searchQuery.trim() ? (
            /* Left Navigation: Category Tabs */
            <div className="bg-white p-5 rounded-[24px] border border-[#8EB69B]/20 shadow-3xs space-y-3">
              <span className="text-[10px] font-bold text-[#235347] uppercase tracking-wider block">Выберите сферу образования:</span>
              <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
                {KAZ_PROFESSION_CATEGORIES.map(cat => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        if (cat.subcategories.length > 0 && cat.subcategories[0].professions.length > 0) {
                          setSelectedProf(cat.subcategories[0].professions[0]);
                        }
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition duration-150 flex items-center justify-between cursor-pointer select-none ${
                        isSelected 
                          ? "bg-[#235347] border-[#235347] text-white shadow-3xs" 
                          : "bg-white border-[#8EB69B]/15 text-[#051F20] hover:border-[#235347] hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-base">{cat.icon}</span>
                        <span className="text-xs font-bold truncate">{cat.name}</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-80">{isSelected ? "▶" : ""}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Search results list */
            <div className="bg-white p-5 rounded-[24px] border border-[#8EB69B]/20 shadow-3xs space-y-3">
              <span className="text-[10px] font-bold text-[#235347] uppercase tracking-wider block">Найдено соответствий ({searchResults.length}):</span>
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
                        className={`w-full text-left p-3 rounded-lg border text-xs transition duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-[#235347] border-[#235347] text-white"
                            : "bg-white border-[#8EB69B]/10 hover:border-[#235347]"
                        }`}
                      >
                        <h5 className="font-bold truncate">💼 {item.prof.name}</h5>
                        <div className="flex items-center justify-between text-[8px] opacity-75 mt-1">
                          <span className="truncate">{item.catName} • {item.subName}</span>
                          <span className="font-mono">ЕНТ: {item.prof.bCodes.join(", ")}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Subcategories details tree *when no search query is active* */}
          {!searchQuery.trim() && activeCategoryObj && (
            <div className="bg-[#E2F4E9]/15 p-5 rounded-[24px] border border-[#8EB69B]/15 space-y-4 max-h-[40vh] overflow-y-auto pr-1">
              <span className="text-[10px] font-bold text-[#235347] uppercase tracking-wider block">Профессии по направлениям:</span>
              
              {activeCategoryObj.subcategories.map((sub, sIdx) => (
                <div key={sIdx} className="space-y-1.5">
                  <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block">{sub.name}</span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {sub.professions.map((p, pIdx) => {
                      const isSelected = selectedProf?.id === p.id;
                      return (
                        <button
                          key={pIdx}
                          onClick={() => setSelectedProf(p)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition duration-150 cursor-pointer font-bold ${
                            isSelected
                              ? "bg-white border-[#235347] text-[#051F20] shadow-2xs"
                              : "bg-white/40 border-slate-200/50 hover:bg-white text-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2.5">
                            <span className="truncate">💼 {p.name}</span>
                            <span className="text-[8px] font-mono py-0.5 px-1.5 bg-[#E2F4E9] text-[#235347] rounded-md shrink-0">
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

        {/* RIGHT DETAILED PREVIEW OF SELECTED PROFESSION */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[24px] border border-[#8EB69B]/20 shadow-3xs min-h-[50vh]">
          {selectedProf ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header Title with B-codes badging */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#8EB69B]/10 pb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#E2F4E9] text-[#235347] flex items-center justify-center text-lg font-bold shrink-0">
                    💼
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[#235347] text-[10px] font-bold uppercase tracking-wider block">Детализированная карьерная карта</span>
                    <h2 className="text-lg md:text-xl font-bold text-[#051F20] tracking-tight truncate" title={selectedProf.name}>
                      {selectedProf.name}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 shrink-0 self-start sm:self-auto">
                  {selectedProf.bCodes.map(code => (
                    <span key={code} className="px-2.5 py-1 bg-[#235347] text-white text-[9px] font-mono font-black uppercase rounded-lg border border-[#235347]/10" title="Шифр образовательной программы ЕНТ">
                      {code}
                    </span>
                  ))}
                </div>
              </div>

              {/* Essence Section */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#051F20] text-xs uppercase tracking-wider border-b border-[#8EB69B]/10 pb-1.5">
                  Суть и специфика профессии
                </h4>
                <p className="text-[#163832] text-xs leading-relaxed bg-[#E2F4E9]/20 p-4.5 rounded-xl border border-[#8EB69B]/10 font-bold">
                  Подготовка квалифицированного специалиста по направлению «{selectedProf.name}» осуществляется в рамках государственных образовательных стандартов Республики Казахстан. Эта профессия является одной из наиболее наукоемких и востребованных в современных секторах экономики РК, требующей владения широким набором узкопрофильных технических и гуманитарных компетенций.
                </p>
              </div>

              {/* Social Significance Section */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#051F20] text-xs uppercase tracking-wider border-b border-[#8EB69B]/10 pb-1.5">
                  Социальная значимость для Республики Казахстан
                </h4>
                <div className="text-[#051F20] text-xs leading-relaxed border-l-4 border-[#235347] pl-4 italic py-2 bg-slate-50 rounded-r-xl p-4.5">
                  Данная профессия ориентирована на модернизацию национальной инфраструктуры Казахстана и включена в перечень критически важных специалистов программы индустриально-инновационного развития. Позволяет решать государственные задачи в рамках цифровизации, здравоохранения, образования или промышленного сектора страны.
                </div>
              </div>

              {/* Directions & Specialties Section */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#051F20] text-xs uppercase tracking-wider border-b border-[#8EB69B]/10 pb-1.5">
                  Ключевые образовательные шифры классификатора
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProf.bCodes.map((code, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-[#8EB69B]/10 space-y-1">
                      <h5 className="font-black text-[#051F20] text-xs">🎓 Код программы: {code}</h5>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Официальный шифр группы образовательных программ МОН РК. Дает право на распределение государственных образовательных грантов в ВУЗах РК.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action redirect to catalog */}
              <div className="pt-6 border-t border-[#8EB69B]/10 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectCareerForUni) {
                      onSelectCareerForUni(selectedProf.name);
                    } else {
                      onSelectCareerForCatalog(selectedProf.name);
                    }
                  }}
                  className="flex-grow py-3.5 bg-[#235347] hover:bg-[#0B2B26] transition text-white font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-[0.99]"
                >
                  🔍 Показать все ВУЗы Казахстана с этой профессией
                </button>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 space-y-3">
              <span className="text-3xl block animate-pulse">🧭</span>
              <h4 className="font-bold text-[#051F20] text-sm">Сфера специализации не выбрана</h4>
              <p className="text-xs text-[#163832]/80 max-w-xs">
                Выберите интересующую квалификацию в списке слева, чтобы ознакомиться с подробностями востребованности на рынке РК.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
