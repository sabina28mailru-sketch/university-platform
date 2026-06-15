import React, { useState, useMemo } from "react";
import { University, CareerProfession } from "../types";
import { KAZ_PROFESSION_CATEGORIES, getAvailableProfessionsForUniversity } from "../utils/professionData";

interface UniversitiesSectionProps {
  universities: University[];
  onRefresh: () => void;
  selectedProfession: string;
  setSelectedProfession: (prof: string) => void;
  careers: CareerProfession[];
}

// Full array of key cities present in the database
const CITIES_LIST = [
  "Алматы",
  "Астана",
  "Шымкент",
  "Караганда",
  "Актобе",
  "Атырау",
  "Актау",
  "Уральск",
  "Кызылорда",
  "Тараз",
  "Костанай",
  "Кокшетау",
  "Петропавловск",
  "Павлодар",
  "Семей",
  "Усть-Каменогорск",
  "Туркестан",
  "Талдыкорган"
];

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
  // Fallbacks list
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

export default function UniversitiesSection({ 
  universities, 
  onRefresh, 
  selectedProfession, 
  setSelectedProfession, 
  careers 
}: UniversitiesSectionProps) {
  // Collapsible toggle states
  const [isCitiesListCollapsed, setIsCitiesListCollapsed] = useState(true);
  const [isProfessionsCollapsed, setIsProfessionsCollapsed] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("it");
  const [professionSearchQuery, setProfessionSearchQuery] = useState("");

  const allFilteredProfessions = useMemo(() => {
    // 1. Extract all unique specialties from all universities
    const specialtySet = new Set<string>();
    universities.forEach(uni => {
      uni.faculties?.forEach(fac => {
        fac.specialties?.forEach(sp => {
          if (sp.name) {
            specialtySet.add(sp.name.trim());
          }
        });
      });
    });
    
    const academicItems = Array.from(specialtySet).map(name => ({
      name,
      type: "specialty" as const
    }));

    // 2. Base careers from careers catalog
    const careerItems = careers.map(c => ({
      name: c.name,
      type: "career" as const
    }));

    // Combine them
    const combined = [...careerItems, ...academicItems];

    // Filter by search query
    if (!professionSearchQuery.trim()) {
      return combined;
    }
    const query = professionSearchQuery.toLowerCase();
    return combined.filter(item => item.name.toLowerCase().includes(query));
  }, [universities, careers, professionSearchQuery]);

  // Location mode: "all" | "single" | "multiple"
  const [locationMode, setLocationMode] = useState<"all" | "single" | "multiple">("all");
  
  // Single city selected state
  const [selectedSingleCity, setSelectedSingleCity] = useState<string>("Алматы");
  
  // Multiple cities selected state
  const [selectedMultipleCities, setSelectedMultipleCities] = useState<string[]>(["Алматы", "Астана"]);

  // Details Modal state
  const [activeUni, setActiveUni] = useState<University | null>(null);

  // Helper function to extract city from university address
  const getCityFromAddress = (address: string): string => {
    if (!address) return "Другой";
    const normalized = address.toLowerCase();
    if (normalized.includes("алматы")) return "Алматы";
    if (normalized.includes("астана")) return "Астана";
    if (normalized.includes("шымкент")) return "Шымкент";
    if (normalized.includes("караганда")) return "Караганда";
    if (normalized.includes("актобе")) return "Актобе";
    if (normalized.includes("атырау")) return "Атырау";
    if (normalized.includes("актау")) return "Актау";
    if (normalized.includes("уральск")) return "Уральск";
    if (normalized.includes("кызылорда")) return "Кызылорда";
    if (normalized.includes("тараз")) return "Тараз";
    if (normalized.includes("костанай")) return "Костанай";
    if (normalized.includes("кокшетау")) return "Кокшетау";
    if (normalized.includes("петропавловск")) return "Петропавловск";
    if (normalized.includes("павлодар")) return "Павлодар";
    if (normalized.includes("семей")) return "Семей";
    if (normalized.includes("усть-каменогорск") || normalized.includes("усть-каменогрск")) return "Усть-Каменогорск";
    if (normalized.includes("туркестан")) return "Туркестан";
    if (normalized.includes("талдыкорган")) return "Талдыкорган";
    
    const match = address.match(/г\.\s*([А-Яа-яA-Za-z-]+)/);
    if (match && match[1]) {
      return match[1];
    }
    return "Другой";
  };

  // Switch location mode handlers
  const handleSetAllCities = () => {
    setLocationMode("all");
  };

  const handleSetSingleMode = (city: string) => {
    setLocationMode("single");
    setSelectedSingleCity(city);
  };

  const handleToggleMultipleCity = (city: string) => {
    if (selectedMultipleCities.includes(city)) {
      if (selectedMultipleCities.length > 1) {
        setSelectedMultipleCities(selectedMultipleCities.filter(c => c !== city));
      }
    } else {
      setSelectedMultipleCities([...selectedMultipleCities, city]);
    }
  };

// Helper to extract keywords for professions to map to academic specialties
const getProfessionKeywords = (profName: string): string[] => {
  const norm = profName.toLowerCase();
  if (norm.includes("программист") || norm.includes("software") || norm.includes("разработчик") || norm.includes("it")) {
    return ["информацион", "программ", "it", "компьютер", "кибербезопасность", "систем", "разработк"];
  }
  if (norm.includes("врач") || norm.includes("медицин") || norm.includes("хирург")) {
    return ["медицин", "фармаци", "стоматолог", "хирург", "клиническ", "врач", "здравоохр"];
  }
  if (norm.includes("педагог") || norm.includes("учитель") || norm.includes("преподаватель")) {
    return ["педагог", "преподаватель", "учитель", "начальн", "методик"];
  }
  if (norm.includes("финансист") || norm.includes("финансы")) {
    return ["фин", "банк", "учет", "аудит", "эконом", "бизнес"];
  }
  if (norm.includes("юрист") || norm.includes("правовед")) {
    return ["юрист", "право", "закон", "юриспруденция"];
  }
  if (norm.includes("инженер")) {
    return ["инженер", "строит", "машино", "нефтегаз", "механик", "технолог"];
  }
  if (norm.includes("архитектор")) {
    return ["архитект", "дизайн", "проектир", "градостроит"];
  }
  if (norm.includes("психолог")) {
    return ["психолог", "социолог", "психотерапи"];
  }
  if (norm.includes("маркетолог") || norm.includes("пиар")) {
    return ["маркет", "реклам", "пиар", "pr", "связи"];
  }
  if (norm.includes("переводчик") || norm.includes("филолог") || norm.includes("перевод")) {
    return ["перевод", "филолог", "язык", "лингвист", "иностран", "английск", "казахск", "русск"];
  }
  if (norm.includes("логист") || norm.includes("логистике") || norm.includes("логистика")) {
    return ["логист", "транспорт", "снабжен", "перевоз"];
  }
  if (norm.includes("журналист") || norm.includes("медиа")) {
    return ["журнал", "медиа", "связи", "издатель"];
  }
  if (norm.includes("дипломат")) {
    return ["дипломат", "международные", "отношения", "политолог"];
  }
  if (norm.includes("биотехнолог")) {
    return ["биотехн", "биолог", "генет"];
  }
  if (norm.includes("ученый") || norm.includes("исследователь") || norm.includes("научный")) {
    return ["учен", "исследователь", "лаборант", "физик", "химик", "математик", "астрон"];
  }
  if (norm.includes("повар")) {
    return ["повар", "технолог", "бытов", "пищев", "ресторан"];
  }
  return [norm.split(" ")[0]];
};

  // Filter logic
  const filteredUniversities = useMemo(() => {
    return universities.filter(uni => {
      // 1. City Filter
      const uniCity = getCityFromAddress(uni.address);
      let matchesCity = true;
      if (locationMode === "single") {
        matchesCity = uniCity === selectedSingleCity;
      } else if (locationMode === "multiple") {
        matchesCity = selectedMultipleCities.includes(uniCity);
      }
      if (!matchesCity) return false;

      // 2. Profession / Specialty Filter
      if (selectedProfession) {
        const availableProfs = getAvailableProfessionsForUniversity(uni);
        const hasProfMatch = availableProfs.some(p => p.professionName.toLowerCase() === selectedProfession.toLowerCase());
        
        if (!hasProfMatch) {
          const matchingSpecialties = uni.faculties?.flatMap(f => f.specialties || []) || [];
          const hasExactSpecialty = matchingSpecialties.some(sp => 
            sp.name.toLowerCase().includes(selectedProfession.toLowerCase()) ||
            selectedProfession.toLowerCase().includes(sp.name.toLowerCase())
          );
          if (!hasExactSpecialty) return false;
        }
      }

      return true;
    });
  }, [universities, locationMode, selectedSingleCity, selectedMultipleCities, selectedProfession]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Visual Top Header Banner */}
      <div 
        className="bg-[#051F20] rounded-[32px] p-8 md:p-12 text-white shadow-xl relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'linear-gradient(to right, rgba(5,31,32,0.92) 50%, rgba(11,43,38,0.7) 100%), url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop")' }}
      >
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8EB69B]/20 text-[#8EB69B] text-[10px] font-bold tracking-widest uppercase border border-[#8EB69B]/30 mb-2">
            Региональный реестр вузов рк
          </span>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight">
            Официальный реестр университетов
          </h1>
          <p className="text-[#E2F4E9]/90 text-xs md:text-sm leading-relaxed">
            Выберите город или настройте гибкий мульти-выбор регионов для мгновенной фильтрации филиалов и национальных научных центров Казахстана.
          </p>
        </div>
      </div>

      {/* STEP 1: GEOLOCATION CHOICE CARD */}
      <div className="bg-white rounded-[24px] border border-[#8EB69B]/20 p-6 md:p-8 shadow-3xs space-y-6">
        
        {/* Core Mode Switchers */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#8EB69B]/10 pb-6">
          <div className="space-y-1">
            <h3 className="font-bold text-[#051F20] text-sm md:text-base">
              1. Выберите геологическое расположение ВУЗов
            </h3>
            <p className="text-[#163832]/80 text-xs leading-normal">
              Выберите удобный формат поиска: один город, мультивыбор или поиск по всей стране.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-[#E2F4E9]/50 p-1.5 rounded-2xl text-xs w-full lg:w-auto">
            <button
              onClick={handleSetAllCities}
              className={`flex-grow lg:flex-grow-0 px-4 py-2.5 font-bold rounded-xl transition cursor-pointer select-none ${
                locationMode === "all"
                  ? "bg-[#235347] text-white shadow-xs"
                  : "text-[#051F20] hover:bg-[#8EB69B]/20"
              }`}
            >
              Все города
            </button>
            <button
              onClick={() => setLocationMode("single")}
              className={`flex-grow lg:flex-grow-0 px-4 py-2.5 font-bold rounded-xl transition cursor-pointer select-none ${
                locationMode === "single"
                  ? "bg-[#235347] text-white shadow-xs"
                  : "text-[#051F20] hover:bg-[#8EB69B]/20"
              }`}
            >
              Один город
            </button>
            <button
              onClick={() => setLocationMode("multiple")}
              className={`flex-grow lg:flex-grow-0 px-4 py-2.5 font-bold rounded-xl transition cursor-pointer select-none ${
                locationMode === "multiple"
                  ? "bg-[#235347] text-white shadow-xs"
                  : "text-[#051F20] hover:bg-[#8EB69B]/20"
              }`}
            >
              Несколько городов
            </button>
          </div>
        </div>

        {/* Dynamic Inner Panel for Location Selectors */}
        {locationMode === "all" ? (
          <div className="p-4 bg-[#E2F4E9]/40 text-[#051F20] border border-[#8EB69B]/20 rounded-2xl">
            <div className="text-xs leading-relaxed font-semibold">
              Выбран вариант <strong className="font-black text-[#235347]">«Все города»</strong>. Будет показан полный список учебных заведений на территории Республики Казахстан.
            </div>
          </div>
        ) : locationMode === "single" ? (
          <div className="space-y-4">
            <div className="bg-[#E2F4E9]/20 p-4 rounded-2xl border border-[#8EB69B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-[#163832]">
                Выбран город: <strong className="text-[#235347] font-extrabold text-sm">{selectedSingleCity}</strong>
              </div>
              <button
                type="button"
                onClick={() => setIsCitiesListCollapsed(!isCitiesListCollapsed)}
                className="text-xs bg-white text-[#051F20] font-bold px-4 py-2 rounded-xl transition cursor-pointer border border-[#8EB69B]/20 select-none shadow-3xs"
              >
                <span>{isCitiesListCollapsed ? "Выбрать из списка (18 городов)" : "Свернуть список"}</span>
              </button>
            </div>

            {!isCitiesListCollapsed && (
              <div className="space-y-3 p-5 bg-[#E2F4E9]/30 rounded-2xl border border-[#8EB69B]/10 animate-fadeIn">
                <span className="text-[10px] font-bold text-[#235347]/80 block uppercase tracking-wider">Выберите конкретный город:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
                  {CITIES_LIST.map((city) => {
                    const isSelected = selectedSingleCity === city;
                    return (
                      <button
                        key={city}
                        onClick={() => {
                          handleSetSingleMode(city);
                          setIsCitiesListCollapsed(true);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-[#235347] border-[#235347] text-white shadow-3xs"
                            : "bg-white border-[#8EB69B]/20 text-[#051F20] hover:border-[#235347] hover:bg-[#E2F4E9]/10"
                        }`}
                      >
                        {city}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-[#E2F4E9]/20 p-4 rounded-2xl border border-[#8EB69B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-[#163832] leading-relaxed">
                Выбраны города: <strong className="text-[#235347] font-bold">{selectedMultipleCities.length} из {CITIES_LIST.length}</strong>
                <span className="text-[10px] text-[#235347]/85 block mt-1 font-semibold">({selectedMultipleCities.join(", ")})</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCitiesListCollapsed(!isCitiesListCollapsed)}
                className="text-xs bg-white text-[#051F20] font-bold px-4 py-2 rounded-xl transition cursor-pointer border border-[#8EB69B]/20 select-none shadow-3xs"
              >
                <span>{isCitiesListCollapsed ? "Изменить список городов" : "Свернуть список"}</span>
              </button>
            </div>

            {!isCitiesListCollapsed && (
              <div className="space-y-3 p-5 bg-[#E2F4E9]/30 rounded-2xl border border-[#8EB69B]/10 animate-fadeIn">
                <span className="text-[10px] font-bold text-[#235347]/80 block uppercase tracking-wider">Отметьте нужные города:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {CITIES_LIST.map((city) => {
                    const isChecked = selectedMultipleCities.includes(city);
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleToggleMultipleCity(city)}
                        className={`px-4 py-3 rounded-xl border text-left text-xs transition duration-150 flex items-center justify-between font-bold cursor-pointer ${
                          isChecked
                            ? "bg-[#235347] border-[#235347] text-white shadow-3xs"
                            : "bg-white border-[#8EB69B]/20 text-[#051F20] hover:border-[#235347]"
                        }`}
                      >
                        <span>{city}</span>
                        <span className="text-[10px] opacity-70">{isChecked ? "✓" : "+"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* STEP 1.5: SPECIALTIES & CAREER FILTER ACCORDION CONTAINER */}
      <div className="bg-white rounded-[24px] border border-[#8EB69B]/20 p-6 md:p-8 shadow-3xs space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-[#051F20] text-sm md:text-base flex items-center gap-2">
              <span>💼</span> 2. Направление обучения и профессии РК
            </h3>
            <p className="text-[#163832]/80 text-[11px] md:text-xs leading-normal">
              Выберите официальное направление или укажите нужную профессию по классификатору специальностей РК.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsProfessionsCollapsed(!isProfessionsCollapsed)}
            className="text-xs bg-[#235347] hover:bg-[#0B2B26] text-white font-bold px-5 py-3 rounded-xl transition cursor-pointer flex items-center gap-2 select-none self-start sm:self-auto shadow-3xs active:scale-[0.98]"
          >
            <span>{selectedProfession ? `Выбрано: ${selectedProfession}` : "Открыть классификатор профессий"}</span>
            <span>{isProfessionsCollapsed ? "▼" : "▲"}</span>
          </button>
        </div>

        {selectedProfession && (
          <div className="p-3.5 bg-[#E2F4E9]/50 rounded-xl border border-[#8EB69B]/25 flex items-center justify-between text-xs font-semibold text-[#051F20] animate-fadeIn">
            <span className="flex items-center gap-1.5 truncate">
              <span className="text-sm">🎯</span> Активный фильтр: <strong className="text-[#235347] font-extrabold underline truncate">{selectedProfession}</strong>
            </span>
            <button
              onClick={() => { setSelectedProfession(""); setProfessionSearchQuery(""); }}
              className="text-red-700 hover:text-red-950 font-black px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg transition text-[10px] cursor-pointer"
            >
              Сбросить фильтр ×
            </button>
          </div>
        )}

        {/* Collapsible content for professions list */}
        {!isProfessionsCollapsed && (
          <div className="pt-4 border-t border-[#8EB69B]/10 space-y-4 animate-fadeIn">
            
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#235347]">
                🔍
              </span>
              <input
                type="text"
                value={professionSearchQuery}
                onChange={(e) => setProfessionSearchQuery(e.target.value)}
                placeholder="Быстрый поиск по всем профессиям (например: Backend, Проджект, Кардиолог, Сметчик...)"
                className="w-full pl-10 pr-4 py-3 bg-[#E2F4E9]/10 border border-[#8EB69B]/30 rounded-xl text-xs text-[#051F20] font-medium placeholder-slate-400 focus:outline-none focus:border-[#235347] focus:ring-1 focus:ring-[#235347] transition duration-150"
              />
            </div>

            {/* If has query: show search results list */}
            {professionSearchQuery.trim() ? (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Результаты поиска:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-1">
                  {(() => {
                    const query = professionSearchQuery.toLowerCase();
                    const results: { name: string; bCodes: string[] }[] = [];
                    KAZ_PROFESSION_CATEGORIES.forEach(cat => {
                      cat.subcategories.forEach(sub => {
                        sub.professions.forEach(prof => {
                          const nameMatches = prof.name.toLowerCase().includes(query);
                          const kwMatches = prof.keywords.some(kw => kw.toLowerCase().includes(query));
                          const codeMatches = prof.bCodes.some(code => code.toLowerCase().includes(query));
                          if (nameMatches || kwMatches || codeMatches) {
                            results.push(prof);
                          }
                        });
                      });
                    });

                    if (results.length === 0) {
                      return <div className="col-span-full text-center py-6 text-slate-400 text-xs font-semibold">Ничего не найдено по запросу «{professionSearchQuery}»</div>;
                    }

                    return results.map((prof, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedProfession(prof.name)}
                        className={`p-3 rounded-xl border text-left text-xs transition duration-150 flex flex-col justify-between gap-1 cursor-pointer font-bold ${
                          selectedProfession === prof.name
                            ? "bg-[#235347] border-[#235347] text-white"
                            : "bg-white border-[#8EB69B]/20 text-[#051F20] hover:border-[#235347]"
                        }`}
                      >
                        <span className="truncate">💼 {prof.name}</span>
                        <span className={`text-[9px] font-mono opacity-80 ${selectedProfession === prof.name ? "text-white/90" : "text-[#235347]"}`}>
                          Код ЕНТ: {prof.bCodes.join(", ")}
                        </span>
                      </button>
                    ));
                  })()}
                </div>
              </div>
            ) : (
              /* If no query: show gorgeous categorised accordion */
              <div className="space-y-4">
                
                {/* Reset button to clear selection */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProfession("");
                  }}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition duration-150 flex items-center justify-between font-bold cursor-pointer ${
                    !selectedProfession
                      ? "bg-[#235347] border-[#235347] text-white"
                      : "bg-white border-[#8EB69B]/25 hover:bg-slate-50 text-[#051F20]"
                  }`}
                >
                  <span>🎓 Все направления и специальности ВУЗов Казахстана (Без фильтра)</span>
                  <span className="text-[10px] opacity-75">Показывать всё</span>
                </button>

                {/* Categories Layout Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  
                  {/* Category Buttons List (Left 5-col) */}
                  <div className="md:col-span-5 space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                    <span className="text-[10px] font-bold text-[#235347] uppercase tracking-wider block mb-2">Направления классификатора РК:</span>
                    {KAZ_PROFESSION_CATEGORIES.map(cat => {
                      const isOpened = expandedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setExpandedCategory(cat.id)}
                          className={`w-full text-left p-3.5 rounded-xl border transition duration-150 flex items-center justify-between select-none cursor-pointer ${
                            isOpened
                              ? "bg-[#E2F4E9]/80 border-[#235347] text-[#051F20] font-black"
                              : "bg-white border-[#8EB69B]/15 hover:border-[#235347] text-slate-700 font-semibold"
                          }`}
                        >
                          <span className="flex items-center gap-2.5 text-xs truncate">
                            <span className="text-sm">{cat.icon}</span>
                            <span className="truncate">{cat.name}</span>
                          </span>
                          <span className="text-[10px] opacity-65">{isOpened ? "▶" : "•"}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Subcategories and Professions View (Right 7-col) */}
                  <div className="md:col-span-7 bg-slate-50 border border-[#8EB69B]/10 p-5 rounded-2xl max-h-[380px] overflow-y-auto space-y-5">
                    {(() => {
                      const activeCatObj = KAZ_PROFESSION_CATEGORIES.find(c => c.id === expandedCategory);
                      if (!activeCatObj) {
                        return <div className="text-center py-12 text-slate-400 text-xs font-semibold">Выберите направление классификатора слева</div>;
                      }

                      return (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="border-b border-[#8EB69B]/10 pb-2">
                            <span className="text-[10px] font-bold text-[#235347] uppercase tracking-wider">Группа специальностей:</span>
                            <h4 className="text-xs font-black text-[#051F20] mt-0.5">{activeCatObj.name}</h4>
                          </div>

                          {activeCatObj.subcategories.map((sub, sIdx) => (
                            <div key={sIdx} className="space-y-2">
                              <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block">{sub.name}</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {sub.professions.map((prof, pIdx) => {
                                  const isSelected = selectedProfession === prof.name;
                                  return (
                                    <button
                                      key={pIdx}
                                      type="button"
                                      onClick={() => setSelectedProfession(prof.name)}
                                      className={`p-2.5 rounded-lg border text-left text-[11px] transition duration-150 flex flex-col justify-between gap-1 cursor-pointer font-bold ${
                                        isSelected
                                          ? "bg-[#235347] border-[#235347] text-white shadow-3xs"
                                          : "bg-white border-[#8EB69B]/10 hover:border-[#235347] text-[#051F20]"
                                      }`}
                                    >
                                      <span className="truncate leading-tight">{prof.name}</span>
                                      <span className={`text-[8px] font-mono block opacity-85 ${isSelected ? "text-white/90" : "text-[#235347]"}`}>
                                        ЕНТ: {prof.bCodes.join(", ")}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                </div>

              </div>
            )}

            <p className="text-[10px] text-slate-400 italic font-semibold text-center md:text-left">
              * Все профессии автоматически синхронизованы с базой кодов Министерства науки и высшения образования РК (B001–B271).
            </p>
          </div>
        )}

      </div>

      {/* STEP 2: DISPLAY FILTERED LIST */}
      <div className="space-y-5">
        <div className="flex items-center justify-between text-xs text-[#163832]/80 px-2">
          <span className="font-semibold">
            Найдено университетов: <strong className="text-[#235347] font-bold text-sm">{filteredUniversities.length}</strong>
          </span>
          <span className="font-bold text-[#235347] bg-[#E2F4E9] px-3 py-1 rounded-full text-[10px]">
            {locationMode === "all"
              ? "Все города РК"
              : locationMode === "single"
              ? `г. ${selectedSingleCity}`
              : `Список городов (${selectedMultipleCities.length})`}
          </span>
        </div>

        {filteredUniversities.length === 0 ? (
          <div className="bg-white border border-[#8EB69B]/20 rounded-[28px] p-12 text-center space-y-4 max-w-lg mx-auto shadow-3xs">
            <h4 className="font-bold text-[#051F20]">Нет вузов по данному фильтру</h4>
            <p className="text-xs text-[#163832] leading-relaxed">
              Университеты, соответствующие указанной комбинации городов и специальностей, отсутствуют в базе РК. Попробуйте сбросить географию или выбрать другие профили.
            </p>
            <button
              onClick={handleSetAllCities}
              className="px-5 py-2.5 bg-[#235347] hover:bg-[#0B2B26] transition text-white text-xs font-bold rounded-xl cursor-pointer uppercase tracking-wider"
            >
              Сбросить геолокацию
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((uni) => {
              const coverImg = uni.imageUrl || getUniversityFallbackImage(uni.id, uni.name);
              return (
                <div
                  key={uni.id}
                  className="bg-white border border-[#8EB69B]/15 rounded-[24px] overflow-hidden shadow-3xs hover:shadow-apple-hover hover:scale-[1.005] transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image Header Block */}
                  <div className="h-44 w-full overflow-hidden relative group bg-neutral-100 flex-shrink-0">
                    <img 
                      src={coverImg} 
                      alt={uni.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white bg-[#235347] px-2.5 py-1 rounded-md">
                        {uni.id.toUpperCase()}
                      </span>
                    </div>

                    <div className="absolute top-3 right-4 bg-white/95 backdrop-blur-3xs px-3 py-1 rounded-xl border border-white/20 shadow-xs text-right">
                      <span className="text-[9px] text-slate-400 block tracking-tight font-semibold">Обучение от</span>
                      <strong className="text-xs text-[#235347] font-black block leading-none">
                        {uni.tuitionFee?.toLocaleString()} ₸
                      </strong>
                    </div>
                  </div>

                  {/* Card Main Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <h3 className="text-xs md:text-sm font-bold text-[#051F20] leading-snug line-clamp-2 min-h-[2.5rem]" title={uni.name}>
                          {uni.name}
                        </h3>
                        <p className="text-[#163832]/70 text-[10px] line-clamp-1">
                          📍 {uni.address}
                        </p>
                      </div>

                      {uni.description && (
                        <p className="text-[11px] text-[#163832]/85 leading-relaxed line-clamp-3">
                          {uni.description}
                        </p>
                      )}

                      {/* Attribute badging */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/50 rounded-lg text-[9px] font-bold">
                          ЕНТ: от {uni.entMinSchool} б.
                        </span>
                        <span className="px-2 py-0.5 bg-[#E2F4E9] text-[#235347] border border-[#8EB69B]/20 rounded-lg text-[9px] font-bold">
                          {uni.hasHostel ? "Общежитие" : "Без общежития"}
                        </span>
                        {uni.hasGrants && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-100 rounded-lg text-[9px] font-bold">
                            Гранты
                          </span>
                        )}
                      </div>

                      {/* Dynamic matched professions */}
                      {(() => {
                        const available = getAvailableProfessionsForUniversity(uni);
                        if (available.length === 0) return null;
                        return (
                          <div className="space-y-1.5 pt-1.5">
                            <span className="text-[10px] font-bold text-[#235347] uppercase tracking-wider block">
                              💼 Профессии в ВУЗе ({available.length}):
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {available.slice(0, 5).map((ap, apIdx) => (
                                <span 
                                  key={apIdx} 
                                  className="px-2 py-0.5 bg-slate-50 text-slate-700 border border-slate-200/60 rounded-md text-[9px] font-semibold flex items-center gap-1"
                                  title={`${ap.professionName} (${ap.subcategory} - ${ap.specialtyName})`}
                                >
                                  <span className="text-[8px] text-[#235347] font-mono font-black">{ap.bCode}</span>
                                  <span className="truncate max-w-[130px]">{ap.professionName}</span>
                                </span>
                              ))}
                              {available.length > 5 && (
                                <span className="px-1.5 py-0.5 bg-[#E2F4E9]/50 text-[#235347] border border-[#8EB69B]/20 rounded-md text-[9px] font-black">
                                  + еще {available.length - 5}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Actions and details launch bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#8EB69B]/10">
                      <span className="text-[10px] font-bold text-[#235347]">
                        Языки: {uni.languages.map(l => l.toUpperCase()).join(", ")}
                      </span>

                      <button
                        onClick={() => setActiveUni(uni)}
                        className="px-4 py-2 bg-[#235347] hover:bg-[#0B2B26] transition text-white text-[11px] font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                      >
                        Подробнее
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAILED PASSPORT MODAL (exactly styled for consistency and with the photo on target left & actions on target right) */}
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
                className="text-[#8EB69B] hover:text-white transition text-sm font-bold cursor-pointer bg-[#163832] w-8 h-8 rounded-full flex items-center justify-center border border-[#8EB69B]/20"
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
                      Коммерческое обучение
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
                    Общежитие и Условия Проживания
                  </h4>
                  <p className="text-[#163832] text-xs bg-slate-50 p-4 rounded-2xl border border-[#8EB69B]/10">
                    {activeUni.hostelDetails || "Информация о наличии свободных койко-мест подлежит сверке в приемной комиссии непосредственно перед подачей оригиналов ЕНТ."}
                  </p>
                </div>

                {/* Languages, Grants & Quotas summary table */}
                <div className="space-y-2">
                  <h4 className="font-bold text-[#051F20] text-xs uppercase tracking-wider border-b border-[#8EB69B]/10 pb-2">
                    Государственные льготы и направления обучения
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3.5 rounded-xl text-center border border-[#8EB69B]/15">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Язык обучения</span>
                      <strong className="text-[#051F20] text-xs font-bold uppercase mt-1 block">{activeUni.languages.join(", ")}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl text-center border border-[#8EB69B]/15">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Гос. Гранты</span>
                      <strong className="text-[#051F20] text-xs font-bold mt-1 block">{activeUni.hasGrants ? "Присутствуют" : "Неактивно"}</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl text-center border border-[#8EB69B]/15">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Квотные места</span>
                      <strong className="text-[#051F20] text-xs font-bold mt-1 block">{activeUni.hasQuotas ? "Имеются" : "Редко"}</strong>
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
                    <p className="text-slate-400 text-xs text-center py-4">Сведения о наборе специальностей обновляются.</p>
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
                              <div key={sIdx} className="py-3 first:pt-0 last:pb-0 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="bg-[#E2F4E9] text-[#235347] text-[10px] px-2 py-0.5 rounded-md font-extrabold border border-[#8EB69B]/20">{sp.code}</span>
                                  <h6 className="text-[11px] font-bold text-[#051F20]">{sp.name}</h6>
                                </div>
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
