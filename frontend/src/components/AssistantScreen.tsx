import React, { useState, useEffect } from "react";

interface AuthenticatedUser {
  id: string;
  username: string;
  entScore: number;
  isCollegeGraduate: boolean;
  budget: number;
  interests: string[];
  fullName?: string;
  phone?: string;
  email?: string;
  isDemo?: boolean;
}

interface AssistantScreenProps {
  currentUser: AuthenticatedUser | null;
  onSetCurrentUser: (user: AuthenticatedUser | null) => void;
  onSetAdminSession?: (session: any) => void;
  onNavigateToTab?: (tab: any) => void;
  onTriggerAuth?: () => void;
}

export default function AssistantScreen({ currentUser, onSetCurrentUser, onSetAdminSession, onNavigateToTab, onTriggerAuth }: AssistantScreenProps) {
  // Profile forms
  const [entScore, setEntScore] = useState(75);
  const [isCollegeGraduate, setIsCollegeGraduate] = useState(false);
  const [userBudget, setUserBudget] = useState(1500000);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState("");

  // AI recommendations
  const [additionalComments, setAdditionalComments] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const interestAreas = [
    "IT / Программирование", 
    "Медицина / Врач", 
    "Педагогика / Преподаватель", 
    "Бизнес и Финансы", 
    "Юриспруденция / Закон", 
    "Инженерия", 
    "Архитектура", 
    "Естественные науки"
  ];

  // Loading statements
  const loadingStatements = [
    "Секунду, авторизуем запрос в реестре абитуриентов...",
    "Считываем Ваши баллы ЕНТ и планируемый годовой бюджет...",
    "Сверяем профиль с проходными баллами грантов Миннауки РК...",
    "Изучаем требования приемных комиссий к абитуриентам...",
    "Подключаем нейросеть Gemini для формулирования аналитики...",
    "Завершаем генерацию персональных рекомендаций..."
  ];

  // Rotate loading statements
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoadingAi) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingStatements.length - 1 ? prev + 1 : prev));
      }, 2200);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoadingAi]);

  // Handle load user stats into page
  useEffect(() => {
    if (currentUser) {
      setEntScore(currentUser.entScore || 75);
      setIsCollegeGraduate(currentUser.isCollegeGraduate || false);
      setUserBudget(currentUser.budget || 1500000);
      setSelectedInterests(currentUser.interests || []);
    }
  }, [currentUser]);

  // Simple Markdown Parser to avoid dependency issues on React 19
  const parseMarkdown = (text: string) => {
    if (!text) return null;
    
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith("#### ")) {
        return <h4 key={idx} className="text-xs font-bold text-[#051F20] mt-4 mb-2">{line.substring(5)}</h4>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={idx} className="text-sm font-bold text-[#235347] mt-5 border-b border-[#8EB69B]/15 pb-1 mb-2">{line.substring(4)}</h3>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={idx} className="text-base font-bold text-[#051F20] mt-6 border-b border-[#8EB69B]/30 pb-2 mb-3">{line.substring(3)}</h2>;
      }
      
      // Bullets
      if (line.startsWith("* ") || line.startsWith("- ")) {
        const cleanContent = line.substring(2);
        return (
          <li key={idx} className="list-disc list-inside ml-4 text-xs text-[#051F20]/90 leading-relaxed py-0.5">
            {parseBoldText(cleanContent)}
          </li>
        );
      }

      // Plain blank rows
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Paragraph with bold matches
      return <p key={idx} className="text-xs text-[#163832] leading-relaxed mb-2.5">{parseBoldText(line)}</p>;
    });
  };

  // Replace **text** with bold tags
  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-bold text-[#051F20]">{part}</strong>;
      }
      return part;
    });
  };

  // Log Out
  const handleLogOut = () => {
    onSetCurrentUser(null);
    setAiResponse("");
  };

  // Update Profile on Server
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaveStatus("");

    // Fast-path local-only demo profiles
    if (currentUser.isDemo) {
      onSetCurrentUser({
        ...currentUser,
        entScore,
        isCollegeGraduate,
        budget: userBudget,
        interests: selectedInterests
      });
      setSaveStatus("✅ Демо-профиль успешно сохранен!");
      setTimeout(() => setSaveStatus(""), 4000);
      return;
    }

    try {
      const response = await fetch(`/api/profile/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entScore,
          isCollegeGraduate,
          budget: userBudget,
          interests: selectedInterests
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Ошибка сохранения");
      }

      onSetCurrentUser({
        ...currentUser,
        entScore: data.entScore,
        isCollegeGraduate: data.isCollegeGraduate,
        budget: data.budget,
        interests: data.interests
      });

      setSaveStatus("✅ Профиль сохранен и актуализирован в реестре!");
      setTimeout(() => setSaveStatus(""), 4000);

    } catch (err: any) {
      setSaveStatus("❌ " + (err.message || "Ошибка сохранения"));
    }
  };

  // Toggle Interests array
  const handleInterestToggle = (interestName: string) => {
    if (selectedInterests.includes(interestName)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interestName));
    } else {
      setSelectedInterests([...selectedInterests, interestName]);
    }
  };

  // Ask AI recommender
  const handleTriggerRecommender = async () => {
    setIsLoadingAi(true);
    setAiResponse("");
    setLoadingStep(0);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entScore,
          isCollegeGraduate,
          budget: userBudget,
          interests: selectedInterests,
          comments: additionalComments
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Не удалось сгенерировать рекомендации");
      }

      setAiResponse(data.text || "Ассистент не смог сформулировать ответ.");
    } catch (err: any) {
      setAiResponse(`### ❌ Ошибка генерации\n\nНе удалось получить расчет нейросети: ${err.message}. Пожалуйста, попробуйте совершить запрос позднее.`);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-[#8EB69B]/15 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#051F20] tracking-tight">Персональный подбор AI</h1>
          <p className="text-[#163832]/80 text-xs md:text-sm">Персональный подбор программ и просчет Ваших шансов на грант в ВУЗах РК.</p>
        </div>
      </div>

      {/* NO USER STATE - REDESIGNED PROMPT CALLOUT */}
      {!currentUser ? (
        <div className="bg-white border border-[#8EB69B]/20 p-8 md:p-12 rounded-[28px] text-center space-y-6 max-w-2xl mx-auto shadow-3xs">
          
          <div className="space-y-2.5">
            <span className="text-[#215145] text-[10px] font-bold uppercase tracking-widest block">Личный кабинет абитуриента</span>
            <h2 className="text-xl md:text-2xl font-bold text-[#051F20] tracking-tight">
              Присоединяйтесь к единой системе UniSearch
            </h2>
            <p className="text-[#163832]/80 text-xs md:text-sm leading-relaxed max-w-lg mx-auto">
              Для того чтобы открыть полноценный доступ к аналитическому ассистенту поступления, сохранять свои баллы ЕНТ, бюджетные лимиты и рассчитывать вероятности грантов, пожалуйста, пройдите быструю авторизацию.
            </p>
          </div>

          <div className="pt-2">
            <button 
              onClick={onTriggerAuth}
              className="px-6 py-3.5 bg-[#235347] hover:bg-[#0B2B26] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-xs transition duration-150 cursor-pointer select-none"
            >
              Войти или зарегистрироваться
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 text-left border-t border-[#8EB69B]/10">
            <div className="p-4 bg-[#E2F4E9]/30 rounded-2xl border border-[#8EB69B]/10">
              <span className="font-bold text-[#051F20] text-xs block mb-1">🎯 ЕНТ Аналитика</span>
              <p className="text-[10px] text-slate-500 leading-relaxed">Сопоставление Ваших баллов с проходными грантами Миннауки РК в реальном времени.</p>
            </div>
            <div className="p-4 bg-[#E2F4E9]/30 rounded-2xl border border-[#8EB69B]/10">
              <span className="font-bold text-[#051F20] text-xs block mb-1">🤖 Помощник Gemini</span>
              <p className="text-[10px] text-slate-500 leading-relaxed">Полноценный расчет траектории зачисления нейросетью с учетом Ваших пожеланий.</p>
            </div>
            <div className="p-4 bg-[#E2F4E9]/30 rounded-2xl border border-[#8EB69B]/10">
              <span className="font-bold text-[#051F20] text-xs block mb-1">🏦 Финансовый аудит</span>
              <p className="text-[10px] text-slate-500 leading-relaxed">Точный просчет распределения стоимости обучения по семестрам и наличия общежитий.</p>
            </div>
          </div>
        </div>
      ) : (
        /* LOGGED IN VIEW - PROFILE CARD AND NEURAL RECOMMENDATION TERMINAL */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          
          {/* PROFILE PANEL */}
          <div className="lg:col-span-4 bg-white p-6 rounded-[24px] border border-[#8EB69B]/20 space-y-6 shadow-3xs">
            <div className="flex items-center justify-between border-b border-[#8EB69B]/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#235347] text-white font-bold text-xs flex items-center justify-center">
                  {currentUser.username[0].toUpperCase()}
                </div>
                <div className="leading-none">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase">Кабинет:</span>
                  <strong className="text-xs text-[#051F20] font-bold">{currentUser.username}</strong>
                </div>
              </div>
              <button
                onClick={handleLogOut}
                className="text-xs font-bold text-red-700 hover:text-red-950 transition cursor-pointer"
              >
                Выйти
              </button>
            </div>

            {saveStatus && (
              <p className="text-xs font-bold p-3 bg-[#E2F4E9] text-[#235347] rounded-xl border border-[#8EB69B]/20">
                {saveStatus}
              </p>
            )}

            <div className="space-y-5">
              {/* Score parameter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#051F20]">
                  <span>Показатели ЕНТ:</span>
                  <span className="text-[#235347] font-extrabold">{entScore} баллов</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="140"
                  value={entScore}
                  onChange={(e) => setEntScore(Number(e.target.value))}
                  className="w-full accent-[#235347] cursor-pointer"
                />
              </div>

              {/* Graduate or College selection */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#051F20] block">Прошлый уровень образования</span>
                <div className="flex gap-2 bg-[#E2F4E9]/30 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setIsCollegeGraduate(false)}
                    className={`w-1/2 py-2 text-[10px] font-bold rounded-lg transition cursor-pointer select-none ${!isCollegeGraduate ? "bg-white text-[#235347] shadow-3xs" : "text-[#163832]/60"}`}
                  >
                    Школа
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCollegeGraduate(true)}
                    className={`w-1/2 py-2 text-[10px] font-bold rounded-lg transition cursor-pointer select-none ${isCollegeGraduate ? "bg-white text-[#235347] shadow-3xs" : "text-[#163832]/60"}`}
                  >
                    Колледж
                  </button>
                </div>
              </div>

              {/* Tuition budget */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#051F20]">
                  <span>Своя планка стоимости:</span>
                  <span className="text-[#235347] font-bold">
                    {userBudget <= 750000 ? "Грант / Бесплатно" : `${userBudget.toLocaleString()} ₸`}
                  </span>
                </div>
                <input
                  type="range"
                  min="750000"
                  max="3800000"
                  step="50000"
                  value={userBudget}
                  onChange={(e) => setUserBudget(Number(e.target.value))}
                  className="w-full accent-[#235347] cursor-pointer"
                />
              </div>

              {/* Area map Interests check */}
              <div className="space-y-2.5 pt-3 border-t border-[#8EB69B]/10">
                <span className="text-xs font-bold text-[#051F20] block">Профессиональный вектор</span>
                <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {interestAreas.map((interest, i) => {
                    const active = selectedInterests.includes(interest);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`p-2.5 rounded-xl border text-left text-[10px] font-bold leading-tight transition cursor-pointer ${
                          active 
                            ? "bg-[#235347] border-[#235347] text-white" 
                            : "bg-[#E2F4E9]/20 border-[#8EB69B]/15 text-[#163832] hover:border-[#235347]"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* AI CONSULTANT CONSOLE TERMINAL */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Input additions */}
            <div className="bg-[#E2F4E9]/30 border border-[#8EB69B]/25 p-6 rounded-[24px] space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-[#051F20] text-xs uppercase tracking-wider">
                  Задать направление для ИИ
                </h4>
                <p className="text-[10px] text-slate-500">Например: Выдели только грантовые ВУЗы Астаны или распиши подробно программу КБТУ.</p>
              </div>

              <textarea
                rows={3}
                placeholder="Укажите дополнительные критерии подбора... (Необязательно)"
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                className="w-full bg-white border border-[#8EB69B]/20 focus:outline-none focus:border-[#235347] rounded-2xl p-4 text-xs text-[#051F20] resize-none"
              />

              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-[#163832]/80 font-bold">
                  ✓ Сверка с проходными грантами Миннауки РК
                </span>
                <button
                  type="button"
                  onClick={handleTriggerRecommender}
                  disabled={isLoadingAi}
                  className="px-5 py-3 bg-[#051F20] hover:bg-[#0B2B26] disabled:bg-slate-300 text-white font-bold rounded-xl text-xs transition uppercase tracking-widest cursor-pointer select-none"
                >
                  {isLoadingAi ? "Расчет..." : "Сформировать AI подбор"}
                </button>
              </div>
            </div>

            {/* RESPONSE CONSOLE */}
            <div className="bg-white border border-[#8EB69B]/20 rounded-[24px] min-h-[35vh] max-h-[550px] overflow-y-auto shadow-3xs relative">
              
              {/* Inner loading glow overlay */}
              {isLoadingAi && (
                <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-3xs flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-150 border-t-[#235347] animate-spin"></div>
                  <div className="space-y-1.5 max-w-sm">
                    <h4 className="font-bold text-[#235347] text-xs uppercase tracking-widest animate-pulse">Идут вычисления</h4>
                    <p className="text-[#051F20] font-bold text-xs leading-snug">
                      {loadingStatements[loadingStep]}
                    </p>
                    <p className="text-[10px] text-slate-400">На запуск полной фильтрации уходит 5 секунд. Пожалуйста, подождите.</p>
                  </div>
                </div>
              )}

              {/* Response output */}
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-[#8EB69B]/10 pb-4 mb-5">
                  <span className="text-[10px] font-bold text-[#235347] uppercase tracking-wider block">
                    Аналитический отчет
                  </span>
                  <span className="px-2 py-0.5 bg-[#E2F4E9] border border-[#8EB69B]/20 text-[9px] text-[#235347] font-bold rounded">
                    Интеграция с МРН РК
                  </span>
                </div>

                {aiResponse ? (
                  <div className="space-y-1 text-left">
                    {parseMarkdown(aiResponse)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-16 space-y-3">
                    <span className="text-3xl animate-pulse block">🤖</span>
                    <h5 className="font-bold text-[#051F20] text-sm">Отчет о шансах поступления</h5>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      Заполните анкетные предпочтения в панели абитуриента слева, сформулируйте запрос и нажмите кнопку формирования.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
