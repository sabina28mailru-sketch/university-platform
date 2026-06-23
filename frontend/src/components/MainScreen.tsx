import React, { useState } from "react";
import { DynamicBlocks } from "../types";

interface MainScreenProps {
  dynamicBlocks: DynamicBlocks;
  onLeadSubmitSuccess: () => void;
  onNavigateToCatalog: () => void;
}

const TOTAL_STEPS = 4;

function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("7")) digits = "8" + digits.slice(1);
  if (digits.length > 0 && !digits.startsWith("8")) digits = "8" + digits;
  digits = digits.slice(0, 11);
  let result = "";
  for (let i = 0; i < digits.length; i++) {
    if (i === 0) result += digits[i];
    else if (i === 1) result += " (" + digits[i];
    else if (i === 4) result += ") " + digits[i];
    else if (i === 7) result += "-" + digits[i];
    else if (i === 9) result += "-" + digits[i];
    else result += digits[i];
  }
  return result;
}

const FIELD_OPTIONS = [
  "IT / Программирование",
  "Медицина / Здоровье",
  "Педагогика / Образование",
  "Бизнес и финансы",
  "Юриспруденция / Право",
  "Архитектура и строительство",
  "Маркетинг и PR",
  "Естественные науки",
];

const FORMAT_OPTIONS = ["Очный", "Заочный", "Дистанционный", "Смешанный"];

const INTEREST_OPTIONS = [
  "Наука и исследования",
  "Спорт",
  "Искусство и культура",
  "Предпринимательство",
  "Международная деятельность",
];

const BUDGET_OPTIONS = [
  "Грант / Бесплатно",
  "800 000 – 1 000 000 ₸",
  "1 000 000 – 1 500 000 ₸",
  "1 500 000 – 2 000 000 ₸",
  "2 000 000 – 3 000 000 ₸",
  "Свыше 3 000 000 ₸",
];

const INCOME_OPTIONS = [
  "До 200 000 ₸/мес",
  "200 000 – 500 000 ₸/мес",
  "500 000 – 1 000 000 ₸/мес",
  "Свыше 1 000 000 ₸/мес",
];

const PLAN_OPTIONS = [
  "Карьера в Казахстане",
  "Работа за рубежом",
  "Открыть свой бизнес",
  "Научная деятельность",
];

export default function MainScreen({ dynamicBlocks, onLeadSubmitSuccess, onNavigateToCatalog }: MainScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [selectedField, setSelectedField] = useState("");
  // Step 2
  const [studyFormat, setStudyFormat] = useState("");
  const [hasCollege, setHasCollege] = useState<boolean | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  // Step 3
  const [selectedBudget, setSelectedBudget] = useState("");
  const [desiredIncome, setDesiredIncome] = useState("");
  const [futurePlans, setFuturePlans] = useState("");
  // Step 4
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleNext = () => {
    setError("");
    if (currentStep === 1) {
      if (!selectedField) { setError("Пожалуйста, выберите направление."); return; }
    }
    if (currentStep === 2) {
      if (!studyFormat || hasCollege === null) {
        setError("Выберите формат обучения и укажите наличие диплома колледжа.");
        return;
      }
    }
    if (currentStep === 3) {
      if (!selectedBudget || !desiredIncome || !futurePlans) {
        setError("Пожалуйста, заполните все поля.");
        return;
      }
    }
    setCurrentStep(s => s + 1);
  };

  const handlePrev = () => {
    setError("");
    setCurrentStep(s => s - 1);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Введите имя и номер телефона.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 11) {
      setError("Введите корректный номер: 8 (777) 777-77-77.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    const professionSummary = [
      `Направление: ${selectedField}`,
      `Формат: ${studyFormat}`,
      `Колледж: ${hasCollege ? "Да" : "Нет"}`,
      interests.length ? `Интересы: ${interests.join(", ")}` : null,
      `Планы: ${futurePlans}`,
      `Доход: ${desiredIncome}`,
    ].filter(Boolean).join(" | ");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          email: "",
          profession: professionSummary,
          budget: selectedBudget,
        }),
      });
      if (!res.ok) throw new Error("Ошибка при сохранении заявки");

      setSelectedField(""); setStudyFormat(""); setHasCollege(null); setInterests([]);
      setSelectedBudget(""); setDesiredIncome(""); setFuturePlans("");
      setName(""); setPhone(""); setCurrentStep(1);
      onLeadSubmitSuccess();
    } catch (err: any) {
      setError(err.message || "Не удалось отправить заявку. Попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { whyUs, whatWeDo, aboutUs } = dynamicBlocks;

  return (
    <div className="space-y-12 max-w-6xl mx-auto">

      {/* HERO & QUIZ */}
      <section
        className="relative bg-[#051F20] text-white rounded-[28px] p-5 md:p-10 shadow-2xl overflow-hidden border border-[#163832]/60"
        style={{ backgroundImage: 'linear-gradient(to right, rgba(5,31,32,0.96) 45%, rgba(11,43,38,0.7) 100%), url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop")' }}
      >
        <div className="absolute top-0 right-0 bg-[#8EB69B]/10 w-80 h-80 rounded-full blur-3xl -z-10" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">

          {/* Hero text */}
          <div className="lg:col-span-6 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8EB69B]/20 text-[#8EB69B] text-xs font-bold uppercase tracking-wider">
              Реестр ВУЗов Казахстана 2026
            </span>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              Найдите университет мечты за 5 минут
            </h1>
            <p className="text-[#E2F4E9]/85 text-sm leading-relaxed">
              Интерактивный навигатор по 100+ аккредитованным образовательным учреждениям РК. Вся информация верифицирована Министерством науки и высшего образования Казахстана.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onNavigateToCatalog}
                className="px-5 py-2.5 bg-[#235347] hover:bg-[#0B2B26] transition text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-md"
              >
                Открыть каталог ВУЗов
              </button>
              <div className="flex items-center text-[#8EB69B] text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-[#8EB69B] animate-pulse mr-2 block" />
                База данных ЕНТ-2026 обновлена
              </div>
            </div>
          </div>

          {/* QUIZ CARD */}
          <div className="lg:col-span-6 bg-white/95 backdrop-blur-md text-[#051F20] rounded-2xl p-5 shadow-2xl border border-[#8EB69B]/20">
            {/* Progress bar */}
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${i + 1 <= currentStep ? "bg-[#235347]" : "bg-[#E2F4E9]"}`}
                />
              ))}
            </div>
            <div className="text-[10px] font-bold text-[#235347]/60 uppercase tracking-wider mb-1">
              Шаг {currentStep} из {TOTAL_STEPS}
            </div>
            <h3 className="text-sm font-bold text-[#051F20] mb-0.5">Проф-экспресс тест</h3>
            <p className="text-xs text-[#163832]/60 mb-3 leading-relaxed">
              Ответьте на несколько вопросов — подберём подходящие университеты.
            </p>

            {error && (
              <div className="mb-3 p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            {/* STEP 1: Сфера деятельности */}
            {currentStep === 1 && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#051F20]">Какая сфера деятельности вас привлекает?</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {FIELD_OPTIONS.map(field => (
                    <button
                      key={field}
                      type="button"
                      onClick={() => setSelectedField(field)}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer leading-snug ${
                        selectedField === field
                          ? "bg-[#235347] text-white border-[#235347]"
                          : "bg-[#E2F4E9]/30 text-[#051F20] border-[#8EB69B]/20 hover:border-[#235347]/40"
                      }`}
                    >
                      {field}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full mt-1 py-2.5 bg-[#235347] hover:bg-[#0B2B26] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Далее
                </button>
              </div>
            )}

            {/* STEP 2: Формат + колледж + интересы */}
            {currentStep === 2 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-[#051F20]">Желаемый формат обучения</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {FORMAT_OPTIONS.map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setStudyFormat(f)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          studyFormat === f
                            ? "bg-[#235347] text-white border-[#235347]"
                            : "bg-[#E2F4E9]/30 text-[#051F20] border-[#8EB69B]/20 hover:border-[#235347]/40"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-[#051F20]">Есть ли диплом колледжа?</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(["Да", "Нет"] as const).map(label => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setHasCollege(label === "Да")}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          hasCollege === (label === "Да")
                            ? "bg-[#235347] text-white border-[#235347]"
                            : "bg-[#E2F4E9]/30 text-[#051F20] border-[#8EB69B]/20 hover:border-[#235347]/40"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-[#051F20]">
                    Дополнительные интересы{" "}
                    <span className="text-[#163832]/50 font-normal">(необязательно)</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {INTEREST_OPTIONS.map(interest => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                          interests.includes(interest)
                            ? "bg-[#235347] text-white border-[#235347]"
                            : "bg-[#E2F4E9]/30 text-[#051F20] border-[#8EB69B]/20 hover:border-[#235347]/40"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={handlePrev} className="w-1/3 py-2.5 bg-[#E2F4E9]/60 hover:bg-[#8EB69B]/30 text-[#051F20] rounded-xl text-xs font-bold transition cursor-pointer">
                    Назад
                  </button>
                  <button type="button" onClick={handleNext} className="w-2/3 py-2.5 bg-[#235347] hover:bg-[#0B2B26] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer">
                    Далее
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Бюджет + доход + планы */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#051F20]">Годовой бюджет на обучение</label>
                  <select
                    value={selectedBudget}
                    onChange={e => setSelectedBudget(e.target.value)}
                    className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:border-[#235347] rounded-xl px-3 py-2 text-xs text-[#051F20] outline-none transition"
                  >
                    <option value="">Выберите бюджет...</option>
                    {BUDGET_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#051F20]">Желаемый доход после обучения</label>
                  <select
                    value={desiredIncome}
                    onChange={e => setDesiredIncome(e.target.value)}
                    className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:border-[#235347] rounded-xl px-3 py-2 text-xs text-[#051F20] outline-none transition"
                  >
                    <option value="">Выберите уровень дохода...</option>
                    {INCOME_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-[#051F20]">Планы на будущее</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PLAN_OPTIONS.map(plan => (
                      <button
                        key={plan}
                        type="button"
                        onClick={() => setFuturePlans(plan)}
                        className={`text-left px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer leading-snug ${
                          futurePlans === plan
                            ? "bg-[#235347] text-white border-[#235347]"
                            : "bg-[#E2F4E9]/30 text-[#051F20] border-[#8EB69B]/20 hover:border-[#235347]/40"
                        }`}
                      >
                        {plan}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={handlePrev} className="w-1/3 py-2.5 bg-[#E2F4E9]/60 hover:bg-[#8EB69B]/30 text-[#051F20] rounded-xl text-xs font-bold transition cursor-pointer">
                    Назад
                  </button>
                  <button type="button" onClick={handleNext} className="w-2/3 py-2.5 bg-[#235347] hover:bg-[#0B2B26] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer">
                    Далее
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Контакты */}
            {currentStep === 4 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#051F20]">Ваше имя *</label>
                  <input
                    type="text"
                    placeholder="Алихан Ибрагимов"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:border-[#235347] focus:bg-white rounded-xl px-3 py-2.5 text-xs text-[#051F20] outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#051F20]">Номер телефона *</label>
                  <input
                    type="tel"
                    placeholder="8 (777) 777-77-77"
                    value={phone}
                    onChange={e => setPhone(formatPhone(e.target.value))}
                    className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:border-[#235347] focus:bg-white rounded-xl px-3 py-2.5 text-xs text-[#051F20] outline-none transition"
                  />
                  <p className="text-[10px] text-[#163832]/55">Укажите номер WhatsApp для связи</p>
                </div>

                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={handlePrev} className="w-1/3 py-2.5 bg-[#E2F4E9]/60 hover:bg-[#8EB69B]/30 text-[#051F20] rounded-xl text-xs font-bold transition cursor-pointer">
                    Назад
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-2/3 py-2.5 bg-[#235347] hover:bg-[#0B2B26] disabled:bg-[#235347]/50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center"
                  >
                    {isSubmitting ? "Отправка..." : "Получить подборку"}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* WHY CHOOSE US */}
      {whyUs && (
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-[#051F20] tracking-tight">{whyUs.title}</h2>
            <p className="text-[#163832]/80 text-sm leading-relaxed">{whyUs.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {whyUs.cards && whyUs.cards.map((card, idx) => (
              <div
                key={card.id}
                className="bg-white hover:bg-[#8EB69B]/10 hover:shadow-apple-hover transition-all duration-300 p-6 rounded-[20px] border border-[#8EB69B]/20 space-y-3 shadow-3xs"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E2F4E9] text-[#235347] flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <h4 className="text-sm font-bold text-[#051F20] leading-snug">{card.title}</h4>
                <p className="text-[#163832] text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WHAT WE DO */}
      {whatWeDo && (
        <section className="bg-white/80 rounded-[24px] p-6 md:p-9 border border-[#8EB69B]/20 space-y-6 shadow-3xs">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-lg font-bold text-[#051F20] tracking-tight">{whatWeDo.title}</h2>
            <p className="text-[#163832]/85 text-xs md:text-sm leading-relaxed">{whatWeDo.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {whatWeDo.items && whatWeDo.items.map(item => (
              <div key={item.id} className="bg-[#E2F4E9]/40 p-5 rounded-[16px] border border-[#8EB69B]/10 space-y-2">
                <span className="text-[#235347] text-[10px] font-bold uppercase tracking-widest block font-mono">
                  Верифицировано
                </span>
                <h4 className="text-sm font-bold text-[#051F20] leading-tight">{item.title}</h4>
                <p className="text-[#163832]/90 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT US */}
      {aboutUs && (
        <section className="bg-gradient-to-br from-[#051F20] to-[#0B2B26] text-white rounded-[24px] p-6 md:p-10 space-y-6 border border-[#163832]/80 shadow-2xl">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-lg font-bold text-white">{aboutUs.title}</h3>
            <p className="text-[#8EB69B] text-xs md:text-sm leading-relaxed">{aboutUs.text}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-2 border-t border-[#163832]/60">
            {aboutUs.stats && aboutUs.stats.map((stat, i) => (
              <div key={i} className="border-l-2 border-[#8EB69B] pl-3 space-y-1 py-1">
                <span className="text-xl md:text-3xl font-bold text-white block tracking-tight">{stat.value}</span>
                <span className="text-[#8EB69B]/85 text-[10px] md:text-xs block leading-tight font-semibold">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXTRA CMS SECTIONS — alternating image/text layout */}
      {dynamicBlocks.extraSections && dynamicBlocks.extraSections.length > 0 && dynamicBlocks.extraSections.map((sec, idx) => {
        const imageLeft = sec.imagePosition === "left";
        return (
          <section
            key={sec.id || idx}
            className={`rounded-[24px] overflow-hidden border border-[#8EB69B]/20 shadow-sm ${idx % 2 === 0 ? "bg-white" : "bg-[#E2F4E9]/30"}`}
          >
            <div className={`flex flex-col ${imageLeft ? "md:flex-row" : "md:flex-row-reverse"} min-h-[280px]`}>
              {/* Image side — 45% width */}
              <div className="md:w-[45%] shrink-0 relative overflow-hidden min-h-[200px] md:min-h-0">
                {sec.imageUrl ? (
                  <img
                    src={sec.imageUrl}
                    alt={sec.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={e => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = "none";
                      if (el.parentElement) el.parentElement.style.background = "#E2F4E9";
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E2F4E9] to-[#8EB69B]/30 flex items-center justify-center">
                    <span className="text-[#235347]/30 text-5xl font-black select-none">{idx + 1}</span>
                  </div>
                )}
                {/* Decorative overlay at junction */}
                <div className={`absolute inset-y-0 ${imageLeft ? "right-0" : "left-0"} w-12 hidden md:block`}
                  style={{ background: idx % 2 === 0 ? "linear-gradient(to right, transparent, white)" : "linear-gradient(to right, transparent, #e8f7ee)", transform: imageLeft ? "none" : "scaleX(-1)" }} />
              </div>

              {/* Text side — 55% width */}
              <div className="md:w-[55%] flex flex-col justify-center p-7 md:p-10 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-[#235347]" />
                  <span className="text-[10px] font-black text-[#235347] uppercase tracking-widest">Раздел {idx + 1}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-[#051F20] leading-tight">{sec.title}</h2>
                <p className="text-[#163832]/80 text-sm md:text-base leading-relaxed whitespace-pre-line">{sec.text}</p>
                <button
                  onClick={onNavigateToCatalog}
                  className="self-start px-5 py-2.5 bg-[#235347] hover:bg-[#051F20] text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm mt-2"
                >
                  Перейти в каталог
                </button>
              </div>
            </div>
          </section>
        );
      })}

    </div>
  );
}
