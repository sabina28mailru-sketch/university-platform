import React, { useState, useEffect } from "react";
import { University, CareerProfession, Lead, DynamicBlocks } from "./types";

// Import modules
import MainScreen from "./components/MainScreen";
import CatalogScreen from "./components/CatalogScreen";
import UniversitiesSection from "./components/UniversitiesSection";
import CareerScreen from "./components/CareerScreen";
import AssistantScreen from "./components/AssistantScreen";
import AdminScreen from "./components/AdminScreen";

// Hash ↔ Tab mapping for URL navigation (e.g. localhost:5173/#/admin)
const HASH_TO_TAB: Record<string, string> = {
  "#/admin": "админ-панель",
  "#/assistant": "помощник",
  "#/careers": "профессии",
  "#/catalog": "каталог",
  "#/unis": "вузы",
  "#/": "главная",
  "": "главная",
};
const TAB_TO_HASH: Record<string, string> = {
  "админ-панель": "#/admin",
  "помощник": "#/assistant",
  "профессии": "#/careers",
  "каталог": "#/catalog",
  "вузы": "#/unis",
  "главная": "#/",
};

export default function App() {
  // Navigation — initialized from URL hash so #/admin works directly
  const [activeTab, setActiveTab] = useState<"главная" | "вузы" | "каталог" | "профессии" | "помощник" | "админ-панель">(() => {
    return (HASH_TO_TAB[window.location.hash] as any) || "главная";
  });

  // Sync URL hash when tab changes
  useEffect(() => {
    const newHash = TAB_TO_HASH[activeTab] || "#/";
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
  }, [activeTab]);

  // Handle browser back/forward and direct URL entry
  useEffect(() => {
    const handleHashChange = () => {
      const tab = HASH_TO_TAB[window.location.hash] as any;
      if (tab) setActiveTab(tab);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Database states
  const [universities, setUniversities] = useState<University[]>([]);
  const [careers, setCareers] = useState<CareerProfession[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dynamicBlocks, setDynamicBlocks] = useState<DynamicBlocks>({
    whyUs: { title: "", subtitle: "", cards: [] },
    whatWeDo: { title: "", description: "", items: [] },
    aboutUs: { title: "", text: "", stats: [] }
  });

  // Student auth state — only for regular users (role: student)
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("current_user");
      const parsed = saved ? JSON.parse(saved) : null;
      // Only restore if it's a student session
      return parsed && parsed.role === "student" ? parsed : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("current_user");
    }
  }, [currentUser]);

  // Admin / Manager session — completely separate from student session
  const [adminSession, setAdminSession] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("admin_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (adminSession) {
      localStorage.setItem("admin_session", JSON.stringify(adminSession));
    } else {
      localStorage.removeItem("admin_session");
    }
  }, [adminSession]);

  // App statuses
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showThanks, setShowThanks] = useState(false);
  const [thanksCountdown, setThanksCountdown] = useState(4);

  // Unified global auth modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regEntScore, setRegEntScore] = useState("");

  // Deep linking between screens
  const [catalogQueryPrefill, setCatalogQueryPrefill] = useState("");
  const [selectedProfessionForUni, setSelectedProfessionForUni] = useState("");

  // Handle Unified Global Auth Submit
  const handleGlobalAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (authModalTab === "login") {
      if (!authUsername.trim() || !authPassword.trim()) {
        setAuthError("Заполните все поля");
        return;
      }

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: authUsername, password: authPassword })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Неверный логин или пароль");
        }

        // Admin/manager must use the admin panel login form, not the student modal
        if (data.role === "admin" || data.role === "manager") {
          setAuthError("Для входа в панель управления перейдите по адресу #/admin");
          return;
        }

        setAuthSuccess("Успешный вход!");
        setTimeout(() => {
          setCurrentUser(data);
          setShowAuthModal(false);
          setAuthUsername("");
          setAuthPassword("");
          setAuthSuccess("");
          setAuthError("");
        }, 800);
      } catch (err: any) {
        setAuthError(err.message || "Ошибка соединения с бэкендом");
      }
    } else {
      // REGISTER STUDENT
      if (!regName.trim() || !regPhone.trim() || !regEmail.trim() || !authPassword.trim()) {
        setAuthError("Заполните обязательные поля: Имя, Телефон, Email и Пароль");
        return;
      }

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: regName,
            fullName: regName,
            phone: regPhone,
            email: regEmail,
            entScore: regEntScore ? Number(regEntScore) : 0,
            password: authPassword
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Произошла ошибка при регистрации");
        }

        setAuthSuccess("Регистрация успешна! Вход в систему...");
        setTimeout(() => {
          setCurrentUser(data);
          setShowAuthModal(false);
          setRegName("");
          setRegPhone("");
          setRegEmail("");
          setRegEntScore("");
          setAuthPassword("");
          setAuthSuccess("");
          setAuthError("");
        }, 1000);
      } catch (err: any) {
        setAuthError(err.message || "Ошибка соединения");
      }
    }
  };

  const handleGlobalLogout = () => {
    setCurrentUser(null);
    // Don't touch adminSession here — admin logs out separately inside AdminScreen
    setAuthUsername("");
    setAuthPassword("");
    setRegName("");
    setRegPhone("");
    setRegEmail("");
    setRegEntScore("");
    setActiveTab("главная");
  };

  // Initial loading fetch
  const fetchAllData = async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const [uniRes, careerRes, leadsRes, blockRes] = await Promise.all([
        fetch("/api/universities"),
        fetch("/api/careers"),
        fetch("/api/leads"),
        fetch("/api/dynamic-blocks")
      ]);

      if (!uniRes.ok || !careerRes.ok || !leadsRes.ok || !blockRes.ok) {
        throw new Error("Ошибка при получении данных с сервера.");
      }

      const [uniData, careerData, leadsData, blockData] = await Promise.all([
        uniRes.json(),
        careerRes.json(),
        leadsRes.json(),
        blockRes.json()
      ]);

      setUniversities(uniData);
      setCareers(careerData);
      setLeads(leadsData);
      setDynamicBlocks(blockData);
    } catch (err: any) {
      setLoadError(err.message || "Не удалось загрузить базы данных ВУЗов.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handle successful lead test submission from main screen
  const handleLeadSubmitSuccess = () => {
    fetchAllData(); // Refresh all state data so leads are synced in Admin Panel immediately!
    setShowThanks(true);
    setThanksCountdown(4);
    
    // Auto countdown timer
    const interval = setInterval(() => {
      setThanksCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowThanks(false);
          setActiveTab("главная"); // Redirect back to home
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Direct redirection from Career guide detail to Catalog Search pre-filled
  const handleSelectCareerForCatalog = (careerKeyword: string) => {
    // Isolate key part of career (e.g. "Программист" or "Учитель")
    const simplified = careerKeyword.split(" ")[0];
    setCatalogQueryPrefill(simplified);
    setActiveTab("каталог");
  };

  const handleSelectCareerForUni = (careerName: string) => {
    setSelectedProfessionForUni(careerName);
    setActiveTab("вузы");
  };

  // ── ADMIN: full-page takeover, completely separate from the main site ──
  if (activeTab === "админ-панель") {
    return (
      <AdminScreen
        adminSession={adminSession}
        onSetAdminSession={setAdminSession}
        onExitAdmin={() => { fetchAllData(); setActiveTab("главная"); }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#E2F4E9] text-[#051F20] flex flex-col font-sans transition-all duration-300">
      
      {/* 1. MAIN GLOBAL HEADER PANEL */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#8EB69B]/20 sticky top-0 z-40 shadow-xs">
        <div className="kz-container px-6 py-4 md:py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="w-9 h-9 rounded-xl bg-[#235347] flex items-center justify-center shadow shrink-0">
              <span className="text-white font-black text-lg leading-none">U</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#051F20] tracking-tight leading-none">UniSearch.kz</h1>
              <span className="text-[10px] text-[#163832] font-semibold mt-1 block">Цифровая платформа ВУЗов Казахстана</span>
            </div>
          </div>

          {/* Tab-like core navigation items */}
          <nav className="flex flex-wrap items-center gap-1 md:gap-2 text-xs">
            {[
              { id: "главная", label: "Главная" },
              { id: "вузы", label: "Вузы" },
              { id: "каталог", label: "Поиск ВУЗов" },
              { id: "профессии", label: "Карьерный гид" },
              { id: "помощник", label: "AI Помощник" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id !== "каталог") {
                      setCatalogQueryPrefill(""); // Clear pre-fills if navigating away
                    }
                  }}
                  className={`px-4 py-2 rounded-xl font-bold transition-all duration-150 cursor-pointer ${
                    isActive 
                      ? "bg-[#235347] text-white shadow-sm" 
                      : "text-[#051F20]/80 hover:bg-[#8EB69B]/20 hover:text-[#051F20]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Dynamic authorized user display */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                <div className="flex flex-col items-end leading-none">
                  <span className="text-[#051F20] font-bold text-xs">{currentUser.username}</span>
                  <span className="text-[9px] text-[#235347] font-bold uppercase mt-1">
                    Абитуриент
                  </span>
                </div>
                <button 
                  onClick={handleGlobalLogout}
                  className="text-xs bg-red-50 hover:bg-red-105 text-red-650 font-bold px-3 py-1.5 rounded-lg border border-red-200/50 transition cursor-pointer"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setAuthError("");
                  setAuthSuccess("");
                  setAuthModalTab("login");
                  setShowAuthModal(true);
                }}
                className="text-xs bg-[#E2F4E9] hover:bg-[#8EB69B]/30 text-[#051F20] font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center shadow-3xs border border-[#8EB69B]/30"
              >
                Вход / Регистрация
              </button>
            )}
          </div>

        </div>
      </header>

      {/* 2. LOADING AND ERROR FALLBACK WALLS */}
      {isLoading ? (
        <div className="flex-grow flex flex-col items-center justify-center p-8 space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-[#8EB69B]/20 border-t-[#235347] animate-spin"></div>
          <p className="text-[#163832] text-xs font-semibold uppercase tracking-widest animate-pulse">Подключение к базе данных РК...</p>
        </div>
      ) : loadError ? (
        <div className="flex-grow kz-container py-12">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center space-y-4 max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-red-950">Ошибка запуска дипломного стенда</h3>
            <p className="text-xs text-slate-655 leading-relaxed">{loadError}</p>
            <button
              onClick={fetchAllData}
              className="px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase cursor-pointer"
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      ) : (
        /* 3. DYNAMIC MAIN BODY CONTENT CONTAINERS */
        <main className="flex-grow kz-container px-6 py-8">
          
          {/* THANK YOU SUB-SCREEN OVERLAY */}
          {showThanks && (
            <div className="fixed inset-0 bg-[#051F20]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 border border-[#8EB69B]/20 shadow-2xl animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#E2F4E9] text-[#235347] flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-[#051F20] tracking-tight">Спасибо за обращение!</h2>
                  <p className="text-[#163832] text-xs leading-relaxed">
                    Данные Вашего интерактивного теста успешно верифицированы и сохранены в бэкенд-базе данных ЕНТ.
                  </p>
                  <p className="text-[#051F20] text-xs font-bold bg-[#E2F4E9] p-4 rounded-2xl border border-[#8EB69B]/30">
                    Наши научные менторы и координаторы свяжутся с Вами по указанному телефону в течение рабочего дня!
                  </p>
                </div>

                <div className="pt-4 border-t border-[#8EB69B]/10">
                  <p className="text-[10px] text-[#235347] font-bold uppercase tracking-widest">
                    Автовозврат в главное меню через {thanksCountdown} сек...
                  </p>
                  <div className="w-full bg-[#E2F4E9] h-1.5 rounded-full overflow-hidden mt-2">
                    <div 
                      className="bg-[#235347] h-full transition-all duration-1000" 
                      style={{ width: `${(thanksCountdown / 4) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC SCREEN RENDERS */}
          {activeTab === "главная" && (
            <MainScreen 
              dynamicBlocks={dynamicBlocks}
              onLeadSubmitSuccess={handleLeadSubmitSuccess}
              onNavigateToCatalog={() => {
                setCatalogQueryPrefill("");
                setActiveTab("каталог");
              }}
            />
          )}

          {activeTab === "вузы" && (
            <UniversitiesSection 
              universities={universities}
              onRefresh={fetchAllData}
              selectedProfession={selectedProfessionForUni}
              setSelectedProfession={setSelectedProfessionForUni}
              careers={careers}
            />
          )}

          {activeTab === "каталог" && (
            <CatalogScreen 
              universities={universities}
              onRefresh={fetchAllData}
            />
          )}

          {activeTab === "профессии" && (
            <CareerScreen 
              careers={careers}
              onSelectCareerForCatalog={handleSelectCareerForCatalog}
              onSelectCareerForUni={handleSelectCareerForUni}
            />
          )}

          {activeTab === "помощник" && (
            <AssistantScreen 
              currentUser={currentUser}
              onSetCurrentUser={setCurrentUser}
              onSetAdminSession={setAdminSession}
              onNavigateToTab={setActiveTab}
              onTriggerAuth={() => {
                setAuthError("");
                setAuthSuccess("");
                setAuthModalTab("login");
                setShowAuthModal(true);
              }}
            />
          )}

        </main>
      )}

      {/* 4. ACADEMIC COMPACT FOOTER FOOTAGE */}
      <footer className="bg-[#051F20] text-[#8EB69B] py-10 border-t border-[#163832]/60 text-xs mt-12">
        <div className="kz-container px-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          <div className="space-y-1 text-center md:text-left">
            <span className="font-bold text-white text-sm block">Каталог ВУЗов Казахстана</span>
            <p className="text-[11px] leading-relaxed max-w-md text-[#8EB69B]/85">
              Я просто студент КЖ, который делает этот проект в качестве дипломной работы по разработке удобной системы подбора и изучения учебных заведений Казахстана.
            </p>
          </div>

          <div className="text-center md:text-right space-y-1">
            <span className="block text-[11px] text-[#8EB69B]/70 hover:text-white transition duration-150">Источники: Министерство науки и высшего образования РК • talim.edu.kz</span>
            <div className="text-[10px] text-[#8EB69B]/55">
              © 2026 Все права защищены • Дипломный проект (КЖ) • <button onClick={() => { setAuthModalTab("login"); setAuthError(""); setAuthSuccess(""); setShowAuthModal(true); }} className="hover:underline hover:text-white cursor-pointer font-bold focus:outline-none">Вход для кураторов</button>
            </div>
          </div>

        </div>
      </footer>

      {/* 5. UNIFIED GLOBAL AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-[#051F20]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-[#8EB69B]/20 shadow-2xl relative">
            
            {/* Close button */}
            <button 
              onClick={() => {
                setShowAuthModal(false);
                setAuthError("");
                setAuthSuccess("");
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 cursor-pointer text-lg font-bold"
            >
              ✕
            </button>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 mb-6">
              <button 
                onClick={() => {
                  setAuthModalTab("login");
                  setAuthError("");
                  setAuthSuccess("");
                }}
                className={`flex-grow pb-3 text-xs md:text-sm font-extrabold tracking-tight cursor-pointer transition-colors ${
                  authModalTab === "login" 
                    ? "border-b-2 border-[#235347] text-[#235347]" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Вход в систему
              </button>
              <button 
                onClick={() => {
                  setAuthModalTab("register");
                  setAuthError("");
                  setAuthSuccess("");
                }}
                className={`flex-grow pb-3 text-xs md:text-sm font-extrabold tracking-tight cursor-pointer transition-colors ${
                  authModalTab === "register" 
                    ? "border-b-2 border-[#235347] text-[#235347]" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Регистрация абитуриента
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 text-red-650 border border-red-100 rounded-xl text-xs font-semibold leading-relaxed">
                {authError}
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-755 border border-emerald-100 rounded-xl text-xs font-semibold leading-relaxed">
                {authSuccess}
              </div>
            )}

            <form onSubmit={handleGlobalAuthSubmit} className="space-y-4">
              {authModalTab === "login" ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#051F20] block">Имя (логин) или Email</label>
                    <input 
                      type="text"
                      placeholder="Введите имя или email"
                      required
                      value={authUsername}
                      onChange={(e) => setAuthUsername(e.target.value)}
                      className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:outline-none focus:border-[#235347] focus:bg-white rounded-xl px-4 py-2 text-xs text-slate-800 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#051F20] block">Пароль</label>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:outline-none focus:border-[#235347] focus:bg-white rounded-xl px-4 py-2 text-xs text-slate-800 transition"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#051F20] block">ФИО / Имя *</label>
                    <input 
                      type="text"
                      placeholder="Ваше имя"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:outline-none focus:border-[#235347] focus:bg-white rounded-xl px-4 py-2 text-xs text-slate-800 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#051F20] block">Номер телефона *</label>
                    <input 
                      type="tel"
                      placeholder="+7 (707) 123-4567"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:outline-none focus:border-[#235347] focus:bg-white rounded-xl px-4 py-2 text-xs text-slate-800 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#051F20] block">Email *</label>
                    <input 
                      type="email"
                      placeholder="yourmail@gmail.com"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:outline-none focus:border-[#235347] focus:bg-white rounded-xl px-4 py-2 text-xs text-slate-800 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#051F20] block">Балл ЕНТ (необязательно)</label>
                    <input 
                      type="number"
                      min="0"
                      max="140"
                      placeholder="Например, 95"
                      value={regEntScore}
                      onChange={(e) => setRegEntScore(e.target.value)}
                      className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:outline-none focus:border-[#235347] focus:bg-white rounded-xl px-4 py-2 text-xs text-slate-800 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#051F20] block">Пароль *</label>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:outline-none focus:border-[#235347] focus:bg-white rounded-xl px-4 py-2 text-xs text-slate-800 transition"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#235347] hover:bg-[#0B2B26] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
              >
                {authModalTab === "login" ? "Войти в систему" : "Зарегистрироваться"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
