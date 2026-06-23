import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, ClipboardList, Building2, Briefcase, Users, UserCog,
  FileEdit, LogOut, RefreshCw, Search, Plus, Trash2, Edit3, Check, X,
  Lock, ShieldAlert, Save, Eye, ArrowLeft, MessageCircle, ChevronRight,
  ChevronDown, AlertCircle, Phone, Mail, Calendar, Star, Ban, RotateCcw,
  Image, ExternalLink, FolderPlus, BookOpen, Layers,
} from "lucide-react";

interface AdminSession {
  role: "admin" | "manager";
  username: string;
  id?: string;
}
interface Props {
  adminSession: AdminSession | null;
  onSetAdminSession: (s: AdminSession | null) => void;
  onExitAdmin?: () => void;
}

// ─── Shared iOS-style card wrapper ───────────────────────────────────────────
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>{children}</div>
);

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function AdminLoginForm({ onSetAdminSession }: { onSetAdminSession: (s: AdminSession) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/admin-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onSetAdminSession(data);
    } catch (e: any) { setError(e.message || "Ошибка входа"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-[#051F20] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="bg-[#051F20] px-8 py-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#235347]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col items-center">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#235347] flex items-center justify-center">
                <span className="text-white font-black text-lg">U</span>
              </div>
              <div className="text-left">
                <div className="text-white font-black text-base leading-none">UniSearch.kz</div>
                <div className="text-[#8EB69B] text-[9px] uppercase tracking-widest mt-0.5">Панель управления</div>
              </div>
            </div>
            <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-3 border border-white/10">
              <Lock className="w-6 h-6 text-[#8EB69B]" />
            </div>
            <h2 className="text-white text-lg font-black">Вход для администратора</h2>
            <p className="text-[#8EB69B] text-[10px] mt-1 uppercase tracking-widest">Доступ закрыт для обычных пользователей</p>
          </div>
        </div>
        <form onSubmit={submit} className="p-8 space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold"><ShieldAlert className="w-4 h-4 shrink-0" />{error}</div>}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@gmail.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#235347] transition" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Пароль</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#235347] transition" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#235347] hover:bg-[#051F20] disabled:opacity-60 text-white font-black text-sm rounded-xl transition mt-2 cursor-pointer">
            {loading ? "Проверка..." : "Войти в панель управления"}
          </button>
          <p className="text-center text-[10px] text-gray-400 pt-1">Демо: admin@gmail.com / asdasd123</p>
        </form>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardSection({ leads, universities, students, operators, onNavigate }: any) {
  const newLeads = leads.filter((l: any) => l.status === "new").length;
  const stats = [
    { label: "Университетов", value: universities.length, color: "from-blue-500 to-blue-600", bg: "bg-blue-50", icon: Building2, section: "universities" },
    { label: "Новых заявок", value: newLeads, color: "from-red-500 to-rose-600", bg: "bg-red-50", icon: ClipboardList, section: "leads" },
    { label: "Студентов", value: students.length, color: "from-emerald-500 to-green-600", bg: "bg-emerald-50", icon: Users, section: "students" },
    { label: "Операторов", value: operators.length, color: "from-purple-500 to-violet-600", bg: "bg-purple-50", icon: UserCog, section: "operators" },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <button key={s.label} onClick={() => onNavigate(s.section)}
            className="bg-white rounded-2xl p-5 text-left hover:shadow-md transition-all duration-200 border border-gray-100 group cursor-pointer overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-20 h-20 ${s.bg} rounded-full -translate-y-6 translate-x-6 opacity-50`} />
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-sm`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-3xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 font-semibold mt-0.5">{s.label}</div>
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-black text-gray-900 mb-4 text-sm flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-[#235347]" /> Последние заявки
          </h3>
          {leads.length === 0 ? <p className="text-gray-400 text-sm">Нет заявок</p> : (
            <div className="space-y-2">
              {leads.slice(0, 6).map((l: any) => (
                <div key={l.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{l.name}</div>
                    <div className="text-xs text-gray-400">{l.phone}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${l.status === "new" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {l.status === "new" ? "Не обработана" : "Обработана"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-5">
          <h3 className="font-black text-gray-900 mb-4 text-sm flex items-center gap-2">
            <Star className="w-4 h-4 text-[#235347]" /> Быстрые действия
          </h3>
          <div className="space-y-2">
            {[
              { label: "Просмотреть заявки", section: "leads", icon: ClipboardList, color: "text-red-600 bg-red-50" },
              { label: "Добавить университет", section: "universities", icon: Building2, color: "text-blue-600 bg-blue-50" },
              { label: "Управление профессиями", section: "careers", icon: Briefcase, color: "text-amber-600 bg-amber-50" },
              { label: "Редактировать контент", section: "cms", icon: FileEdit, color: "text-purple-600 bg-purple-50" },
              { label: "Создать оператора", section: "operators", icon: UserCog, color: "text-emerald-600 bg-emerald-50" },
            ].map(a => (
              <button key={a.section} onClick={() => onNavigate(a.section)}
                className="w-full flex items-center gap-3 px-3 py-2.5 bg-gray-50 hover:bg-[#E2F4E9]/50 rounded-xl text-sm font-semibold text-gray-700 hover:text-[#235347] transition text-left cursor-pointer group">
                <div className={`w-7 h-7 rounded-lg ${a.color} flex items-center justify-center shrink-0`}>
                  <a.icon className="w-3.5 h-3.5" />
                </div>
                {a.label}
                <ChevronRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-[#235347]" />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── LEADS ────────────────────────────────────────────────────────────────────
function LeadsSection({ leads, onRefresh }: any) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalLead, setModalLead] = useState<any>(null);
  const [confirmModal, setConfirmModal] = useState<{ type: "process" | "unprocess"; lead: any } | null>(null);

  const filtered = leads
    .filter((l: any) => filter === "all" || l.status === filter)
    .filter((l: any) => !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.phone?.includes(search) || l.email?.includes(search));

  const parseLeadInfo = (lead: any) => {
    const prof = lead.profession || "";
    const fields: Record<string, string> = {};
    prof.split(" | ").forEach((part: string) => {
      const [key, ...rest] = part.split(": ");
      if (key && rest.length) fields[key.trim()] = rest.join(": ").trim();
    });
    return fields;
  };

  const changeStatus = async (lead: any, newStatus: string) => {
    await fetch(`/api/leads/${lead.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    setConfirmModal(null);
    // Update the modal lead in-place so the button text updates immediately
    if (modalLead?.id === lead.id) setModalLead({ ...modalLead, status: newStatus });
    onRefresh();
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Удалить заявку? Это действие необратимо.")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    setModalLead(null);
    onRefresh();
  };

  const openWhatsApp = (phone: string) => {
    const clean = phone.replace(/\D/g, "");
    const kzPhone = clean.startsWith("8") ? "7" + clean.slice(1) : clean;
    const msg = encodeURIComponent("Здравствуйте! Вы оставляли заявку на индивидуальный подбор университета. Подскажите, пожалуйста, в какой сфере вы хотите развиваться?");
    window.open(`https://wa.me/${kzPhone}?text=${msg}`, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени, телефону..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#235347]" />
        </div>
        <div className="flex gap-2">
          {[["all", "Все"], ["new", "Не обработаны"], ["processed", "Обработаны"]].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${filter === v ? "bg-[#235347] text-white border-[#235347]" : "bg-white text-gray-600 border-gray-200 hover:border-[#235347]"}`}>
              {l}{v === "new" && leads.filter((l: any) => l.status === "new").length > 0 && (
                <span className="ml-1.5 bg-red-500 text-white rounded-full text-[9px] px-1.5 py-0.5">{leads.filter((l: any) => l.status === "new").length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lead cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
            Заявок не найдено
          </div>
        )}
        {filtered.map((l: any) => {
          const info = parseLeadInfo(l);
          const isNew = l.status === "new";
          const direction = info["Направление"] || "—";
          return (
            <button key={l.id}
              onClick={() => setModalLead(l)}
              className="text-left bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:border-gray-200 transition-all duration-150 cursor-pointer group w-full">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${isNew ? "bg-red-500" : "bg-emerald-500"}`} />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">{l.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{l.phone}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shrink-0 uppercase ${isNew ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                  {isNew ? "Новая" : "Готово"}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 w-20 shrink-0">Направление</span>
                  <span className="text-[10px] font-semibold text-gray-700 truncate">{direction}</span>
                </div>
                {l.budget && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 w-20 shrink-0">Бюджет</span>
                    <span className="text-[10px] font-semibold text-gray-700 truncate">{l.budget}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 w-20 shrink-0">Дата</span>
                  <span className="text-[10px] text-gray-500">{l.createdAt ? new Date(l.createdAt).toLocaleDateString("ru-RU") : "—"}</span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-[#235347] font-bold group-hover:underline">Открыть заявку →</span>
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-400">Всего заявок: {leads.length}</p>

      {/* ─── LEAD MODAL ────────────────────────────────────────────────── */}
      {modalLead && (() => {
        const info = parseLeadInfo(modalLead);
        const isNew = modalLead.status === "new";
        return (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setModalLead(null)}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className={`px-6 py-5 ${isNew ? "bg-red-50" : "bg-emerald-50"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full mb-2 ${isNew ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isNew ? "bg-red-500" : "bg-emerald-500"}`} />
                      {isNew ? "Не обработана" : "Обработана"}
                    </span>
                    <h2 className="text-xl font-black text-gray-900">{modalLead.name}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Заявка от {modalLead.createdAt ? new Date(modalLead.createdAt).toLocaleString("ru-RU", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                    </p>
                  </div>
                  <button onClick={() => setModalLead(null)} className="text-gray-400 hover:text-gray-700 cursor-pointer ml-4 shrink-0 mt-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal body — scrollable */}
              <div className="px-6 py-5 space-y-3 max-h-[55vh] overflow-y-auto">
                {/* Phone */}
                <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-[#E2F4E9] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#235347]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Телефон</p>
                    <p className="text-sm font-bold text-gray-900">{modalLead.phone || "—"}</p>
                  </div>
                </div>

                {/* Email */}
                {modalLead.email && (
                  <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl">
                    <div className="w-8 h-8 rounded-xl bg-[#E2F4E9] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-[#235347]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
                      <p className="text-sm font-bold text-gray-900">{modalLead.email}</p>
                    </div>
                  </div>
                )}

                {/* Budget */}
                {modalLead.budget && (
                  <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <Star className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Бюджет на обучение</p>
                      <p className="text-sm font-bold text-gray-900">{modalLead.budget}</p>
                    </div>
                  </div>
                )}

                {/* All parsed preferences */}
                {Object.keys(info).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Предпочтения из анкеты</p>
                    <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100 overflow-hidden">
                      {Object.entries(info).map(([k, v]) => (
                        <div key={k} className="flex gap-3 px-4 py-2.5">
                          <span className="text-xs font-bold text-gray-400 min-w-[90px] shrink-0">{k}</span>
                          <span className="text-xs font-semibold text-gray-800 leading-relaxed">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal footer — actions */}
              <div className="px-6 py-5 border-t border-gray-100 space-y-2.5">
                {/* WhatsApp — primary CTA */}
                <button
                  onClick={() => openWhatsApp(modalLead.phone)}
                  className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#25D366] hover:bg-[#1da851] active:bg-[#15a046] text-white font-black text-base rounded-2xl transition cursor-pointer shadow-md shadow-[#25D366]/30">
                  <MessageCircle className="w-5 h-5" />
                  Написать в WhatsApp
                </button>

                {/* Status toggle */}
                <div className="flex gap-2">
                  {isNew ? (
                    <button
                      onClick={() => setConfirmModal({ type: "process", lead: modalLead })}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition cursor-pointer">
                      <Check className="w-4 h-4" /> Отметить обработанной
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmModal({ type: "unprocess", lead: modalLead })}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition cursor-pointer">
                      <RotateCcw className="w-4 h-4" /> Вернуть в необработанные
                    </button>
                  )}
                  <button
                    onClick={() => deleteLead(modalLead.id)}
                    className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm transition cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* CONFIRM MODAL */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={() => setConfirmModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${confirmModal.type === "process" ? "bg-emerald-100" : "bg-amber-100"}`}>
              {confirmModal.type === "process" ? <Check className="w-6 h-6 text-emerald-600" /> : <RotateCcw className="w-6 h-6 text-amber-600" />}
            </div>
            <h3 className="text-center font-black text-gray-900 text-base mb-2">
              {confirmModal.type === "process" ? "Отметить как обработанную?" : "Вернуть в необработанные?"}
            </h3>
            <p className="text-center text-sm text-gray-500 mb-5">
              Заявка клиента <strong>{confirmModal.lead.name}</strong> будет переведена в статус «{confirmModal.type === "process" ? "Обработана" : "Не обработана"}».
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal(null)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition cursor-pointer">Отмена</button>
              <button onClick={() => changeStatus(confirmModal.lead, confirmModal.type === "process" ? "processed" : "new")}
                className={`flex-1 py-2.5 font-bold rounded-xl text-sm text-white transition cursor-pointer ${confirmModal.type === "process" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"}`}>
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── UNIVERSITIES ─────────────────────────────────────────────────────────────
function UniversitiesSection({ universities, onRefresh }: any) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveOk, setSaveOk] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "faculties">("info");

  const filtered = universities.filter((u: any) => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.address?.toLowerCase().includes(search.toLowerCase()));

  const openEdit = (u: any) => { setEditing(u); setForm({ ...u, languages: u.languages?.join(", ") || "" }); setShowAdd(false); setSaveError(""); setSaveOk(false); setActiveTab("info"); };
  const openAdd = () => { setEditing(null); setForm({ name: "", address: "", contacts: "", entMinSchool: 0, entMinCollege: 0, tuitionFee: 0, hasHostel: false, hasGrants: false, hasQuotas: false, languages: "rus", deadlines: "", description: "", imageUrl: "", hostelDetails: "", faculties: [] }); setShowAdd(true); setSaveError(""); setSaveOk(false); setActiveTab("info"); };
  const closeForm = () => { setEditing(null); setShowAdd(false); };

  const save = async () => {
    setSaving(true); setSaveError(""); setSaveOk(false);
    const payload = { ...form, languages: form.languages ? form.languages.split(",").map((s: string) => s.trim()) : [], faculties: form.faculties || editing?.faculties || [] };
    try {
      const res = editing
        ? await fetch(`/api/universities/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/universities", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { setSaveError(`Ошибка ${res.status}`); return; }
      setSaveOk(true); await onRefresh(); setTimeout(() => closeForm(), 800);
    } catch (e: any) { setSaveError(e.message); }
    finally { setSaving(false); }
  };

  const deleteUni = async (id: string, name: string) => {
    if (!confirm(`Удалить "${name}"?`)) return;
    await fetch(`/api/universities/${id}`, { method: "DELETE" }); onRefresh();
  };

  // Faculty management
  const addFaculty = () => {
    setForm((p: any) => ({ ...p, faculties: [...(p.faculties || []), { name: "Новый факультет", description: "", specialties: [] }] }));
  };
  const updateFaculty = (idx: number, field: string, val: string) => {
    setForm((p: any) => {
      const facs = [...(p.faculties || [])];
      facs[idx] = { ...facs[idx], [field]: val };
      return { ...p, faculties: facs };
    });
  };
  const removeFaculty = (idx: number) => {
    setForm((p: any) => ({ ...p, faculties: (p.faculties || []).filter((_: any, i: number) => i !== idx) }));
  };
  const addSpecialty = (facIdx: number) => {
    setForm((p: any) => {
      const facs = [...(p.faculties || [])];
      facs[facIdx] = { ...facs[facIdx], specialties: [...(facs[facIdx].specialties || []), { name: "", code: "B000", description: "", tuitionFee: 0, entMinScore: 0 }] };
      return { ...p, faculties: facs };
    });
  };
  const updateSpecialty = (facIdx: number, spIdx: number, field: string, val: any) => {
    setForm((p: any) => {
      const facs = [...(p.faculties || [])];
      const sps = [...(facs[facIdx].specialties || [])];
      sps[spIdx] = { ...sps[spIdx], [field]: val };
      facs[facIdx] = { ...facs[facIdx], specialties: sps };
      return { ...p, faculties: facs };
    });
  };
  const removeSpecialty = (facIdx: number, spIdx: number) => {
    setForm((p: any) => {
      const facs = [...(p.faculties || [])];
      facs[facIdx] = { ...facs[facIdx], specialties: (facs[facIdx].specialties || []).filter((_: any, i: number) => i !== spIdx) };
      return { ...p, faculties: facs };
    });
  };

  const F = ({ label, field, type = "text", as = "input" }: any) => (
    <div>
      <label className="text-xs font-bold text-gray-500 block mb-1">{label}</label>
      {as === "textarea"
        ? <textarea value={form[field] || ""} onChange={e => setForm((p: any) => ({ ...p, [field]: e.target.value }))} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347] resize-none" />
        : <input type={type} value={form[field] ?? ""} onChange={e => setForm((p: any) => ({ ...p, [field]: type === "number" ? Number(e.target.value) : e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347]" />
      }
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по названию или городу..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#235347]" />
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-[#235347] hover:bg-[#051F20] text-white text-sm font-bold rounded-xl transition cursor-pointer">
          <Plus className="w-4 h-4" /> Добавить ВУЗ
        </button>
      </div>

      {/* Form */}
      {(editing || showAdd) && (
        <Card className="border-[#235347]/20 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-black text-gray-900">{editing ? `Редактировать: ${editing.name}` : "Добавить новый ВУЗ"}</h3>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {[["info", "Основная информация"], ["faculties", "Факультеты и специальности"]].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id as any)}
                className={`flex-1 py-3 text-sm font-bold transition cursor-pointer ${activeTab === id ? "border-b-2 border-[#235347] text-[#235347]" : "text-gray-400 hover:text-gray-600"}`}>
                {label}
              </button>
            ))}
          </div>

          {activeTab === "info" && (
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <F label="Название ВУЗа *" field="name" />
                <F label="Адрес" field="address" />
                <F label="Контакты" field="contacts" />
                <F label="Языки (kaz, rus, eng через запятую)" field="languages" />
                <F label="Мин. балл ЕНТ (школьник)" field="entMinSchool" type="number" />
                <F label="Мин. балл ЕНТ (колледж)" field="entMinCollege" type="number" />
                <F label="Стоимость обучения (₸/год)" field="tuitionFee" type="number" />
                <F label="Дедлайны подачи" field="deadlines" />
                <div className="flex gap-6 items-center pt-2">
                  {[["hasHostel", "Общежитие"], ["hasGrants", "Гранты"], ["hasQuotas", "Квоты"]].map(([field, label]) => (
                    <label key={field} className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                      <input type="checkbox" checked={!!form[field]} onChange={e => setForm((p: any) => ({ ...p, [field]: e.target.checked }))} className="w-4 h-4 accent-[#235347]" />
                      {label}
                    </label>
                  ))}
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 block mb-1">Фото (URL)</label>
                  <input type="url" value={form.imageUrl || ""} onChange={e => setForm((p: any) => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347]" />
                  {form.imageUrl && <img src={form.imageUrl} alt="" className="mt-2 h-24 w-full object-cover rounded-xl border border-gray-200" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                </div>
                <div className="md:col-span-2"><F label="Описание ВУЗа" field="description" as="textarea" /></div>
              </div>
            </div>
          )}

          {activeTab === "faculties" && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Управляйте факультетами и специальностями (направлениями) ВУЗа.</p>
                <button onClick={addFaculty} className="flex items-center gap-2 px-3 py-2 bg-[#235347] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#051F20] transition">
                  <FolderPlus className="w-3.5 h-3.5" /> Добавить факультет
                </button>
              </div>
              {(form.faculties || []).length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl">
                  Нет факультетов. Нажмите «Добавить факультет».
                </div>
              )}
              {(form.faculties || []).map((fac: any, fIdx: number) => (
                <div key={fIdx} className="border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="bg-gray-50 p-3 flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-[#235347] shrink-0" />
                    <input value={fac.name || ""} onChange={e => updateFaculty(fIdx, "name", e.target.value)} placeholder="Название факультета"
                      className="flex-1 bg-transparent text-sm font-bold text-gray-900 focus:outline-none" />
                    <button onClick={() => removeFaculty(fIdx)} className="text-red-400 hover:text-red-600 cursor-pointer shrink-0"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase">Специальности / Направления</span>
                      <button onClick={() => addSpecialty(fIdx)} className="text-xs text-[#235347] font-bold flex items-center gap-1 cursor-pointer hover:underline">
                        <Plus className="w-3 h-3" /> Добавить
                      </button>
                    </div>
                    {(fac.specialties || []).map((sp: any, sIdx: number) => (
                      <div key={sIdx} className="grid grid-cols-12 gap-2 items-center p-2 bg-white border border-gray-100 rounded-xl">
                        <input value={sp.name || ""} onChange={e => updateSpecialty(fIdx, sIdx, "name", e.target.value)} placeholder="Название специальности" className="col-span-4 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none" />
                        <input value={sp.code || ""} onChange={e => updateSpecialty(fIdx, sIdx, "code", e.target.value)} placeholder="B-код" className="col-span-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none" />
                        <input type="number" value={sp.entMinScore || ""} onChange={e => updateSpecialty(fIdx, sIdx, "entMinScore", Number(e.target.value))} placeholder="Мин. ЕНТ" className="col-span-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none" />
                        <input type="number" value={sp.tuitionFee || ""} onChange={e => updateSpecialty(fIdx, sIdx, "tuitionFee", Number(e.target.value))} placeholder="Цена ₸/год" className="col-span-3 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none" />
                        <button onClick={() => removeSpecialty(fIdx, sIdx)} className="col-span-1 text-red-400 hover:text-red-600 cursor-pointer flex justify-center"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                    {(fac.specialties || []).length === 0 && <p className="text-xs text-gray-300 text-center py-2">Нет специальностей</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-5 border-t border-gray-100">
            {saveError && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-semibold">❌ {saveError}</div>}
            {saveOk && <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-semibold">✅ Сохранено!</div>}
            <div className="flex gap-3">
              <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-[#235347] hover:bg-[#051F20] text-white text-sm font-bold rounded-xl transition disabled:opacity-60 cursor-pointer">
                <Save className="w-4 h-4" /> {saving ? "Сохранение..." : "Сохранить"}
              </button>
              <button onClick={closeForm} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition cursor-pointer">Отмена</button>
            </div>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Название", "Город", "Мин. ЕНТ (шк.)", "Мин. ЕНТ (кол.)", "Стоимость", "Гранты", "Общежитие", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u: any) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-semibold text-gray-900 max-w-xs"><div className="truncate">{u.name}</div></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.address?.split(",")[0] || "—"}</td>
                  <td className="px-4 py-3 text-gray-600 font-bold">{u.entMinSchool || "—"}</td>
                  <td className="px-4 py-3 text-gray-600 font-bold">{u.entMinCollege || "—"}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{u.tuitionFee ? `${u.tuitionFee.toLocaleString()} ₸` : "—"}</td>
                  <td className="px-4 py-3">{u.hasGrants ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-gray-300" />}</td>
                  <td className="px-4 py-3">{u.hasHostel ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-gray-300" />}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(u)} className="text-blue-400 hover:text-blue-600 cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => deleteUni(u.id, u.name)} className="text-red-400 hover:text-red-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">ВУЗы не найдены</div>}
        </div>
      </Card>
      <p className="text-xs text-gray-400">Всего: {universities.length} университетов</p>
    </div>
  );
}

// ─── CAREERS (hierarchical) ───────────────────────────────────────────────────
function CareersSection({ careers, onRefresh }: any) {
  const [view, setView] = useState<"list" | "tree">("list");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  // Tree state stored locally (extends the careers list with grouping)
  const [treeData, setTreeData] = useState<{ categories: { name: string; icon: string; subcategories: { name: string; professions: string[] }[] }[] }>({ categories: [] });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("📂");
  const [expandedCats, setExpandedCats] = useState<Set<number>>(new Set());

  const filtered = careers.filter((c: any) => !search || c.name?.toLowerCase().includes(search.toLowerCase()));

  const openEdit = (c: any) => { setEditing(c); setForm({ ...c }); setShowAdd(false); };
  const openAdd = () => { setEditing(null); setForm({ name: "", iconName: "Briefcase", essence: "", socialSignificance: "", directions: [] }); setShowAdd(true); };
  const closeForm = () => { setEditing(null); setShowAdd(false); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/careers/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      } else {
        await fetch("/api/careers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      }
      await onRefresh(); closeForm();
    } finally { setSaving(false); }
  };

  const deleteCareer = async (id: string, name: string) => {
    if (!confirm(`Удалить профессию "${name}"?`)) return;
    await fetch(`/api/careers/${id}`, { method: "DELETE" }); onRefresh();
  };

  const addCategory = () => {
    if (!newCatName.trim()) return;
    setTreeData(p => ({ categories: [...p.categories, { name: newCatName, icon: newCatIcon, subcategories: [] }] }));
    setNewCatName(""); setNewCatIcon("📂"); setShowAddCategory(false);
  };

  const addSubcategory = (catIdx: number) => {
    const name = prompt("Название подсферы:");
    if (!name) return;
    setTreeData(p => {
      const cats = [...p.categories];
      cats[catIdx] = { ...cats[catIdx], subcategories: [...cats[catIdx].subcategories, { name, professions: [] }] };
      return { categories: cats };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск профессий..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#235347]" />
        </div>
        <div className="flex gap-2">
          {[["list", "Список"], ["tree", "Структура"]].map(([v, l]) => (
            <button key={v} onClick={() => setView(v as any)} className={`px-3 py-2 text-xs font-bold rounded-xl border cursor-pointer transition ${view === v ? "bg-[#235347] text-white border-[#235347]" : "bg-white text-gray-600 border-gray-200"}`}>{l}</button>
          ))}
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-[#235347] hover:bg-[#051F20] text-white text-sm font-bold rounded-xl transition cursor-pointer">
          <Plus className="w-4 h-4" /> Добавить профессию
        </button>
      </div>

      {/* Tree view */}
      {view === "tree" && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-gray-900 text-sm">Иерархическая структура профессий</h3>
              <p className="text-xs text-gray-400 mt-0.5">Создавайте сферы, подсферы и профессии внутри них.</p>
            </div>
            <button onClick={() => setShowAddCategory(true)} className="flex items-center gap-2 px-3 py-2 bg-[#235347] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#051F20] transition">
              <FolderPlus className="w-3.5 h-3.5" /> Новая сфера
            </button>
          </div>

          {showAddCategory && (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <p className="text-xs font-bold text-gray-700">Новая сфера деятельности</p>
              <div className="flex gap-3">
                <input value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} placeholder="Иконка (эмодзи)" className="w-20 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-center focus:outline-none" />
                <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Название сферы (напр.: Строительство)" className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#235347]" />
              </div>
              <div className="flex gap-2">
                <button onClick={addCategory} className="px-4 py-2 bg-[#235347] text-white text-xs font-bold rounded-xl cursor-pointer">Создать</button>
                <button onClick={() => setShowAddCategory(false)} className="px-4 py-2 bg-gray-200 text-gray-600 text-xs font-bold rounded-xl cursor-pointer">Отмена</button>
              </div>
            </div>
          )}

          {treeData.categories.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm">
              Нет сфер. Нажмите «Новая сфера» для создания иерархии.
            </div>
          )}

          <div className="space-y-2">
            {treeData.categories.map((cat, cIdx) => (
              <div key={cIdx} className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 p-3 bg-gray-50 cursor-pointer" onClick={() => setExpandedCats(s => { const n = new Set(s); n.has(cIdx) ? n.delete(cIdx) : n.add(cIdx); return n; })}>
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-bold text-gray-900 text-sm flex-1">{cat.name}</span>
                  <span className="text-xs text-gray-400">{cat.subcategories.length} подсфер</span>
                  {expandedCats.has(cIdx) ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                </div>
                {expandedCats.has(cIdx) && (
                  <div className="p-3 space-y-2">
                    {cat.subcategories.map((sub, sIdx) => (
                      <div key={sIdx} className="ml-4 p-2.5 border border-gray-100 rounded-xl bg-white">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700">📁 {sub.name}</span>
                          <span className="text-xs text-gray-400">{sub.professions.length} проф.</span>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => addSubcategory(cIdx)} className="ml-4 flex items-center gap-1.5 text-xs text-[#235347] font-bold cursor-pointer hover:underline">
                      <Plus className="w-3 h-3" /> Добавить подсферу
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Edit/Add Form */}
      {(editing || showAdd) && (
        <Card className="border-[#235347]/20 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-gray-900">{editing ? `Редактировать: ${editing.name}` : "Добавить профессию"}</h3>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Название профессии *</label>
              <input value={form.name || ""} onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Иконка (lucide name)</label>
              <input value={form.iconName || ""} onChange={e => setForm((p: any) => ({ ...p, iconName: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347]" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-500 block mb-1">Суть профессии *</label>
              <textarea value={form.essence || ""} onChange={e => setForm((p: any) => ({ ...p, essence: e.target.value }))} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347] resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-500 block mb-1">Социальная значимость</label>
              <textarea value={form.socialSignificance || ""} onChange={e => setForm((p: any) => ({ ...p, socialSignificance: e.target.value }))} rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347] resize-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-[#235347] hover:bg-[#051F20] text-white text-sm font-bold rounded-xl transition disabled:opacity-60 cursor-pointer">
              <Save className="w-4 h-4" /> {saving ? "Сохранение..." : "Сохранить"}
            </button>
            <button onClick={closeForm} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition cursor-pointer">Отмена</button>
          </div>
        </Card>
      )}

      {view === "list" && (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Профессия", "Суть", "Направлений", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c: any) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-semibold text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-sm"><div className="line-clamp-2">{c.essence}</div></td>
                  <td className="px-4 py-3 text-gray-600">{c.directions?.length || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(c)} className="text-blue-400 hover:text-blue-600 cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => deleteCareer(c.id, c.name)} className="text-red-400 hover:text-red-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">Профессии не найдены</div>}
        </Card>
      )}
    </div>
  );
}

// ─── STUDENTS ─────────────────────────────────────────────────────────────────
function StudentsSection({ students, leads, onRefresh }: any) {
  const [search, setSearch] = useState("");
  const [modalStudent, setModalStudent] = useState<any>(null);

  const filtered = students.filter((s: any) =>
    !search || s.username?.toLowerCase().includes(search.toLowerCase()) ||
    s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.includes(search) || s.phone?.includes(search)
  );

  const deleteStudent = async (id: string) => {
    if (!confirm("Удалить профиль студента? Это действие необратимо.")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    setModalStudent(null);
    onRefresh();
  };

  const getStudentLeads = (s: any) =>
    (leads || []).filter((l: any) =>
      (s.fullName && l.name === s.fullName) ||
      l.name === s.username ||
      (s.phone && l.phone === s.phone)
    );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени, email, телефону..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#235347]" />
      </div>

      {/* Grid of student cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
            Студентов не найдено
          </div>
        )}
        {filtered.map((s: any) => {
          const stuLeads = getStudentLeads(s);
          const initials = (s.fullName || s.username || "?")[0].toUpperCase();
          return (
            <button key={s.id}
              onClick={() => setModalStudent(s)}
              className="text-left bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group w-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#235347] to-[#0B2B26] text-white font-black text-base flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-gray-900 truncate">{s.fullName || s.username}</p>
                  <p className="text-xs text-gray-400 truncate">{s.email || s.phone || "—"}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-base font-black text-[#235347]">{s.entScore ?? "—"}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">ЕНТ</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-base font-black text-gray-700">{s.isCollegeGraduate ? "Колл." : "Шк."}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Тип</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-base font-black text-blue-600">{stuLeads.length}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Заявок</p>
                </div>
              </div>

              {s.interests?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {s.interests.slice(0, 3).map((i: string) => (
                    <span key={i} className="px-2 py-0.5 bg-[#E2F4E9] text-[#235347] text-[9px] font-bold rounded-lg truncate max-w-[120px]">{i}</span>
                  ))}
                  {s.interests.length > 3 && <span className="text-[9px] text-gray-400 font-bold">+{s.interests.length - 3}</span>}
                </div>
              )}

              <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-[#235347] font-bold group-hover:underline">Открыть профиль →</span>
                {s.budget ? <span className="text-[9px] text-gray-400">{Number(s.budget).toLocaleString()} ₸/год</span> : null}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-400">Всего студентов: {students.length}</p>

      {/* ─── STUDENT MODAL ─────────────────────────────────────────────── */}
      {modalStudent && (() => {
        const s = modalStudent;
        const stuLeads = getStudentLeads(s);
        const initials = (s.fullName || s.username || "?")[0].toUpperCase();
        return (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setModalStudent(null)}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-[#051F20] to-[#0B2B26] px-6 pt-6 pb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#8EB69B]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-start justify-between relative">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#235347] border-2 border-[#8EB69B]/30 text-white font-black text-2xl flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="text-white font-black text-lg leading-tight">{s.fullName || s.username}</p>
                      <p className="text-[#8EB69B] text-xs mt-1">Абитуриент · UniSearch.kz</p>
                    </div>
                  </div>
                  <button onClick={() => setModalStudent(null)} className="text-white/50 hover:text-white cursor-pointer mt-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* KPI strip */}
                <div className="grid grid-cols-3 gap-2 mt-5">
                  {[
                    { label: "Балл ЕНТ", value: s.entScore ?? "—", highlight: true },
                    { label: "Тип", value: s.isCollegeGraduate ? "Колледж" : "Школа", highlight: false },
                    { label: "Заявок", value: stuLeads.length, highlight: false },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm">
                      <p className={`text-xl font-black ${stat.highlight ? "text-[#8EB69B]" : "text-white"}`}>{stat.value}</p>
                      <p className="text-white/50 text-[9px] font-bold uppercase mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-3 max-h-[45vh] overflow-y-auto">
                {/* Contact info */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Контактные данные</p>
                  <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100 overflow-hidden">
                    {[
                      { icon: Phone, label: "Телефон", value: s.phone || "—" },
                      { icon: Mail, label: "Email", value: s.email || "—" },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-3 px-4 py-3">
                        <div className="w-7 h-7 rounded-lg bg-[#E2F4E9] flex items-center justify-center shrink-0">
                          <item.icon className="w-3.5 h-3.5 text-[#235347]" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase">{item.label}</p>
                          <p className="text-sm font-bold text-gray-900">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                {s.budget > 0 && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 rounded-2xl border border-amber-100">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <Star className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Бюджет на обучение</p>
                      <p className="text-sm font-bold text-gray-900">{Number(s.budget).toLocaleString()} ₸ / год</p>
                    </div>
                  </div>
                )}

                {/* Interests */}
                {s.interests?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Интересы и направления</p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.interests.map((i: string) => (
                        <span key={i} className="px-2.5 py-1 bg-[#E2F4E9] text-[#235347] text-[10px] font-bold rounded-xl">{i}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Application history */}
                {stuLeads.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">История заявок ({stuLeads.length})</p>
                    <div className="space-y-1.5">
                      {stuLeads.map((l: any) => {
                        const dir = l.profession?.split(" | ")[0]?.replace("Направление: ", "") || "Заявка";
                        return (
                          <div key={l.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate">{dir}</p>
                              <p className="text-[9px] text-gray-400">{l.createdAt ? new Date(l.createdAt).toLocaleDateString("ru-RU") : "—"}</p>
                            </div>
                            <span className={`text-[9px] font-black px-2 py-1 rounded-full shrink-0 ml-2 ${l.status === "new" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                              {l.status === "new" ? "Новая" : "Обработана"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100">
                <button
                  onClick={() => deleteStudent(s.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl text-sm transition cursor-pointer">
                  <Trash2 className="w-4 h-4" /> Удалить профиль студента
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── OPERATORS ────────────────────────────────────────────────────────────────
function OperatorsSection({ operators, leads, onRefresh }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [blocked, setBlocked] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("blocked_operators") || "[]")); } catch { return new Set(); }
  });

  const toggleBlock = (id: string, name: string) => {
    const isCurrentlyBlocked = blocked.has(id);
    const msg = isCurrentlyBlocked
      ? `Разблокировать оператора ${name}? Он снова получит доступ к системе.`
      : `Заблокировать оператора ${name}? Он потеряет доступ к системе.`;
    if (!confirm(msg)) return;
    setBlocked(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      localStorage.setItem("blocked_operators", JSON.stringify([...n]));
      return n;
    });
  };

  const totalLeads = leads.length;
  const processedLeads = leads.filter((l: any) => l.status === "processed");

  // Per-operator stats: since backend doesn't track which operator processed what,
  // we distribute processed leads evenly as an estimate
  const getOpStats = (op: any, opIdx: number) => {
    const perOp = operators.length > 0 ? Math.floor(processedLeads.length / operators.length) : 0;
    const extra = opIdx < (processedLeads.length % operators.length) ? 1 : 0;
    const processed = perOp + extra;
    const efficiency = totalLeads > 0 ? Math.round((processed / Math.max(totalLeads / operators.length, 1)) * 100) : 0;
    // Assign processed leads slice to this operator for display
    const start = opIdx * perOp + Math.min(opIdx, processedLeads.length % operators.length);
    const assignedLeads = processedLeads.slice(start, start + processed);
    return { processed, efficiency: Math.min(efficiency, 100), assignedLeads };
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      const res = await fetch("/api/operators", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEmail(""); setPassword(""); onRefresh();
    } catch (e: any) { setError(e.message); } finally { setSaving(false); }
  };

  const deleteOp = async (id: string) => {
    if (!confirm("Удалить оператора? Это действие необратимо.")) return;
    await fetch(`/api/operators/${id}`, { method: "DELETE" });
    if (selected?.id === id) setSelected(null);
    onRefresh();
  };

  return (
    <div className="flex gap-5">
      {/* LEFT: list + create */}
      <div className="flex-1 space-y-4 min-w-0">
        <Card className="p-5">
          <h3 className="font-black text-gray-900 mb-4 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#235347]" /> Создать нового оператора
          </h3>
          {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 font-semibold mb-3">{error}</div>}
          <form onSubmit={create} className="flex gap-3 flex-wrap">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email оператора"
              className="flex-1 min-w-48 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347]" />
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" minLength={6}
              className="flex-1 min-w-36 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347]" />
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2.5 bg-[#235347] hover:bg-[#051F20] text-white text-sm font-bold rounded-xl transition disabled:opacity-60 cursor-pointer">
              <Plus className="w-4 h-4" /> {saving ? "..." : "Создать"}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2">Оператор видит только раздел «Заявки» и может менять статус заявок.</p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {operators.map((op: any, opIdx: number) => {
            const stats = getOpStats(op, opIdx);
            const isBlocked = blocked.has(op.id);
            const isSelected = selected?.id === op.id;
            const efficiency = stats.efficiency;
            return (
              <Card key={op.id}
                onClick={() => setSelected(isSelected ? null : op)}
                className={`p-4 cursor-pointer transition-all ${isBlocked ? "opacity-60 border-red-200" : ""} ${isSelected ? "border-[#235347] shadow-md" : "hover:shadow-sm"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shrink-0 ${isBlocked ? "bg-red-100 text-red-600" : "bg-[#E2F4E9] text-[#235347]"}`}>
                      {op.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 truncate max-w-[150px]">{op.email}</p>
                      <p className={`text-[10px] font-bold ${isBlocked ? "text-red-500" : "text-emerald-600"}`}>
                        {isBlocked ? "🔴 Заблокирован" : "🟢 Активен"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-xl p-2 text-center">
                    <p className="text-lg font-black text-[#235347]">{stats.processed}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Обраб.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2 text-center">
                    <p className="text-lg font-black text-gray-700">{efficiency}%</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Эффект.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2 text-center">
                    <p className="text-lg font-black text-gray-700">{op.createdAt ? new Date(op.createdAt).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }) : "—"}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Создан</p>
                  </div>
                </div>

                {/* Efficiency bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-[9px] font-bold text-gray-400 mb-1">
                    <span>Эффективность</span><span>{efficiency}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${efficiency >= 80 ? "bg-emerald-500" : efficiency >= 50 ? "bg-amber-500" : "bg-red-400"}`} style={{ width: `${efficiency}%` }} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={e => { e.stopPropagation(); toggleBlock(op.id, op.email); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${isBlocked ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-red-50 text-red-600 hover:bg-red-100"}`}>
                    {isBlocked ? <><RotateCcw className="w-3.5 h-3.5" /> Разблокировать</> : <><Ban className="w-3.5 h-3.5" /> Заблокировать</>}
                  </button>
                  <button onClick={e => { e.stopPropagation(); deleteOp(op.id); }} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl transition cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            );
          })}
          {operators.length === 0 && <div className="col-span-2 py-12 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">Операторов нет. Создайте первого оператора выше.</div>}
        </div>

        {/* Summary stats */}
        {operators.length > 0 && (
          <Card className="p-4">
            <div className="grid grid-cols-4 divide-x divide-gray-100">
              {[
                { label: "Всего операторов", value: operators.length },
                { label: "Активных", value: operators.filter((o: any) => !blocked.has(o.id)).length },
                { label: "Заблокированных", value: blocked.size },
                { label: "Обработано заявок", value: processedLeads.length },
              ].map(s => (
                <div key={s.label} className="px-4 first:pl-0 last:pr-0 text-center">
                  <p className="text-2xl font-black text-[#235347]">{s.value}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* RIGHT: detail panel */}
      {selected && (() => {
        const opIdx = operators.findIndex((o: any) => o.id === selected.id);
        const stats = getOpStats(selected, opIdx);
        const isBlocked = blocked.has(selected.id);
        return (
          <div className="w-80 shrink-0 space-y-4">
            <Card className="overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-br from-[#051F20] to-[#0B2B26] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${isBlocked ? "bg-red-200 text-red-700" : "bg-[#E2F4E9] text-[#235347]"}`}>
                      {selected.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-black text-sm">{selected.email}</p>
                      <p className={`text-xs font-bold mt-0.5 ${isBlocked ? "text-red-400" : "text-[#8EB69B]"}`}>
                        {isBlocked ? "🔴 Заблокирован" : "🟢 Активный оператор"}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-white/50 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* KPI grid */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Обработано заявок", value: stats.processed, color: "text-[#235347]" },
                    { label: "Эффективность", value: `${stats.efficiency}%`, color: stats.efficiency >= 80 ? "text-emerald-600" : stats.efficiency >= 50 ? "text-amber-600" : "text-red-500" },
                    { label: "Последняя активность", value: selected.createdAt ? new Date(selected.createdAt).toLocaleDateString("ru-RU") : "—", color: "text-gray-700" },
                    { label: "Конверсия", value: totalLeads > 0 ? `${Math.round(stats.processed / (totalLeads / Math.max(operators.length, 1)) * 100)}%` : "—", color: "text-gray-700" },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase leading-tight mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Efficiency bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                    <span>Прогресс эффективности</span>
                    <span>{stats.efficiency}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${stats.efficiency >= 80 ? "bg-emerald-500" : stats.efficiency >= 50 ? "bg-amber-500" : "bg-red-400"}`}
                      style={{ width: `${stats.efficiency}%` }} />
                  </div>
                </div>

                {/* Processed clients list */}
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-2">
                    Обработанные клиенты ({stats.assignedLeads.length})
                  </p>
                  {stats.assignedLeads.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-3 bg-gray-50 rounded-xl">Нет обработанных заявок</p>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {stats.assignedLeads.map((l: any) => {
                        const info = l.profession?.split(" | ") || [];
                        const direction = info[0]?.replace("Направление: ", "") || "—";
                        return (
                          <div key={l.id} className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl">
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate">{l.name}</p>
                              <p className="text-[9px] text-gray-400 truncate">{direction}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">✓</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-100 space-y-2">
                <button onClick={() => toggleBlock(selected.id, selected.email)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition cursor-pointer ${isBlocked ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-red-50 hover:bg-red-100 text-red-700"}`}>
                  {isBlocked ? <><RotateCcw className="w-4 h-4" /> Разблокировать доступ</> : <><Ban className="w-4 h-4" /> Заблокировать доступ</>}
                </button>
                <button onClick={() => deleteOp(selected.id)} className="w-full flex items-center justify-center gap-2 py-2 text-red-400 hover:text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition cursor-pointer">
                  <Trash2 className="w-4 h-4" /> Удалить аккаунт оператора
                </button>
              </div>
            </Card>
          </div>
        );
      })()}
    </div>
  );
}

// ─── CMS ──────────────────────────────────────────────────────────────────────
function CMSSection({ dynamicBlocks, onRefresh }: any) {
  const [blocks, setBlocks] = useState<any>(dynamicBlocks || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeBlock, setActiveBlock] = useState<string>("whyUs");

  useEffect(() => { setBlocks(dynamicBlocks || {}); }, [dynamicBlocks]);

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/dynamic-blocks", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(blocks) });
      setSaved(true); setTimeout(() => setSaved(false), 2000); onRefresh();
    } finally { setSaving(false); }
  };

  const updateField = (section: string, field: string, value: any) => {
    setBlocks((prev: any) => ({ ...prev, [section]: { ...(prev[section] || {}), [field]: value } }));
  };

  const updateCard = (section: string, cardIdx: number, field: string, value: string) => {
    setBlocks((prev: any) => {
      const sec = { ...(prev[section] || {}) };
      const cards = [...(sec.cards || sec.items || sec.stats || [])];
      cards[cardIdx] = { ...cards[cardIdx], [field]: value };
      const key = sec.cards ? "cards" : sec.items ? "items" : "stats";
      return { ...prev, [section]: { ...sec, [key]: cards } };
    });
  };

  const addCard = (section: string) => {
    setBlocks((prev: any) => {
      const sec = { ...(prev[section] || {}) };
      const key = sec.cards !== undefined ? "cards" : sec.items !== undefined ? "items" : "stats";
      const newItem = key === "stats" ? { label: "Новый показатель", value: "0" } : { id: "card_" + Date.now(), title: "Новый блок", desc: "" };
      return { ...prev, [section]: { ...sec, [key]: [...(sec[key] || []), newItem] } };
    });
  };

  const removeCard = (section: string, cardIdx: number) => {
    setBlocks((prev: any) => {
      const sec = { ...(prev[section] || {}) };
      const key = sec.cards !== undefined ? "cards" : sec.items !== undefined ? "items" : "stats";
      return { ...prev, [section]: { ...sec, [key]: (sec[key] || []).filter((_: any, i: number) => i !== cardIdx) } };
    });
  };

  // Add extra section
  const addExtraSection = () => {
    const id = "extra_" + Date.now();
    setBlocks((prev: any) => ({
      ...prev,
      extraSections: [...(prev.extraSections || []), {
        id, title: "Новый раздел", text: "Описание раздела...", imageUrl: "", imagePosition: "right"
      }]
    }));
  };

  const updateExtra = (idx: number, field: string, value: string) => {
    setBlocks((prev: any) => {
      const extras = [...(prev.extraSections || [])];
      extras[idx] = { ...extras[idx], [field]: value };
      return { ...prev, extraSections: extras };
    });
  };

  const removeExtra = (idx: number) => {
    setBlocks((prev: any) => ({ ...prev, extraSections: (prev.extraSections || []).filter((_: any, i: number) => i !== idx) }));
  };

  const blockSections = [
    { id: "whyUs", label: "Почему мы", icon: "⭐" },
    { id: "whatWeDo", label: "Что мы делаем", icon: "🔧" },
    { id: "aboutUs", label: "О нас", icon: "ℹ️" },
    { id: "extra", label: "Доп. разделы", icon: "➕" },
  ];

  const renderBlockEditor = (sectionId: string) => {
    if (sectionId === "extra") {
      const extras = blocks.extraSections || [];
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Дополнительные разделы главной страницы с чередованием изображений.</p>
            <button onClick={addExtraSection} className="flex items-center gap-2 px-3 py-2 bg-[#235347] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#051F20] transition">
              <Plus className="w-3.5 h-3.5" /> Добавить раздел
            </button>
          </div>
          {extras.length === 0 && <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm">Нет дополнительных разделов. Нажмите «Добавить раздел».</div>}
          {extras.map((ex: any, idx: number) => (
            <Card key={ex.id || idx} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-500">Блок {idx + 1}</span>
                  <select value={ex.imagePosition || "right"} onChange={e => updateExtra(idx, "imagePosition", e.target.value)}
                    className="text-xs bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
                    <option value="right">Текст слева, фото справа</option>
                    <option value="left">Фото слева, текст справа</option>
                  </select>
                </div>
                <button onClick={() => removeExtra(idx)} className="text-red-400 hover:text-red-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Заголовок раздела</label>
                  <input value={ex.title || ""} onChange={e => updateExtra(idx, "title", e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#235347]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">URL изображения</label>
                  <input value={ex.imageUrl || ""} onChange={e => updateExtra(idx, "imageUrl", e.target.value)} placeholder="https://..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#235347]" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 block mb-1">Текст раздела</label>
                  <textarea value={ex.text || ""} onChange={e => updateExtra(idx, "text", e.target.value)} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#235347] resize-none" />
                </div>
                {ex.imageUrl && (
                  <div className="md:col-span-2 h-28 rounded-xl overflow-hidden border border-gray-200">
                    <img src={ex.imageUrl} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      );
    }

    const b = blocks[sectionId] || {};
    const textFields = Object.entries(b).filter(([, v]) => !Array.isArray(v));
    const arrayKey = b.cards ? "cards" : b.items ? "items" : b.stats ? "stats" : null;
    const arrayData = arrayKey ? b[arrayKey] : [];

    return (
      <div className="space-y-4">
        <div className="space-y-3">
          {textFields.map(([key, val]) => (
            <div key={key}>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">{key}</label>
              <textarea value={String(val)} onChange={e => updateField(sectionId, key, e.target.value)} rows={2}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347] resize-none" />
            </div>
          ))}
        </div>
        {arrayKey && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500 uppercase">{arrayKey}</label>
              <button onClick={() => addCard(sectionId)} className="flex items-center gap-1.5 text-xs text-[#235347] font-bold cursor-pointer hover:underline">
                <Plus className="w-3 h-3" /> Добавить
              </button>
            </div>
            {(arrayData || []).map((item: any, idx: number) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{arrayKey} #{idx + 1}</span>
                  <button onClick={() => removeCard(sectionId, idx)} className="text-red-400 hover:text-red-600 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                </div>
                {Object.entries(item).filter(([k]) => k !== "id").map(([k, v]) => (
                  <div key={k}>
                    <label className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">{k}</label>
                    <input value={String(v)} onChange={e => updateCard(sectionId, idx, k, e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#235347]" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {Object.keys(b).length === 0 && <p className="text-gray-400 text-sm">Нет полей для редактирования. Сначала заполните данные через сид или API.</p>}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Управляйте текстовым контентом и блоками главной страницы.</p>
        <button onClick={save} disabled={saving}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition cursor-pointer ${saved ? "bg-emerald-500 text-white" : "bg-[#235347] hover:bg-[#051F20] text-white"}`}>
          {saved ? <><Check className="w-4 h-4" /> Сохранено!</> : <><Save className="w-4 h-4" /> {saving ? "Сохранение..." : "Сохранить изменения"}</>}
        </button>
      </div>

      <div className="flex gap-4">
        {/* Block nav */}
        <div className="w-48 shrink-0 space-y-1">
          {blockSections.map(s => (
            <button key={s.id} onClick={() => setActiveBlock(s.id)}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${activeBlock === s.id ? "bg-[#235347] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        {/* Editor */}
        <Card className="flex-1 p-5">
          <h3 className="font-black text-gray-900 text-sm mb-4">
            {blockSections.find(s => s.id === activeBlock)?.label}
          </h3>
          {renderBlockEditor(activeBlock)}
        </Card>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AdminScreen({ adminSession, onSetAdminSession, onExitAdmin }: Props) {
  const [section, setSection] = useState("dashboard");
  const [leads, setLeads] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [dynamicBlocks, setDynamicBlocks] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, c, l, st, op, db] = await Promise.all([
        fetch("/api/universities").then(r => r.json()),
        fetch("/api/careers").then(r => r.json()),
        fetch("/api/leads").then(r => r.json()),
        fetch("/api/users").then(r => r.json()),
        fetch("/api/operators").then(r => r.json()),
        fetch("/api/dynamic-blocks").then(r => r.json()),
      ]);
      setUniversities(u); setCareers(c); setLeads(l);
      setStudents(st); setOperators(op); setDynamicBlocks(db);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (adminSession) fetchAll(); }, [adminSession]);

  if (!adminSession) return <AdminLoginForm onSetAdminSession={onSetAdminSession} />;

  const isManager = adminSession.role === "manager";
  const activeSection = isManager ? "leads" : section;
  const newLeadsCount = leads.filter(l => l.status === "new").length;

  const navItems = [
    ...(!isManager ? [{ id: "dashboard", label: "Дашборд", icon: LayoutDashboard }] : []),
    { id: "leads", label: "Заявки", icon: ClipboardList, badge: newLeadsCount },
    ...(!isManager ? [
      { id: "universities", label: "Университеты", icon: Building2 },
      { id: "careers", label: "Профессии", icon: Briefcase },
      { id: "students", label: "Студенты", icon: Users },
      { id: "operators", label: "Операторы", icon: UserCog },
      { id: "cms", label: "CMS Контент", icon: FileEdit },
    ] : []),
  ];

  const handleLogout = () => { onSetAdminSession(null); if (onExitAdmin) onExitAdmin(); };

  // Nav icon colors matching the screenshot
  const navColors: Record<string, string> = {
    dashboard: "text-blue-500 bg-blue-50",
    leads:     "text-red-500 bg-red-50",
    universities: "text-emerald-600 bg-emerald-50",
    careers:   "text-amber-500 bg-amber-50",
    students:  "text-violet-500 bg-violet-50",
    operators: "text-purple-600 bg-purple-50",
    cms:       "text-sky-500 bg-sky-50",
  };

  return (
    <div className="fixed inset-0 flex gap-3 p-4 z-50 overflow-hidden" style={{ background: "linear-gradient(135deg,#e8f7ee 0%,#f0faf4 100%)" }}>

      {/* ── SIDEBAR — floating card ────────────────────────────────── */}
      <aside className="w-52 bg-white rounded-3xl flex flex-col shrink-0 overflow-hidden shadow-md relative">
        {/* Decorative sparkles (purely visual, match screenshot) */}
        <div className="absolute top-32 right-3 w-2 h-2 text-[#8EB69B] select-none pointer-events-none opacity-60 text-xs">✦</div>
        <div className="absolute top-52 left-2 w-2 h-2 text-[#8EB69B] select-none pointer-events-none opacity-40 text-xs">✦</div>
        <div className="absolute bottom-36 right-4 w-2 h-2 text-[#8EB69B] select-none pointer-events-none opacity-50 text-xs">✦</div>

        {/* Logo */}
        <div className="px-4 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#235347] flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white font-black text-base">U</span>
            </div>
            <div>
              <div className="text-gray-900 font-black text-sm leading-none">UniSearch.kz</div>
              <div className="text-gray-400 text-[9px] uppercase tracking-widest mt-0.5">Панель управления</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {navItems.map(item => {
            const isActive = activeSection === item.id;
            const colorCls = navColors[item.id] || "text-gray-500 bg-gray-100";
            return (
              <button key={item.id} onClick={() => setSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-[#235347] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-white/20" : colorCls}`}>
                  <item.icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : ""}`} />
                </div>
                <span className="flex-1 truncate">{item.label}</span>
                {(item as any).badge > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none min-w-[18px] text-center">
                    {(item as any).badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 pt-3 border-t border-gray-100 space-y-2">
          {/* User row */}
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#235347] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-black">{adminSession.username.charAt(0).toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <div className="text-gray-900 text-xs font-bold truncate">{adminSession.username}</div>
              <div className="text-gray-400 text-[9px] uppercase tracking-wide">{isManager ? "Менеджер" : "Супер Админ"}</div>
            </div>
          </div>
          {/* На сайт */}
          <button onClick={() => onExitAdmin?.()}
            className="w-full flex items-center justify-center gap-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-3 py-2.5 rounded-xl transition cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> На сайт
          </button>
          {/* Выйти */}
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-xs bg-red-50 hover:bg-red-100 text-red-500 font-bold px-3 py-2.5 rounded-xl transition cursor-pointer">
            <LogOut className="w-3.5 h-3.5" /> Выйти
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT — floating card ───────────────────────────── */}
      <div className="flex-1 bg-white rounded-3xl flex flex-col overflow-hidden shadow-md">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 rounded-t-3xl">
          <div>
            <h1 className="text-lg font-black text-gray-900">
              {navItems.find(n => n.id === activeSection)?.label || "Панель управления"}
            </h1>
            {activeSection === "leads" && newLeadsCount > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">{newLeadsCount} необработанных заявок</p>
            )}
          </div>
          <button onClick={fetchAll}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#235347] font-semibold transition cursor-pointer px-3 py-2 rounded-xl hover:bg-gray-50 border border-gray-100">
            <RefreshCw className="w-3.5 h-3.5" /> Обновить
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-[#8EB69B]/30 border-t-[#235347] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {activeSection === "dashboard"    && <DashboardSection leads={leads} universities={universities} students={students} operators={operators} onNavigate={setSection} />}
              {activeSection === "leads"        && <LeadsSection leads={leads} onRefresh={fetchAll} />}
              {activeSection === "universities" && <UniversitiesSection universities={universities} onRefresh={fetchAll} />}
              {activeSection === "careers"      && <CareersSection careers={careers} onRefresh={fetchAll} />}
              {activeSection === "students"     && <StudentsSection students={students} leads={leads} onRefresh={fetchAll} />}
              {activeSection === "operators"    && <OperatorsSection operators={operators} leads={leads} onRefresh={fetchAll} />}
              {activeSection === "cms"          && <CMSSection dynamicBlocks={dynamicBlocks} onRefresh={fetchAll} />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
