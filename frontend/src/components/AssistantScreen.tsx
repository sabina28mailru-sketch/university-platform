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

const SAVED_PARAMS_KEY = "assistant_saved_params";

export default function AssistantScreen({ currentUser, onSetCurrentUser, onSetAdminSession, onNavigateToTab, onTriggerAuth }: AssistantScreenProps) {
  const [entScore, setEntScore] = useState(75);
  const [isCollegeGraduate, setIsCollegeGraduate] = useState(false);
  const [userBudget, setUserBudget] = useState(1500000);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState("");
  const [paramsSaved, setParamsSaved] = useState(false);

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
    "Архитектура и строительство",
    "Энергетика / Нефтегаз",
    "Авиация / Логистика",
    "Сельское хозяйство",
    "Естественные науки",
    "Медиа / Творчество",
  ];

  const loadingStatements = [
    "Секунду, авторизуем запрос в реестре абитуриентов...",
    "Считываем Ваши баллы ЕНТ и планируемый годовой бюджет...",
    "Сверяем профиль с проходными баллами грантов Миннауки РК...",
    "Изучаем требования приемных комиссий к абитуриентам...",
    "Подключаем нейросеть для формулирования аналитики...",
    "Завершаем генерацию персональных рекомендаций...",
  ];

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

  // Load saved params from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(SAVED_PARAMS_KEY);
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setEntScore(p.entScore ?? 75);
        setIsCollegeGraduate(p.isCollegeGraduate ?? false);
        setUserBudget(p.budget ?? 1500000);
        setSelectedInterests(p.interests ?? []);
        setParamsSaved(true);
      } catch {}
    }
  }, []);

  // Load user stats when logged in
  useEffect(() => {
    if (currentUser) {
      setEntScore(currentUser.entScore || 75);
      setIsCollegeGraduate(currentUser.isCollegeGraduate || false);
      setUserBudget(currentUser.budget || 1500000);
      setSelectedInterests(currentUser.interests || []);
    }
  }, [currentUser]);

  // Save params to localStorage
  const handleSaveParams = () => {
    const params = { entScore, isCollegeGraduate, budget: userBudget, interests: selectedInterests };
    localStorage.setItem(SAVED_PARAMS_KEY, JSON.stringify(params));
    setParamsSaved(true);
    setSaveStatus("✅ Параметры сохранены! ИИ будет использовать их автоматически.");
    setTimeout(() => setSaveStatus(""), 4000);
  };

  // Improved Markdown Parser — larger, visually structured
  const parseMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      if (line.startsWith("#### ")) {
        elements.push(
          <h4 key={idx} className="text-sm font-bold text-[#051F20] mt-5 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#235347] inline-block shrink-0" />
            {line.substring(5)}
          </h4>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={idx} className="text-base font-black text-[#235347] mt-6 mb-2 border-b-2 border-[#8EB69B]/30 pb-2">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={idx} className="text-lg font-black text-[#051F20] mt-7 mb-3 border-b-2 border-[#8EB69B]/50 pb-2">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith("---")) {
        elements.push(<hr key={idx} className="border-[#8EB69B]/20 my-4" />);
      } else if (line.startsWith("* ") || line.startsWith("- ")) {
        const content = line.substring(2);
        elements.push(
          <div key={idx} className="flex items-start gap-2.5 py-1.5">
            <span className="w-2 h-2 rounded-full bg-[#235347] shrink-0 mt-1.5" />
            <p className="text-sm text-[#051F20]/90 leading-relaxed">{parseBoldText(content)}</p>
          </div>
        );
      } else if (line.match(/^\d+\.\s/)) {
        const content = line.replace(/^\d+\.\s/, "");
        const num = line.match(/^(\d+)/)?.[1];
        elements.push(
          <div key={idx} className="flex items-start gap-3 py-1.5">
            <span className="w-6 h-6 rounded-full bg-[#235347] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{num}</span>
            <p className="text-sm text-[#051F20]/90 leading-relaxed">{parseBoldText(content)}</p>
          </div>
        );
      } else if (!line.trim()) {
        elements.push(<div key={idx} className="h-1.5" />);
      } else {
        elements.push(
          <p key={idx} className="text-sm text-[#163832] leading-relaxed mb-2">{parseBoldText(line)}</p>
        );
      }
    });

    return elements;
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-black text-[#051F20]">{part}</strong>;
      }
      return part;
    });
  };

  const handleLogOut = () => {
    onSetCurrentUser(null);
    setAiResponse("");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaveStatus("");

    if (currentUser.isDemo) {
      onSetCurrentUser({ ...currentUser, entScore, isCollegeGraduate, budget: userBudget, interests: selectedInterests });
      setSaveStatus("✅ Демо-профиль сохранен!");
      setTimeout(() => setSaveStatus(""), 4000);
      return;
    }

    try {
      const response = await fetch(`/api/profile/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entScore, isCollegeGraduate, budget: userBudget, interests: selectedInterests }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Ошибка сохранения");
      onSetCurrentUser({ ...currentUser, entScore: data.entScore, isCollegeGraduate: data.isCollegeGraduate, budget: data.budget, interests: data.interests });
      setSaveStatus("✅ Профиль обновлён в системе!");
      setTimeout(() => setSaveStatus(""), 4000);
    } catch (err: any) {
      setSaveStatus("❌ " + (err.message || "Ошибка сохранения"));
    }
  };

  const handleInterestToggle = (interestName: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestName) ? prev.filter(i => i !== interestName) : [...prev, interestName]
    );
  };

  const handleTriggerRecommender = async () => {
    setIsLoadingAi(true);
    setAiResponse("");
    setLoadingStep(0);
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entScore, isCollegeGraduate, budget: userBudget, interests: selectedInterests, comments: additionalComments }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось сгенерировать рекомендации");
      setAiResponse(data.text || "Ассистент не смог сформулировать ответ.");
    } catch (err: any) {
      setAiResponse(`### ❌ Ошибка генерации\n\nНе удалось получить расчет нейросети: ${err.message}. Пожалуйста, попробуйте позднее.`);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      <div className="flex items-center justify-between border-b border-[#8EB69B]/15 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#051F20] tracking-tight">AI-помощник поступления</h1>
          <p className="text-[#163832]/80 text-xs md:text-sm">Персональный подбор программ и расчёт шансов на грант в ВУЗах РК.</p>
        </div>
        {paramsSaved && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#E2F4E9] border border-[#8EB69B]/30 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse block" />
            <span className="text-[10px] font-bold text-[#235347]">Параметры сохранены</span>
          </div>
        )}
      </div>

      {!currentUser ? (
        <div className="bg-white border border-[#8EB69B]/20 p-8 md:p-12 rounded-[28px] text-center space-y-6 max-w-2xl mx-auto shadow-sm">
          <div className="space-y-2.5">
            <span className="text-[#215145] text-[10px] font-bold uppercase tracking-widest block">Личный кабинет абитуриента</span>
            <h2 className="text-xl md:text-2xl font-bold text-[#051F20] tracking-tight">Присоединяйтесь к UniSearch</h2>
            <p className="text-[#163832]/80 text-xs md:text-sm leading-relaxed max-w-lg mx-auto">
              Для полноценного доступа к аналитическому ассистенту, сохранения баллов ЕНТ и расчёта вероятностей грантов — пройдите быструю авторизацию.
            </p>
          </div>
          <div className="pt-2">
            <button onClick={onTriggerAuth} className="px-6 py-3.5 bg-[#235347] hover:bg-[#0B2B26] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-sm transition duration-150 cursor-pointer select-none">
              Войти или зарегистрироваться
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 text-left border-t border-[#8EB69B]/10">
            {[
              { icon: "🎯", title: "ЕНТ Аналитика", desc: "Сопоставление баллов с проходными грантами Миннауки РК в реальном времени." },
              { icon: "🤖", title: "AI Ассистент", desc: "Полноценный расчёт траектории зачисления с учётом Ваших пожеланий." },
              { icon: "🏦", title: "Финансовый аудит", desc: "Точный просчёт стоимости обучения по семестрам и наличия общежитий." },
            ].map(item => (
              <div key={item.title} className="p-4 bg-[#E2F4E9]/30 rounded-2xl border border-[#8EB69B]/10">
                <span className="font-bold text-[#051F20] text-xs block mb-1">{item.icon} {item.title}</span>
                <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">

          {/* PROFILE PANEL */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-[24px] border border-[#8EB69B]/20 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#8EB69B]/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#235347] text-white font-bold text-sm flex items-center justify-center">
                    {currentUser.username[0].toUpperCase()}
                  </div>
                  <div className="leading-none">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">Кабинет:</span>
                    <strong className="text-xs text-[#051F20] font-bold">{currentUser.username}</strong>
                  </div>
                </div>
                <button onClick={handleLogOut} className="text-xs font-bold text-red-600 hover:text-red-800 transition cursor-pointer">
                  Выйти
                </button>
              </div>

              {saveStatus && (
                <p className="text-xs font-bold p-3 bg-[#E2F4E9] text-[#235347] rounded-xl border border-[#8EB69B]/20">
                  {saveStatus}
                </p>
              )}

              {/* ENT Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#051F20]">
                  <span>Баллы ЕНТ:</span>
                  <span className="text-[#235347] font-extrabold text-sm">{entScore} / 140</span>
                </div>
                <input
                  type="range" min="0" max="140" value={entScore}
                  onChange={(e) => setEntScore(Number(e.target.value))}
                  className="w-full accent-[#235347] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-semibold">
                  <span>0</span>
                  <span className={`font-bold ${entScore >= 110 ? "text-emerald-600" : entScore >= 85 ? "text-amber-600" : "text-red-500"}`}>
                    {entScore >= 110 ? "Высокие шансы на грант" : entScore >= 85 ? "Средние шансы" : "Ниже среднего"}
                  </span>
                  <span>140</span>
                </div>
              </div>

              {/* School/College */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#051F20] block">Уровень образования:</span>
                <div className="flex gap-2 bg-[#E2F4E9]/30 p-1 rounded-xl">
                  {[{ label: "После школы", val: false }, { label: "После колледжа", val: true }].map(opt => (
                    <button key={opt.label} type="button" onClick={() => setIsCollegeGraduate(opt.val)}
                      className={`w-1/2 py-2 text-[10px] font-bold rounded-lg transition cursor-pointer select-none ${
                        isCollegeGraduate === opt.val ? "bg-white text-[#235347] shadow-sm" : "text-[#163832]/60"
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#051F20]">
                  <span>Бюджет на обучение:</span>
                  <span className="text-[#235347] font-bold text-xs">
                    {userBudget <= 750000 ? "Только грант" : `${userBudget.toLocaleString()} ₸/год`}
                  </span>
                </div>
                <input
                  type="range" min="750000" max="3800000" step="50000" value={userBudget}
                  onChange={(e) => setUserBudget(Number(e.target.value))}
                  className="w-full accent-[#235347] cursor-pointer"
                />
              </div>

              {/* Interests */}
              <div className="space-y-2 pt-2 border-t border-[#8EB69B]/10">
                <span className="text-xs font-bold text-[#051F20] block">Направления интересов:</span>
                <div className="grid grid-cols-2 gap-1.5 max-h-[200px] overflow-y-auto pr-1">
                  {interestAreas.map((interest, i) => {
                    const active = selectedInterests.includes(interest);
                    return (
                      <button key={i} type="button" onClick={() => handleInterestToggle(interest)}
                        className={`p-2 rounded-xl border text-left text-[10px] font-bold leading-tight transition cursor-pointer ${
                          active ? "bg-[#235347] border-[#235347] text-white" : "bg-[#E2F4E9]/20 border-[#8EB69B]/15 text-[#163832] hover:border-[#235347]"
                        }`}>
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#8EB69B]/10">
                {/* Save params to localStorage */}
                <button
                  type="button"
                  onClick={handleSaveParams}
                  className="w-full py-2.5 bg-[#E2F4E9] hover:bg-[#8EB69B]/30 text-[#235347] font-bold rounded-xl text-xs border border-[#8EB69B]/30 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  💾 Сохранить параметры
                </button>
                {/* Save to user profile on server */}
                <button
                  type="button"
                  onClick={handleSaveProfile as any}
                  className="w-full py-2.5 bg-[#235347]/10 hover:bg-[#235347]/20 text-[#235347] font-bold rounded-xl text-xs border border-[#235347]/20 transition cursor-pointer"
                >
                  Обновить профиль в системе
                </button>
              </div>
            </div>

            {/* Saved params info card */}
            {paramsSaved && (
              <div className="bg-[#E2F4E9] border border-[#8EB69B]/30 rounded-[20px] p-4 space-y-1">
                <p className="text-[10px] font-black text-[#235347] uppercase tracking-wider">Параметры сохранены</p>
                <p className="text-[10px] text-[#163832]/80">
                  ИИ автоматически использует ЕНТ: <strong>{entScore}</strong>, бюджет: <strong>{userBudget <= 750000 ? "грант" : `${userBudget.toLocaleString()} ₸`}</strong>, тип: <strong>{isCollegeGraduate ? "колледж" : "школа"}</strong>
                </p>
              </div>
            )}
          </div>

          {/* AI CONSULTANT PANEL */}
          <div className="lg:col-span-8 space-y-5">

            <div className="bg-[#E2F4E9]/30 border border-[#8EB69B]/25 p-6 rounded-[24px] space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-[#051F20] text-xs uppercase tracking-wider">Уточнить запрос для ИИ</h4>
                <p className="text-[10px] text-slate-500">Например: «Только грантовые ВУЗы Астаны» или «Подробно о программе КБТУ».</p>
              </div>
              <textarea
                rows={3}
                placeholder="Укажите дополнительные критерии подбора... (Необязательно)"
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                className="w-full bg-white border border-[#8EB69B]/20 focus:outline-none focus:border-[#235347] rounded-2xl p-4 text-sm text-[#051F20] resize-none"
              />
              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-[#163832]/80 font-bold">
                  ✓ Сверка с базой грантов Миннауки РК
                </span>
                <button
                  type="button"
                  onClick={handleTriggerRecommender}
                  disabled={isLoadingAi}
                  className="px-6 py-3 bg-[#051F20] hover:bg-[#0B2B26] disabled:bg-slate-300 text-white font-bold rounded-xl text-xs transition uppercase tracking-widest cursor-pointer select-none"
                >
                  {isLoadingAi ? "Расчёт..." : "Сформировать AI подбор"}
                </button>
              </div>
            </div>

            {/* AI RESPONSE */}
            <div className="bg-white border border-[#8EB69B]/20 rounded-[24px] min-h-[40vh] max-h-[700px] overflow-y-auto shadow-sm relative">

              {isLoadingAi && (
                <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fadeIn rounded-[24px]">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-[#235347] animate-spin" />
                  <div className="space-y-1.5 max-w-sm">
                    <h4 className="font-bold text-[#235347] text-xs uppercase tracking-widest animate-pulse">Идут вычисления</h4>
                    <p className="text-[#051F20] font-bold text-sm leading-snug">{loadingStatements[loadingStep]}</p>
                    <p className="text-[10px] text-slate-400">Полная фильтрация занимает ~5–10 секунд.</p>
                  </div>
                </div>
              )}

              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-[#8EB69B]/10 pb-4 mb-5">
                  <span className="text-[10px] font-bold text-[#235347] uppercase tracking-wider">Аналитический отчёт</span>
                  <span className="px-2 py-0.5 bg-[#E2F4E9] border border-[#8EB69B]/20 text-[9px] text-[#235347] font-bold rounded">
                    Интеграция с МОН РК
                  </span>
                </div>

                {aiResponse ? (
                  <div className="space-y-1 text-left">
                    {parseMarkdown(aiResponse)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-16 space-y-3">
                    <span className="text-4xl animate-pulse block">🤖</span>
                    <h5 className="font-bold text-[#051F20] text-base">Персональный отчёт о шансах</h5>
                    <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                      Настройте параметры в панели слева — сохраните их кнопкой «Сохранить параметры», затем нажмите «Сформировать AI подбор».
                    </p>
                    {paramsSaved && (
                      <div className="mt-2 px-4 py-2 bg-[#E2F4E9] border border-[#8EB69B]/30 rounded-xl">
                        <p className="text-xs text-[#235347] font-bold">Параметры загружены — нажмите кнопку выше ↑</p>
                      </div>
                    )}
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
