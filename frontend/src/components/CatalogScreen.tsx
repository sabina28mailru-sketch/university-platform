import React, { useState, useMemo } from "react";
import { University } from "../types";
import { KAZ_PROFESSION_CATEGORIES, getAvailableProfessionsForUniversity } from "../utils/professionData";

interface CatalogScreenProps {
  universities: University[];
  onRefresh: () => void;
}

const getUniversityFallbackImage = (uniId: string, name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes("айти") || lower.includes("iitu") || lower.includes("информационных")) {
    return "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800";
  }
  if (lower.includes("медицин") || lower.includes("асфендияров")) {
    return "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800";
  }
  if (lower.includes("аль-фараби") || lower.includes("казну") || lower.includes("национальный")) {
    return "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800";
  }
  if (lower.includes("enu") || lower.includes("гумилев") || lower.includes("евразийский")) {
    return "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800";
  }
  if (lower.includes("назарбаев") || lower.includes("nu")) {
    return "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?auto=format&fit=crop&q=80&w=800";
  }
  if (lower.includes("технический") || lower.includes("сатпаев") || lower.includes("кбту")) {
    return "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800";
  }
  const fallbacks = [
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
  ];
  const charCodeSum = Array.from(uniId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return fallbacks[charCodeSum % fallbacks.length];
};

export default function CatalogScreen({ universities, onRefresh }: CatalogScreenProps) {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [studentType, setStudentType] = useState<"school" | "college">("school");
  const [minEntScore, setMinEntScore] = useState<number>(0);
  const [maxBudget, setMaxBudget] = useState<number>(5000000);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [onlyWithHostel, setOnlyWithHostel] = useState(false);
  const [onlyWithGrants, setOnlyWithGrants] = useState(false);
  const [onlyWithQuotas, setOnlyWithQuotas] = useState(false);

  // Standalone full results page toggle
  const [showAllResults, setShowAllResults] = useState(false);

  // Modal active university state
  const [activeUni, setActiveUni] = useState<University | null>(null);

  // Toggle languages filters
  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStudentType("school");
    setMinEntScore(0);
    setMaxBudget(5000000);
    setSelectedLanguages([]);
    setOnlyWithHostel(false);
    setOnlyWithGrants(false);
    setOnlyWithQuotas(false);
    setShowAllResults(false);
  };

  // Apply filtering logic
  const filteredUniversities = useMemo(() => {
    return universities.filter(uni => {
      // 1. Search Query Match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = uni.name.toLowerCase().includes(query);
        const matchesAddress = uni.address.toLowerCase().includes(query);
        const matchesSpecialty = uni.faculties?.some(fac => 
          fac.name.toLowerCase().includes(query) || 
          fac.specialties?.some(sp => sp.name.toLowerCase().includes(query) || sp.code.toLowerCase().includes(query))
        );
        if (!matchesName && !matchesAddress && !matchesSpecialty) {
          return false;
        }
      }

      // 2. Student Type and ENT Score Match
      const userEntScore = minEntScore;
      const targetMin = studentType === "school" ? uni.entMinSchool : uni.entMinCollege;
      if (userEntScore < targetMin) {
        return false;
      }

      // 3. Tuition Budget Match — учитываем стоимость после колледжа
      const collegeMinFee = (() => {
        const fees = uni.faculties?.flatMap(f =>
          (f.specialties || []).filter(sp => sp.collegeTransferFee).map(sp => sp.collegeTransferFee as number)
        ) || [];
        return fees.length > 0 ? Math.min(...fees) : null;
      })();
      const effectiveFee = (studentType === "college" && collegeMinFee !== null)
        ? collegeMinFee
        : uni.tuitionFee;

      if (maxBudget < 900000) {
        if (!uni.hasGrants) return false;
      } else if (effectiveFee > maxBudget) {
        if (!uni.hasGrants) return false;
      }

      // 4. Languages Match
      if (selectedLanguages.length > 0) {
        const hasMatchingLang = selectedLanguages.some(lang => uni.languages.includes(lang));
        if (!hasMatchingLang) {
          return false;
        }
      }

      // 5. Hostel Match
      if (onlyWithHostel && !uni.hasHostel) {
        return false;
      }

      // 6. Grants Match
      if (onlyWithGrants && !uni.hasGrants) {
        return false;
      }

      // 7. Quotas Match
      if (onlyWithQuotas && !uni.hasQuotas) {
        return false;
      }

      return true;
    });
  }, [universities, searchQuery, studentType, minEntScore, maxBudget, selectedLanguages, onlyWithHostel, onlyWithGrants, onlyWithQuotas]);

  const remainingCount = filteredUniversities.length - 3;
  const displayedUniversities = showAllResults ? filteredUniversities : filteredUniversities.slice(0, 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {showAllResults ? (
        /* STANDALONE OUTPUT GRID PAGE */
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#8EB69B]/15 pb-5">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setShowAllResults(false)}
                className="px-4 py-2 bg-[#E2F4E9] hover:bg-[#8EB69B]/30 text-[#051F20] font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all mb-2"
              >
                ← Вернуться в режим фильтрации
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-[#051F20] tracking-tight">
                Результаты поиска и выдача ВУЗов
              </h1>
              <p className="text-[#163832] text-xs">
                По выбранным критериям подбора найдено <strong className="text-[#235347] font-bold">{filteredUniversities.length}</strong> университета(ов).
              </p>
            </div>
            
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-[#E2F4E9]/50 border border-[#8EB69B]/20 hover:bg-[#8EB69B]/20 transition text-[#051F20] font-bold rounded-xl text-xs cursor-pointer select-none"
            >
              Обновить реестр
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUniversities.map((uni) => {
              const coverImg = uni.imageUrl || getUniversityFallbackImage(uni.id, uni.name);
              return (
                <div
                  key={uni.id}
                  className="bg-white border border-[#8EB69B]/10 rounded-[20px] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Clickable image */}
                  <div
                    className="h-44 w-full overflow-hidden relative flex-shrink-0 cursor-pointer group"
                    onClick={() => setActiveUni(uni)}
                  >
                    <img
                      src={coverImg}
                      alt={uni.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => { const el = e.currentTarget as HTMLImageElement; if (!el.src.includes('unsplash.com')) { el.src = getUniversityFallbackImage(uni.id, uni.name); } }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#051F20]/75 via-[#051F20]/10 to-transparent pointer-events-none" />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#235347]/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-lg">
                        <span className="text-[#235347] text-xs font-bold">Открыть профиль →</span>
                      </div>
                    </div>
                    {/* ID badge */}
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-white bg-[#235347]/85 backdrop-blur-sm px-2 py-0.5 rounded-lg shadow-sm">
                        {uni.id.toUpperCase()}
                      </span>
                    </div>
                    {/* Price badge */}
                    <div className="absolute top-3 right-3 bg-white/92 backdrop-blur-sm px-2.5 py-1.5 rounded-xl border border-white/60 shadow-lg pointer-events-none">
                      <span className="text-[8px] text-slate-400 block leading-none text-right">от</span>
                      <strong className="text-xs text-[#235347] font-black block leading-tight text-right">{(uni.tuitionFee / 1000000).toFixed(1)} млн ₸</strong>
                    </div>
                    {/* Name overlay on image bottom */}
                    <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                      <h3 className="text-white font-bold text-xs leading-snug line-clamp-2 drop-shadow-md">{uni.name}</h3>
                      <p className="text-white/65 text-[9px] mt-0.5 truncate">📍 {uni.address}</p>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    {uni.description && (
                      <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{uni.description}</p>
                    )}

                    <div className="flex flex-wrap gap-1 text-[9px] font-bold">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg">
                        ЕНТ {studentType === "school" ? uni.entMinSchool : uni.entMinCollege}+
                      </span>
                      {uni.hasHostel && (
                        <span className="px-2 py-0.5 bg-[#E2F4E9] text-[#235347] border border-[#8EB69B]/20 rounded-lg">Общежитие</span>
                      )}
                      {uni.hasGrants && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg">Грант</span>
                      )}
                      {uni.hasQuotas && (
                        <span className="px-2 py-0.5 bg-violet-50 text-violet-700 border border-violet-100 rounded-lg">Квота</span>
                      )}
                    </div>

                    {(() => {
                      const available = getAvailableProfessionsForUniversity(uni);
                      if (available.length === 0) return null;
                      return (
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-[#235347] uppercase tracking-wider block">
                            Профессии ({available.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {available.slice(0, 3).map((ap, apIdx) => (
                              <span key={apIdx} className="px-1.5 py-0.5 bg-slate-50 text-slate-700 border border-slate-200/60 rounded-md text-[9px] font-semibold flex items-center gap-1">
                                <span className="text-[8px] text-[#235347] font-mono font-black">{ap.bCode}</span>
                                <span className="truncate max-w-[100px]">{ap.professionName}</span>
                              </span>
                            ))}
                            {available.length > 3 && (
                              <span className="px-1.5 py-0.5 bg-[#E2F4E9]/50 text-[#235347] border border-[#8EB69B]/20 rounded-md text-[9px] font-black">+{available.length - 3}</span>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                      <span className="text-[9px] font-semibold text-slate-400">
                        {uni.languages.map(l => l.toUpperCase()).join(" · ")}
                      </span>
                      <button
                        onClick={() => setActiveUni(uni)}
                        className="px-3 py-1.5 bg-[#235347] hover:bg-[#0B2B26] transition text-white rounded-xl text-[10px] font-bold"
                      >
                        Детали →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* STANDARD DUAL FILTERS + LIMITED INITIAL LIST LAYOUT */
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#051F20] tracking-tight">Каталог ВУЗов Казахстана</h1>
              <p className="text-[#163832]/80 text-xs md:text-sm">Используйте расширенную систему умного подбора по вступительным баллам ЕНТ, бюджету и квотам.</p>
            </div>
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-[#E2F4E9]/50 border border-[#8EB69B]/20 hover:bg-[#8EB69B]/20 transition text-[#051F20] font-bold rounded-xl text-xs cursor-pointer select-none"
            >
              Обновить реестр
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* FILTERS PANEL CODES */}
            <div className="lg:col-span-4 bg-white p-6 rounded-[24px] border border-[#8EB69B]/20 space-y-5 shadow-3xs">
              <div className="flex items-center justify-between border-b border-[#8EB69B]/10 pb-3">
                <h4 className="font-bold text-[#051F20] text-xs uppercase tracking-wider">
                  Параметры подбора
                </h4>
                <button 
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-red-700 hover:text-red-900 transition cursor-pointer"
                >
                  Сбросить все
                </button>
              </div>

              {/* Search box */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#051F20] block">Ключевые слова</label>
                <input
                  type="text"
                  placeholder="Например: КБТУ, IT, B057..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:outline-none focus:border-[#235347] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#051F20] transition"
                />
              </div>

              {/* Applicant categories */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#051F20] block">Образование абитуриента</label>
                <div className="flex gap-2 p-1 bg-[#E2F4E9]/50 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setStudentType("school")}
                    className={`w-1/2 py-2 text-xs font-bold rounded-lg transition cursor-pointer select-none ${studentType === "school" ? "bg-white text-[#235347] shadow-3xs" : "text-[#163832]/70 hover:text-[#051F20]"}`}
                  >
                    После школы
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentType("college")}
                    className={`w-1/2 py-2 text-xs font-bold rounded-lg transition cursor-pointer select-none ${studentType === "college" ? "bg-white text-[#235347] shadow-3xs" : "text-[#163832]/70 hover:text-[#051F20]"}`}
                  >
                    После колледжа
                  </button>
                </div>
              </div>

              {/* ENT score slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#051F20]">
                  <span>Мои баллы ЕНТ{studentType === "college" ? " (после колледжа)" : ""}:</span>
                  <span className="text-[#235347] font-extrabold">
                    {minEntScore === 0 ? "Любой балл" : `${minEntScore} из 140`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="140"
                  step="1"
                  value={minEntScore}
                  onChange={(e) => setMinEntScore(Number(e.target.value))}
                  className="w-full accent-[#235347] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>0</span>
                  <span className="text-slate-300">Показываем ВУЗы с порогом ≤ {minEntScore === 0 ? "любым" : minEntScore}</span>
                  <span>140</span>
                </div>
              </div>

              {/* Tuition slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#051F20]">
                  <span>Бюджет{studentType === "college" ? " (после колл.)" : "/год"}:</span>
                  <span className="text-[#235347] font-extrabold">
                    {maxBudget < 900000 ? "Только грант" : (maxBudget >= 5000000 ? "Без ограничений" : `до ${maxBudget.toLocaleString()} ₸`)}
                  </span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="5000000"
                  step="50000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-[#235347] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>Грант</span>
                  <span>5 млн ₸</span>
                </div>
              </div>

              {/* Languages selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#051F20] block">Язык обучения</label>
                <div className="flex gap-1.5">
                  {[
                    { key: "kaz", label: "Казахский" },
                    { key: "rus", label: "Русский" },
                    { key: "eng", label: "English" }
                  ].map(lang => (
                    <button
                      key={lang.key}
                      type="button"
                      onClick={() => toggleLanguage(lang.key)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${selectedLanguages.includes(lang.key) ? "bg-[#235347] border-[#235347] text-white" : "bg-white border-[#8EB69B]/20 text-[#051F20]"}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Binary check filters */}
              <div className="space-y-2 pt-2 border-t border-[#8EB69B]/10">
                <label className="flex items-center gap-2 text-xs font-bold text-[#163832] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyWithHostel}
                    onChange={(e) => setOnlyWithHostel(e.target.checked)}
                    className="accent-[#235347] w-4 h-4 rounded"
                  />
                  <span>Наличие общежития</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-[#163832] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyWithGrants}
                    onChange={(e) => setOnlyWithGrants(e.target.checked)}
                    className="accent-[#235347] w-4 h-4 rounded"
                  />
                  <span>Государственные гранты</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-[#163832] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyWithQuotas}
                    onChange={(e) => setOnlyWithQuotas(e.target.checked)}
                    className="accent-[#235347] w-4 h-4 rounded"
                  />
                  <span>Сельские и льготные квоты</span>
                </label>
              </div>

            </div>

            {/* LIST OF UNIVERSITIES SECTION */}
            <div className="lg:col-span-8 flex flex-col h-full justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#163832]/80 px-2">
                  <span>Найдено университетов: <strong className="text-[#235347] font-bold text-sm">{filteredUniversities.length}</strong></span>
                </div>

                {filteredUniversities.length === 0 ? (
                  <div className="bg-white border border-[#8EB69B]/20 rounded-[28px] p-12 text-center space-y-3 shadow-3xs max-w-lg mx-auto">
                    <h4 className="font-bold text-[#051F20]">Совпадений не найдено</h4>
                    <p className="text-xs text-[#163832] leading-relaxed mx-auto">Попробуйте понизить порог баллов ЕНТ, увеличить планируемый годовой бюджет или полностью сбросить фильтры.</p>
                    <button 
                      onClick={handleResetFilters}
                      className="px-5 py-2.5 bg-[#235347] hover:bg-[#0B2B26] transition text-white text-xs font-bold rounded-xl cursor-pointer uppercase tracking-wider mt-2"
                    >
                      Сбросить поиск
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {displayedUniversities.map((uni) => {
                      const coverImg = uni.imageUrl || getUniversityFallbackImage(uni.id, uni.name);
                      return (
                        <div
                          key={uni.id}
                          className="bg-white border border-[#8EB69B]/10 rounded-[22px] overflow-hidden hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row"
                        >
                          {/* Clickable image */}
                          <div
                            className="h-48 sm:h-auto sm:w-64 overflow-hidden relative flex-shrink-0 cursor-pointer group"
                            onClick={() => setActiveUni(uni)}
                          >
                            <img
                              src={coverImg}
                              alt={uni.name}
                              referrerPolicy="no-referrer"
                              onError={(e) => { const el = e.currentTarget as HTMLImageElement; if (!el.src.includes('unsplash.com')) { el.src = getUniversityFallbackImage(uni.id, uni.name); } }}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#051F20]/65 via-[#051F20]/15 to-transparent pointer-events-none sm:bg-gradient-to-r sm:from-transparent sm:to-transparent" />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-[#235347]/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/50">
                                <span className="text-[#235347] text-xs font-bold">Открыть профиль</span>
                              </div>
                            </div>
                            {/* ID badge */}
                            <div className="absolute top-3 left-3 pointer-events-none">
                              <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-white bg-[#235347]/85 backdrop-blur-sm px-2 py-0.5 rounded-lg shadow-sm">
                                {uni.id.toUpperCase()}
                              </span>
                            </div>
                            {/* Mobile price badge */}
                            <div className="absolute bottom-3 right-3 sm:hidden bg-white/92 backdrop-blur-sm px-2.5 py-1.5 rounded-xl border border-white/60 shadow-lg pointer-events-none">
                              <span className="text-[8px] text-slate-400 block leading-none">от</span>
                              <strong className="text-xs text-[#235347] font-black block">{(uni.tuitionFee / 1000000).toFixed(1)} млн ₸</strong>
                            </div>
                          </div>

                          {/* Content panel */}
                          <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-3">
                                <h3 className="text-sm font-bold text-[#051F20] leading-snug line-clamp-2 flex-1" title={uni.name}>
                                  {uni.name}
                                </h3>
                                {/* Desktop price */}
                                <div className="hidden sm:block text-right flex-shrink-0 bg-[#E2F4E9]/50 px-3 py-1.5 rounded-xl border border-[#8EB69B]/15">
                                  <span className="text-[8px] text-slate-400 block leading-none">от</span>
                                  <strong className="text-sm text-[#235347] font-black block leading-tight">{uni.tuitionFee?.toLocaleString()} ₸</strong>
                                  <span className="text-[8px] text-slate-400 block leading-none">в год</span>
                                </div>
                              </div>
                              <p className="text-[#163832]/60 text-[10px]">📍 {uni.address}</p>
                              {uni.description && (
                                <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{uni.description}</p>
                              )}
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-1.5 text-[9px] font-bold">
                              <span className="px-2 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg">
                                ЕНТ {studentType === "school" ? uni.entMinSchool : uni.entMinCollege}+ б.
                              </span>
                              {uni.hasHostel && (
                                <span className="px-2 py-1 bg-[#E2F4E9] text-[#235347] border border-[#8EB69B]/20 rounded-lg">Общежитие</span>
                              )}
                              {uni.hasGrants && (
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg">Гос. гранты</span>
                              )}
                              {uni.hasQuotas && (
                                <span className="px-2 py-1 bg-violet-50 text-violet-700 border border-violet-100 rounded-lg">Квоты</span>
                              )}
                              <span className="px-2 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg">
                                {uni.languages.map(l => l.toUpperCase()).join(" · ")}
                              </span>
                            </div>

                            {/* Professions */}
                            {(() => {
                              const available = getAvailableProfessionsForUniversity(uni);
                              if (available.length === 0) return null;
                              return (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-bold text-[#235347] uppercase tracking-wider block">
                                    Профессии в ВУЗе ({available.length}):
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {available.slice(0, 5).map((ap, apIdx) => (
                                      <span
                                        key={apIdx}
                                        className="px-2 py-0.5 bg-slate-50 text-slate-700 border border-slate-200/60 rounded-md text-[9px] font-semibold flex items-center gap-1"
                                        title={`${ap.professionName} (${ap.subcategory})`}
                                      >
                                        <span className="text-[8px] text-[#235347] font-mono font-black">{ap.bCode}</span>
                                        <span className="truncate max-w-[130px]">{ap.professionName}</span>
                                      </span>
                                    ))}
                                    {available.length > 5 && (
                                      <span className="px-1.5 py-0.5 bg-[#E2F4E9]/50 text-[#235347] border border-[#8EB69B]/20 rounded-md text-[9px] font-black">
                                        + {available.length - 5}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Footer */}
                            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                              <button
                                onClick={() => setActiveUni(uni)}
                                className="px-5 py-2 bg-[#235347] hover:bg-[#0B2B26] transition text-white rounded-xl text-[10px] font-bold uppercase tracking-wide"
                              >
                                Программы →
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* DYNAMIC EXPANSION AND COUNTERS TRIGGER BUTTON */}
              {remainingCount > 0 && (
                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowAllResults(true)}
                    className="w-full py-3.5 bg-[#235347] hover:bg-[#0B2B26] transition duration-155 text-white font-bold rounded-2xl text-[11px] uppercase tracking-widest shadow-md flex items-center justify-center cursor-pointer"
                  >
                    Посмотреть все результаты (+ {remainingCount})
                  </button>
                </div>
              )}

            </div>

          </div>
        </>
      )}

      {/* DETAIL MODAL FOR FACULTIES & SPECIALTIES */}
      {activeUni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay bg-[#051F20]/75 backdrop-blur-md">
          <div className="bg-white rounded-[32px] shadow-2xl border border-[#8EB69B]/20 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#051F20] text-white p-6 md:p-8 flex items-start justify-between relative flex-shrink-0 border-b border-[#163832]/40">
              <div className="space-y-1.5 pr-8">
                <span className="text-[#8EB69B] font-bold text-[10px] uppercase tracking-wider block">
                  Академический паспорт ВУЗа
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white leading-tight">{activeUni.name}</h3>
                <p className="text-[#8EB69B]/85 text-xs">
                  📍 {activeUni.address}
                </p>
              </div>
              <button 
                onClick={() => setActiveUni(null)}
                className="text-[#8EB69B] hover:text-white transition text-sm font-bold cursor-pointer bg-[#163832] w-8 h-8 rounded-full flex items-center justify-center border border-[#8EB69B]/25"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Container with Split Columns */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-0">
              
              {/* Left Column: Image, quick parameters and contact actions */}
              <div className="w-full md:w-80 bg-[#E2F4E9]/30 border-b md:border-b-0 md:border-r border-[#8EB69B]/10 flex flex-col p-6 space-y-4 overflow-y-auto flex-shrink-0">
                <div className="relative rounded-2xl overflow-hidden shadow-3xs h-40 md:h-48 flex-shrink-0 bg-neutral-100 border border-[#8EB69B]/20">
                  <img
                    src={activeUni.imageUrl || getUniversityFallbackImage(activeUni.id, activeUni.name)}
                    alt={activeUni.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => { const el = e.currentTarget as HTMLImageElement; if (!el.src.includes('unsplash.com')) { el.src = getUniversityFallbackImage(activeUni.id, activeUni.name); } }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                </div>

                {/* Quick Details Boxes */}
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-2xl border border-[#8EB69B]/15 shadow-3xs">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                      Приемная комиссия
                    </span>
                    <p className="text-[#051F20] text-xs font-semibold leading-relaxed mt-1">{activeUni.contacts}</p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#8EB69B]/15 shadow-3xs">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                      Сроки подачи документов
                    </span>
                    <p className="text-[#051F20] text-xs font-semibold leading-relaxed mt-1">{activeUni.deadlines}</p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#8EB69B]/15 shadow-3xs">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                      Стоимость за академ. год
                    </span>
                    <strong className="text-base text-[#235347] font-black block leading-tight mt-1">
                      {activeUni.tuitionFee?.toLocaleString()} ₸ <span className="text-[10px] text-slate-500 font-normal">/ год</span>
                    </strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Scrollable text area (Description, Accommodation, Badges, Faculties) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* University Presentation Description */}
                {activeUni.description && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#051F20] text-xs uppercase tracking-wider border-b border-[#8EB69B]/10 pb-2">
                      Презентация и Описание ВУЗа
                    </h4>
                    <p className="text-[#051F20] text-xs leading-relaxed bg-[#E2F4E9]/20 p-5 rounded-2xl border border-[#8EB69B]/10 font-bold">
                      {activeUni.description}
                    </p>
                  </div>
                )}
                
                {/* Accommodation Conditions */}
                <div className="space-y-2">
                  <h4 className="font-bold text-[#051F20] text-xs uppercase tracking-wider border-b border-[#8EB69B]/10 pb-2">
                    Общежития и Условия Проживания
                  </h4>
                  <p className="text-[#163832] text-xs bg-slate-50 p-4 rounded-2xl border border-[#8EB69B]/10">
                    {activeUni.hostelDetails || "Информация о наличии свободных койко-мест подлежит сверке в приемной комиссии непосредственно перед подачей оригиналов ЕНТ."}
                  </p>
                </div>

                {/* Languages, Grants & Quotas summary table */}
                <div className="space-y-2">
                  <h4 className="font-bold text-[#051F20] text-xs uppercase tracking-wider border-b border-[#8EB69B]/10 pb-2">
                    Льготы, квоты и язык обучения
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3.5 rounded-xl text-center border border-[#8EB69B]/15">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Язык</span>
                      <strong className="text-[#051F20] text-xs font-bold uppercase mt-1 block">{activeUni.languages.join(", ")}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl text-center border border-[#8EB69B]/15">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Гос. Гранты</span>
                      <strong className="text-[#051F20] text-xs font-bold mt-1 block">{activeUni.hasGrants ? "Имеются" : "Нет"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl text-center border border-[#8EB69B]/15">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Квотные места</span>
                      <strong className="text-[#051F20] text-xs font-bold mt-1 block">{activeUni.hasQuotas ? "Имеются" : "Нет"}</strong>
                    </div>
                  </div>
                </div>

                {/* Matched Careers Profile */}
                {(() => {
                  const available = getAvailableProfessionsForUniversity(activeUni);
                  if (available.length === 0) return null;
                  return (
                    <div className="space-y-3">
                      <h4 className="font-bold text-[#051F20] text-xs uppercase tracking-wider border-b border-[#8EB69B]/10 pb-2">
                        Профессиональные квалификации и карьеры выпускника
                      </h4>
                      <p className="text-[#163832] text-[11px] leading-relaxed">
                        На основе аккредитованных образовательных программ и шифров ЕНТ данного вуза, выпускники квалифицируются под следующие востребованные профессии Казахстана:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                        {available.map((ap, apIdx) => (
                          <div key={apIdx} className="bg-slate-50 border border-slate-200/50 p-3 rounded-xl flex items-start gap-2.5">
                            <span className="text-[10px] bg-[#E2F4E9] text-[#235347] font-mono px-2 py-0.5 rounded-md font-extrabold border border-[#8EB69B]/10 shrink-0">
                              {ap.bCode}
                            </span>
                            <div className="space-y-0.5 min-w-0">
                              <h5 className="font-bold text-[#051F20] text-xs truncate">{ap.professionName}</h5>
                              <p className="text-[9px] text-[#235347] font-semibold truncate">Программа: {ap.specialtyName}</p>
                              <p className="text-[8px] text-slate-400 font-semibold">{ap.category} • {ap.subcategory}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Faculties & Programs List */}
                <div className="space-y-4">
                  <h4 className="font-bold text-[#051F20] text-xs uppercase tracking-wider border-b border-[#8EB69B]/10 pb-2">
                    Учебные программы и аккредитованные специальности
                  </h4>

                  {(!activeUni.faculties || activeUni.faculties.length === 0) ? (
                    <p className="text-slate-400 text-xs text-center py-4">Сведения о наборе специальностей обновляются в реестре.</p>
                  ) : (
                    <div className="space-y-4">
                      {activeUni.faculties.map((fac, idx) => (
                        <div key={idx} className="border border-[#8EB69B]/10 rounded-2xl overflow-hidden shadow-3xs">
                          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                            <h5 className="font-bold text-[#051F20] text-xs">{fac.name}</h5>
                            <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{fac.description}</p>
                          </div>
                          <div className="p-4 divide-y divide-slate-100">
                            {fac.specialties?.map((sp, sIdx) => (
                              <div key={sIdx} className="py-3 first:pt-0 last:pb-0 space-y-2">
                                <div className="flex items-center flex-wrap gap-2">
                                  <span className="bg-[#E2F4E9] text-[#235347] text-[10px] px-2 py-0.5 rounded-md font-extrabold border border-[#8EB69B]/20 shrink-0">{sp.code}</span>
                                  <h6 className="text-[11px] font-bold text-[#051F20] flex-1">{sp.name}</h6>
                                  {sp.hasGrant && (
                                    <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md font-bold shrink-0">
                                      Грант{sp.grantPlaces ? ` (${sp.grantPlaces} мест)` : ""}
                                    </span>
                                  )}
                                </div>
                                {(sp.tuitionFee || sp.collegeTransferFee || sp.entMinScore || sp.duration) && (
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 pl-1">
                                    {sp.tuitionFee && (
                                      <div className="bg-amber-50 border border-amber-100 rounded-lg p-2 text-center">
                                        <span className="text-[8px] text-amber-600 block font-bold uppercase leading-none">Стоимость/год</span>
                                        <strong className="text-[10px] text-amber-800 block leading-tight mt-0.5">{sp.tuitionFee.toLocaleString()} ₸</strong>
                                      </div>
                                    )}
                                    {sp.collegeTransferFee && (
                                      <div className="bg-[#E2F4E9]/60 border border-[#8EB69B]/20 rounded-lg p-2 text-center">
                                        <span className="text-[8px] text-[#235347] block font-bold uppercase leading-none">После колледжа</span>
                                        <strong className="text-[10px] text-[#235347] block leading-tight mt-0.5">{sp.collegeTransferFee.toLocaleString()} ₸</strong>
                                      </div>
                                    )}
                                    {sp.entMinScore && (
                                      <div className="bg-orange-50 border border-orange-100 rounded-lg p-2 text-center">
                                        <span className="text-[8px] text-orange-600 block font-bold uppercase leading-none">Мин. ЕНТ</span>
                                        <strong className="text-[10px] text-orange-800 block leading-tight mt-0.5">{sp.entMinScore} баллов</strong>
                                      </div>
                                    )}
                                    {sp.duration && (
                                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                                        <span className="text-[8px] text-slate-500 block font-bold uppercase leading-none">Срок</span>
                                        <strong className="text-[10px] text-slate-700 block leading-tight mt-0.5">{sp.duration}</strong>
                                      </div>
                                    )}
                                  </div>
                                )}
                                <p className="text-[10px] text-slate-500 leading-relaxed pl-1">{sp.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex justify-end flex-shrink-0">
              <button 
                onClick={() => setActiveUni(null)}
                className="px-5 py-2.5 bg-[#051F20] hover:bg-[#0B2B26] transition text-white text-xs font-bold rounded-xl cursor-pointer uppercase tracking-wider"
              >
                Закрыть паспорт
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
