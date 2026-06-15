import React, { useState } from "react";
import { DynamicBlocks } from "../types";

interface MainScreenProps {
  dynamicBlocks: DynamicBlocks;
  onLeadSubmitSuccess: () => void;
  onNavigateToCatalog: () => void;
}

export default function MainScreen({ dynamicBlocks, onLeadSubmitSuccess, onNavigateToCatalog }: MainScreenProps) {
  // Quiz states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedProf, setSelectedProf] = useState("Не знаю / Нужна помощь");
  const [selectedBudget, setSelectedBudget] = useState("Грант / Бесплатно");
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Info & Questions, Step 2: Contact Details
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Booking consultation states
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookName, setBookName] = useState("");
  const [bookPhone, setBookPhone] = useState("");
  const [bookEmail, setBookEmail] = useState("");
  const [bookError, setBookError] = useState("");
  const [isBookSubmitting, setIsBookSubmitting] = useState(false);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName.trim() || !bookPhone.trim()) {
      setBookError("Пожалуйста, заполните имя и номер телефона!");
      return;
    }
    setBookError("");
    setIsBookSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookName,
          phone: bookPhone,
          email: bookEmail,
          profession: "Консультация с ментором (кнопка Записаться)",
          budget: "По согласованию"
        })
      });
      if (!response.ok) {
        throw new Error("Ошибка при сохранении заявки");
      }
      setBookName("");
      setBookPhone("");
      setBookEmail("");
      setIsBookingModalOpen(false);
      onLeadSubmitSuccess();
    } catch (err: any) {
      setBookError(err.message || "Ошибка соединения при отправке");
    } finally {
      setIsBookSubmitting(false);
    }
  };

  const professionsOptions = [
    "Не знаю / Нужна помощь",
    "IT / Программирование",
    "Медицина / Здравоохранение",
    "Педагогика / Преподавание",
    "Бизнес и Финансы",
    "Юриспруденция / Право",
    "Архитектура и Строительство",
    "Маркетинг и PR",
    "Естественные науки / Биотехнологии"
  ];

  const budgetOptions = [
    "Грант / Бесплатно",
    "800 000 - 1 000 000 ₸",
    "1 000 000 - 1 500 000 ₸",
    "1 500 000 - 2 000 000 ₸",
    "2 000 000 - 3 000 000 ₸",
    "Свыше 3 000 000 ₸"
  ];

  const handleNextQuizStep = () => {
    setCurrentStep(2);
  };

  const handlePrevQuizStep = () => {
    setCurrentStep(1);
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Пожалуйста, введите Ваше имя и контактный телефон.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          profession: selectedProf,
          budget: selectedBudget
        })
      });

      if (!response.ok) {
        throw new Error("Ошибка при сохранении заявки");
      }

      // Reset form and call success callback
      setName("");
      setPhone("");
      setEmail("");
      setSelectedProf("Не знаю / Нужна помощь");
      setSelectedBudget("Грант / Бесплатно");
      setCurrentStep(1);
      onLeadSubmitSuccess();
    } catch (err: any) {
      setError(err.message || "Не удалось отправить заявку. Попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { whyUs, whatWeDo, aboutUs } = dynamicBlocks;

  return (
    <div className="space-y-16 max-w-7xl mx-auto">
      
      {/* 1. HERO & INTERACTIVE LEAD-TEST */}
      <section 
        className="relative bg-[#051F20] text-white rounded-[32px] p-6 md:p-12 shadow-2xl overflow-hidden border border-[#163832]/60 bg-cover bg-center"
        style={{ backgroundImage: 'linear-gradient(to right, rgba(5,31,32,0.96) 45%, rgba(11,43,38,0.7) 100%), url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop")' }}
      >
        <div className="absolute top-0 right-0 bg-[#8EB69B]/10 w-96 h-96 rounded-full blur-3xl -z-10"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#8EB69B]/20 text-[#8EB69B] text-xs font-bold uppercase tracking-wider">
              Реестр ВУЗов Казахстана 2026
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Найдите университет мечты за 5 минут
            </h1>
            <p className="text-[#E2F4E9]/90 text-sm md:text-base leading-relaxed">
              Интерактивный навигатор по 100+ аккредитованным образовательным учреждениям РК. Вся информация верифицирована Министерством науки и высшего образования Казахстана.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={onNavigateToCatalog}
                className="px-6 py-3 bg-[#235347] hover:bg-[#0B2B26] transition text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-md inline-flex items-center"
              >
                Открыть каталог ВУЗов
              </button>
              <div className="flex items-center text-[#8EB69B] text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-[#8EB69B] animate-pulse mr-2 block"></span>
                <span>База данных ЕНТ-2026 обновлена</span>
              </div>
            </div>
          </div>

          {/* LEAD QUIZ CARD */}
          <div className="lg:col-span-6 bg-white/95 backdrop-blur-md text-[#051F20] rounded-3xl p-6 md:p-8 shadow-2xl relative border border-[#8EB69B]/20">
            <div className="absolute top-4 right-4 text-[10px] font-bold text-[#235347] bg-[#E2F4E9] px-2.5 py-1 rounded-full uppercase tracking-wider">
              Шаг {currentStep} из 2
            </div>
            
            <h3 className="text-lg font-bold text-[#051F20] mb-1 tracking-tight">Проф-экспресс тест</h3>
            <p className="text-xs text-[#163832]/80 mb-5 leading-relaxed">
              Пройдите короткий тест, и мы мгновенно подберем университеты по Вашему бюджету и целям поступления.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-650 border border-red-105 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleQuizSubmit} className="space-y-4">
              {currentStep === 1 ? (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#051F20]">
                      1. Какая профессия Вас интересует? *
                    </label>
                    <div className="relative">
                      <select
                        value={selectedProf}
                        onChange={(e) => setSelectedProf(e.target.value)}
                        className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:border-[#235347] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#051F20] outline-none cursor-pointer transition"
                      >
                        {professionsOptions.map((prof, i) => (
                          <option key={i} value={prof}>
                            {prof}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#051F20]">
                      2. Желаемый годовой бюджет на обучение? *
                    </label>
                    <div className="relative">
                      <select
                        value={selectedBudget}
                        onChange={(e) => setSelectedBudget(e.target.value)}
                        className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:border-[#235347] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#051F20] outline-none cursor-pointer transition"
                      >
                        {budgetOptions.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextQuizStep}
                    className="w-full mt-4 py-3 bg-[#235347] hover:bg-[#0B2B26] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    Далее к контактам
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#051F20]">
                        Ваше Имя *
                      </label>
                      <input
                        type="text"
                        placeholder="Алихан Ибрагимов"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:border-[#235347] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#051F20] outline-none transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#051F20]">
                        Контактный Телефон *
                      </label>
                      <input
                        type="tel"
                        placeholder="+7 (707) 123-4567"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:border-[#235347] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#051F20] outline-none transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#051F20]">
                        Электронная почта
                      </label>
                      <input
                        type="email"
                        placeholder="alihan@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:border-[#235347] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#051F20] outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handlePrevQuizStep}
                      className="w-1/3 py-3 bg-[#E2F4E9]/60 hover:bg-[#8EB69B]/30 text-[#051F20] rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Назад
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-2/3 py-3 bg-[#235347] hover:bg-[#0B2B26] disabled:bg-[#235347]/50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center"
                    >
                      {isSubmitting ? "Отправка..." : "Отправить"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>

        </div>
      </section>

      {/* 2. WHY CHOOSE US? */}
      {whyUs && (
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-[#051F20] tracking-tight">
              {whyUs.title}
            </h2>
            <p className="text-[#163832]/80 text-sm md:text-base leading-relaxed">
              {whyUs.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyUs.cards && whyUs.cards.map((card, idx) => (
              <div 
                key={card.id} 
                className="bg-white hover:bg-[#8EB69B]/10 hover:shadow-apple-hover transition-all duration-300 p-8 rounded-[24px] border border-[#8EB69B]/20 space-y-4 shadow-3xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E2F4E9] text-[#235347] flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <h4 className="text-base font-bold text-[#051F20] leading-snug">{card.title}</h4>
                <p className="text-[#163832] text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. WHAT WE DO? */}
      {whatWeDo && (
        <section className="bg-white/80 rounded-[32px] p-6 md:p-12 border border-[#8EB69B]/20 space-y-8 shadow-3xs">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl font-bold text-[#051F20] tracking-tight">{whatWeDo.title}</h2>
            <p className="text-[#163832]/85 text-xs md:text-sm leading-relaxed">{whatWeDo.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {whatWeDo.items && whatWeDo.items.map((item) => (
              <div key={item.id} className="bg-[#E2F4E9]/40 p-6 rounded-[20px] border border-[#8EB69B]/10 space-y-2.5">
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

      {/* 4. DON'T KNOW WHERE TO START? (Fixed content with 4-step route) */}
      <section className="border border-[#8EB69B]/20 bg-white rounded-[32px] p-6 md:p-10 space-y-8 shadow-3xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#8EB69B]/10 pb-6">
          <div className="space-y-2 md:max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#235347] bg-[#E2F4E9] px-2.5 py-1 rounded-full">
              Помощь менторов
            </span>
            <h3 className="text-xl font-bold text-[#051F20]">Не знаете, с чего начать?</h3>
            <p className="text-[#163832] text-xs md:text-sm leading-relaxed">
              Наш сайт — это энциклопедия, которая поможет сориентироваться на разных этапах поступления. Однако каждый кейс уникален. За индивидуальной консультацией обращайтесь напрямую к нашим менторам.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-5 py-3 bg-[#235347] hover:bg-[#0B2B26] transition text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer uppercase tracking-wider"
            >
              Записаться
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-[#235347]/65 uppercase tracking-widest text-center">Ваш Маршрут поступления</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-[#E2F4E9]/40 p-5 rounded-2xl relative overflow-hidden border border-[#8EB69B]/10">
              <span className="absolute -top-2 -right-2 text-4xl font-black text-[#8EB69B]/20 select-none">1</span>
              <h5 className="text-xs font-bold text-[#051F20] mb-1">Выберите страну</h5>
              <p className="text-[#163832]/70 text-xs leading-relaxed">Казахстан — динамично развивающийся рынок высшего образования.</p>
            </div>

            <div className="bg-[#E2F4E9]/40 p-5 rounded-2xl relative overflow-hidden border border-[#8EB69B]/10">
              <span className="absolute -top-2 -right-2 text-4xl font-black text-[#8EB69B]/20 select-none">2</span>
              <h5 className="text-xs font-bold text-[#051F20] mb-1">Подберите ВУЗ</h5>
              <p className="text-[#163832]/70 text-xs leading-relaxed">Воспользуйтесь обширными фильтрами в каталоге нашего портала.</p>
            </div>

            <div className="bg-[#E2F4E9]/40 p-5 rounded-2xl relative overflow-hidden border border-[#8EB69B]/10">
              <span className="absolute -top-2 -right-2 text-4xl font-black text-[#8EB69B]/20 select-none">3</span>
              <h5 className="text-xs font-bold text-[#051F20] mb-1">Изучите требования</h5>
              <p className="text-[#163832]/70 text-xs leading-relaxed">Сравните проходные баллы ЕНТ после школы или колледжа.</p>
            </div>

            <div className="bg-[#E2F4E9]/40 p-5 rounded-2xl relative overflow-hidden border border-[#8EB69B]/10">
              <span className="absolute -top-2 -right-2 text-4xl font-black text-[#8EB69B]/20 select-none">4</span>
              <h5 className="text-xs font-bold text-[#051F20] mb-1">Консультация</h5>
              <p className="text-[#163832]/70 text-xs leading-relaxed">Получите исчерпывающие ответы от экспертов платформы бесплатно.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. ABOUT US */}
      {aboutUs && (
        <section className="bg-gradient-to-br from-[#051F20] to-[#0B2B26] text-white rounded-[32px] p-8 md:p-12 space-y-8 border border-[#163832]/80 shadow-2xl">
          <div className="max-w-2xl space-y-3">
            <h3 className="text-xl md:text-2xl font-bold text-white">{aboutUs.title}</h3>
            <p className="text-[#8EB69B] text-xs md:text-sm leading-relaxed">{aboutUs.text}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2 border-t border-[#163832]/60">
            {aboutUs.stats && aboutUs.stats.map((stat, i) => (
              <div key={i} className="border-l-2 border-[#8EB69B] pl-4 space-y-1 py-1">
                <span className="text-2xl md:text-4xl font-bold text-white block tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[#8EB69B]/85 text-[10px] md:text-xs block leading-tight font-semibold">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONSULTATION BOOKING POPUP MODAL */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-[#051F20]/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-[32px] p-6 md:p-8 max-w-md w-full border border-[#8EB69B]/20 shadow-2xl relative space-y-5">
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-sm cursor-pointer w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 transition"
            >
              ✕
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2F4E9] text-[#235347] text-[10px] md:text-xs font-bold uppercase tracking-wider self-start">
              🚀 Запись на консультацию
            </span>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#051F20]">Записаться к ментору</h3>
              <p className="text-[#163832] text-xs leading-relaxed">
                Введите Ваши контакты. Наши научные кураторы свяжутся с вами в ближайшее время для разбора вашего кейса поступления.
              </p>
            </div>

            {bookError && (
              <div className="p-3 bg-red-50 text-red-650 border border-red-105 rounded-xl text-xs font-semibold">
                {bookError}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#051F20] block">Ваше Имя *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Например, Марат"
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                    className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:border-[#235347] focus:bg-white rounded-xl px-4 py-2 text-xs text-slate-800 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#051F20] block">Номер телефона *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="+7 (707) 123-4567"
                    value={bookPhone}
                    onChange={(e) => setBookPhone(e.target.value)}
                    className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:border-[#235347] focus:bg-white rounded-xl px-4 py-2 text-xs text-slate-800 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#051F20] block">Email (удобный адрес)</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="student@gmail.com"
                    value={bookEmail}
                    onChange={(e) => setBookEmail(e.target.value)}
                    className="w-full bg-[#E2F4E9]/30 border border-[#8EB69B]/20 focus:border-[#235347] focus:bg-white rounded-xl px-4 py-2 text-xs text-slate-800 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isBookSubmitting}
                className="w-full py-3 bg-[#235347] hover:bg-[#0B2B26] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center justify-center gap-2 mt-4 shadow-md"
              >
                {isBookSubmitting ? "Отправка..." : "Отправить заявку"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
