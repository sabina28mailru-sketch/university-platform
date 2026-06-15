import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, ClipboardList, Building2, Briefcase, Users, UserCog,
  FileEdit, LogOut, RefreshCw, Search, Plus, Trash2, Edit3, Check, X,
  Lock, ShieldAlert, Save, ChevronDown, ChevronUp, Eye, ArrowLeft,
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

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function AdminLoginForm({ onSetAdminSession }: { onSetAdminSession: (s: AdminSession) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onSetAdminSession(data);
    } catch (e: any) {
      setError(e.message || "Ошибка входа");
    } finally { setLoading(false); }
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
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0" />{error}
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@gmail.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#235347] focus:ring-1 focus:ring-[#235347] transition" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Пароль</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#235347] focus:ring-1 focus:ring-[#235347] transition" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-[#235347] hover:bg-[#051F20] disabled:opacity-60 text-white font-black text-sm rounded-xl transition mt-2 cursor-pointer">
            {loading ? "Проверка..." : "Войти в панель управления"}
          </button>
          <p className="text-center text-[10px] text-gray-400 pt-1">Демо: admin@gmail.com / asdasd123</p>
        </form>
      </div>
    </div>
  );
}

// ─── DASHBOARD SECTION ────────────────────────────────────────────────────────
function DashboardSection({ leads, universities, students, operators, onNavigate }: any) {
  const newLeads = leads.filter((l: any) => l.status === "new").length;
  const stats = [
    { label: "Университетов в БД", value: universities.length, color: "bg-blue-50 text-blue-600 border-blue-100", icon: Building2, section: "universities" },
    { label: "Новых заявок", value: newLeads, color: "bg-amber-50 text-amber-600 border-amber-100", icon: ClipboardList, section: "leads" },
    { label: "Студентов", value: students.length, color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: Users, section: "students" },
    { label: "Операторов", value: operators.length, color: "bg-purple-50 text-purple-600 border-purple-100", icon: UserCog, section: "operators" },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <button key={s.label} onClick={() => onNavigate(s.section)}
            className="bg-white rounded-2xl p-5 text-left hover:shadow-md transition border border-gray-100 group cursor-pointer">
            <div className={`w-11 h-11 rounded-xl ${s.color} border flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 font-semibold mt-1">{s.label}</div>
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-black text-gray-900 mb-4 text-sm">Последние заявки</h3>
          {leads.length === 0 ? <p className="text-gray-400 text-sm">Нет заявок</p> : (
            <div className="space-y-2">
              {leads.slice(0, 6).map((l: any) => (
                <div key={l.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{l.name}</div>
                    <div className="text-xs text-gray-400">{l.phone} · {l.profession}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase ${l.status === "new" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {l.status === "new" ? "Новая" : "Обработана"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-black text-gray-900 mb-4 text-sm">Быстрые действия</h3>
          <div className="space-y-2">
            {[
              { label: "Добавить университет", section: "universities", icon: Building2 },
              { label: "Просмотреть заявки", section: "leads", icon: ClipboardList },
              { label: "Управление профессиями", section: "careers", icon: Briefcase },
              { label: "Редактировать контент сайта", section: "cms", icon: FileEdit },
              { label: "Создать оператора", section: "operators", icon: UserCog },
            ].map(a => (
              <button key={a.section} onClick={() => onNavigate(a.section)}
                className="w-full flex items-center gap-3 px-3 py-2.5 bg-gray-50 hover:bg-[#E2F4E9] rounded-xl text-sm font-semibold text-gray-700 hover:text-[#235347] transition text-left cursor-pointer">
                <a.icon className="w-4 h-4 shrink-0" />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LEADS SECTION ────────────────────────────────────────────────────────────
function LeadsSection({ leads, onRefresh }: any) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = leads
    .filter((l: any) => filter === "all" || l.status === filter)
    .filter((l: any) => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search) || l.email?.includes(search));

  const toggleStatus = async (id: string, current: string) => {
    await fetch(`/api/leads/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: current === "new" ? "processed" : "new" }) });
    onRefresh();
  };
  const deleteLead = async (id: string) => {
    if (!confirm("Удалить заявку?")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#235347]" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347]">
          <option value="all">Все ({leads.length})</option>
          <option value="new">Новые ({leads.filter((l: any) => l.status === "new").length})</option>
          <option value="processed">Обработанные</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Имя","Телефон","Email","Профессия","Бюджет","Дата","Статус",""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l: any) => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{l.name}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{l.phone}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{l.email || "—"}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{l.profession}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{l.budget}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {l.createdAt ? new Date(l.createdAt).toLocaleDateString("ru-RU") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(l.id, l.status)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase cursor-pointer transition ${l.status === "new" ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}>
                      {l.status === "new" ? "Новая" : "Обработана"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteLead(l.id)} className="text-red-400 hover:text-red-600 transition cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">Заявок не найдено</div>}
        </div>
      </div>
    </div>
  );
}

// ─── UNIVERSITIES SECTION ─────────────────────────────────────────────────────
function UniversitiesSection({ universities, onRefresh }: any) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const filtered = universities.filter((u: any) =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.address?.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (u: any) => { setEditing(u); setForm({ ...u, languages: u.languages?.join(", ") || "" }); setShowAdd(false); };
  const openAdd = () => { setEditing(null); setForm({ name: "", address: "", contacts: "", entMinSchool: 0, entMinCollege: 0, tuitionFee: 0, hasHostel: false, hasGrants: false, hasQuotas: false, languages: "rus", deadlines: "", description: "", imageUrl: "" }); setShowAdd(true); };
  const closeForm = () => { setEditing(null); setShowAdd(false); };

  const save = async () => {
    setSaving(true);
    const payload = { ...form, languages: form.languages ? form.languages.split(",").map((s: string) => s.trim()) : [], faculties: editing?.faculties || [] };
    try {
      if (editing) {
        await fetch(`/api/universities/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } else {
        await fetch("/api/universities", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      await onRefresh(); closeForm();
    } finally { setSaving(false); }
  };

  const deleteUni = async (id: string, name: string) => {
    if (!confirm(`Удалить "${name}"?`)) return;
    await fetch(`/api/universities/${id}`, { method: "DELETE" });
    onRefresh();
  };

  const F = ({ label, field, type = "text", as = "input" }: any) => (
    <div>
      <label className="text-xs font-bold text-gray-600 block mb-1">{label}</label>
      {as === "textarea"
        ? <textarea value={form[field] || ""} onChange={e => setForm((p: any) => ({ ...p, [field]: e.target.value }))} rows={3}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347] resize-none" />
        : type === "checkbox"
        ? <input type="checkbox" checked={!!form[field]} onChange={e => setForm((p: any) => ({ ...p, [field]: e.target.checked }))} className="w-4 h-4 accent-[#235347]" />
        : <input type={type} value={form[field] ?? ""} onChange={e => setForm((p: any) => ({ ...p, [field]: type === "number" ? Number(e.target.value) : e.target.value }))}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347]" />
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
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#235347] hover:bg-[#051F20] text-white text-sm font-bold rounded-xl transition cursor-pointer">
          <Plus className="w-4 h-4" /> Добавить ВУЗ
        </button>
      </div>

      {/* Edit/Add Form */}
      {(editing || showAdd) && (
        <div className="bg-white rounded-2xl border border-[#235347]/20 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-gray-900">{editing ? `Редактировать: ${editing.name}` : "Добавить новый ВУЗ"}</h3>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <F label="Название ВУЗа *" field="name" />
            <F label="Адрес" field="address" />
            <F label="Контакты" field="contacts" />
            <F label="Языки (через запятую: kaz, rus, eng)" field="languages" />
            <F label="Мин. балл ЕНТ (школьник)" field="entMinSchool" type="number" />
            <F label="Мин. балл ЕНТ (колледж)" field="entMinCollege" type="number" />
            <F label="Стоимость обучения (₸/год)" field="tuitionFee" type="number" />
            <F label="Дедлайны подачи" field="deadlines" />
            <div className="flex gap-6 items-center pt-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                <input type="checkbox" checked={!!form.hasHostel} onChange={e => setForm((p: any) => ({ ...p, hasHostel: e.target.checked }))} className="w-4 h-4 accent-[#235347]" />
                Есть общежитие
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                <input type="checkbox" checked={!!form.hasGrants} onChange={e => setForm((p: any) => ({ ...p, hasGrants: e.target.checked }))} className="w-4 h-4 accent-[#235347]" />
                Есть гранты
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                <input type="checkbox" checked={!!form.hasQuotas} onChange={e => setForm((p: any) => ({ ...p, hasQuotas: e.target.checked }))} className="w-4 h-4 accent-[#235347]" />
                Есть квоты
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-600 block mb-1">Фото / обложка ВУЗа (URL изображения)</label>
              <div className="flex gap-3 items-start">
                <input
                  type="url"
                  value={form.imageUrl || ""}
                  onChange={e => setForm((p: any) => ({ ...p, imageUrl: e.target.value }))}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347]"
                />
                {form.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setForm((p: any) => ({ ...p, imageUrl: "" }))}
                    className="text-red-400 hover:text-red-600 transition mt-2.5 cursor-pointer shrink-0"
                    title="Очистить"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {form.imageUrl && (
                <div className="mt-2 relative rounded-xl overflow-hidden h-28 w-full bg-gray-100 border border-gray-200">
                  <img
                    src={form.imageUrl}
                    alt="Превью"
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <span className="absolute bottom-1 right-2 text-[9px] text-white/80 font-bold bg-black/40 px-1.5 py-0.5 rounded">Превью</span>
                </div>
              )}
            </div>
            <div className="md:col-span-2"><F label="Описание" field="description" as="textarea" /></div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#235347] hover:bg-[#051F20] text-white text-sm font-bold rounded-xl transition disabled:opacity-60 cursor-pointer">
              <Save className="w-4 h-4" /> {saving ? "Сохранение..." : "Сохранить"}
            </button>
            <button onClick={closeForm} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition cursor-pointer">
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Название","Город","Мин. ЕНТ","Стоимость","Гранты","Общежитие",""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u: any) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-semibold text-gray-900 max-w-xs">
                    <div className="truncate">{u.name}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{u.address?.split(",")[0] || "—"}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{u.entMinSchool}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{u.tuitionFee?.toLocaleString()} ₸</td>
                  <td className="px-4 py-3">{u.hasGrants ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-gray-300" />}</td>
                  <td className="px-4 py-3">{u.hasHostel ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-gray-300" />}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(u)} className="text-blue-400 hover:text-blue-600 transition cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => deleteUni(u.id, u.name)} className="text-red-400 hover:text-red-600 transition cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">ВУЗы не найдены</div>}
        </div>
      </div>
      <p className="text-xs text-gray-400">Всего: {universities.length} университетов</p>
    </div>
  );
}

// ─── CAREERS SECTION ──────────────────────────────────────────────────────────
function CareersSection({ careers, onRefresh }: any) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const filtered = careers.filter((c: any) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

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
    await fetch(`/api/careers/${id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по названию..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#235347]" />
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#235347] hover:bg-[#051F20] text-white text-sm font-bold rounded-xl transition cursor-pointer">
          <Plus className="w-4 h-4" /> Добавить профессию
        </button>
      </div>

      {(editing || showAdd) && (
        <div className="bg-white rounded-2xl border border-[#235347]/20 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-gray-900">{editing ? `Редактировать: ${editing.name}` : "Добавить профессию"}</h3>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Название *</label>
              <input value={form.name || ""} onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Иконка (lucide name)</label>
              <input value={form.iconName || ""} onChange={e => setForm((p: any) => ({ ...p, iconName: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347]" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-600 block mb-1">Суть профессии *</label>
              <textarea value={form.essence || ""} onChange={e => setForm((p: any) => ({ ...p, essence: e.target.value }))} rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347] resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-600 block mb-1">Социальная значимость</label>
              <textarea value={form.socialSignificance || ""} onChange={e => setForm((p: any) => ({ ...p, socialSignificance: e.target.value }))} rows={2}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347] resize-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#235347] hover:bg-[#051F20] text-white text-sm font-bold rounded-xl transition disabled:opacity-60 cursor-pointer">
              <Save className="w-4 h-4" /> {saving ? "Сохранение..." : "Сохранить"}
            </button>
            <button onClick={closeForm} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition cursor-pointer">Отмена</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Профессия","Суть","Направлений",""].map(h => (
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
                    <button onClick={() => openEdit(c)} className="text-blue-400 hover:text-blue-600 transition cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => deleteCareer(c.id, c.name)} className="text-red-400 hover:text-red-600 transition cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">Профессии не найдены</div>}
      </div>
    </div>
  );
}

// ─── STUDENTS SECTION ─────────────────────────────────────────────────────────
function StudentsSection({ students, onRefresh }: any) {
  const [search, setSearch] = useState("");
  const filtered = students.filter((s: any) =>
    !search || s.username?.toLowerCase().includes(search.toLowerCase()) || s.email?.includes(search) || s.phone?.includes(search)
  );
  const deleteStudent = async (id: string) => {
    if (!confirm("Удалить профиль студента?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    onRefresh();
  };
  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск студентов..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#235347]" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Имя","Email","Телефон","Балл ЕНТ","Бюджет","Интересы",""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s: any) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-semibold text-gray-900">{s.fullName || s.username}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.email || "—"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.phone || "—"}</td>
                  <td className="px-4 py-3"><span className="font-bold text-[#235347]">{s.entScore ?? "—"}</span></td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.budget ? `${Number(s.budget).toLocaleString()} ₸` : "—"}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs max-w-xs"><div className="truncate">{s.interests?.join(", ") || "—"}</div></td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteStudent(s.id)} className="text-red-400 hover:text-red-600 transition cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">Студентов не найдено</div>}
        </div>
      </div>
      <p className="text-xs text-gray-400">Всего: {students.length} студентов</p>
    </div>
  );
}

// ─── OPERATORS SECTION ────────────────────────────────────────────────────────
function OperatorsSection({ operators, onRefresh }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const create = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      const res = await fetch("/api/operators", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEmail(""); setPassword("");
      onRefresh();
    } catch (e: any) { setError(e.message); } finally { setSaving(false); }
  };
  const deleteOp = async (id: string) => {
    if (!confirm("Удалить оператора?")) return;
    await fetch(`/api/operators/${id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-black text-gray-900 mb-4 text-sm">Создать нового оператора</h3>
        {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 font-semibold mb-3">{error}</div>}
        <form onSubmit={create} className="flex gap-3 flex-wrap">
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email оператора"
            className="flex-1 min-w-48 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347]" />
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" minLength={6}
            className="flex-1 min-w-36 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347]" />
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#235347] hover:bg-[#051F20] text-white text-sm font-bold rounded-xl transition disabled:opacity-60 cursor-pointer">
            <Plus className="w-4 h-4" /> {saving ? "..." : "Создать"}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2">Оператор видит только раздел «Заявки» и может менять их статус.</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Email","Дата создания",""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {operators.map((op: any) => (
              <tr key={op.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-semibold text-gray-900">{op.email}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{op.created_at || op.createdAt ? new Date(op.created_at || op.createdAt).toLocaleDateString("ru-RU") : "—"}</td>
                <td className="px-4 py-3">
                  <button onClick={() => deleteOp(op.id)} className="text-red-400 hover:text-red-600 transition cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {operators.length === 0 && <div className="py-10 text-center text-gray-400 text-sm">Операторов нет</div>}
      </div>
    </div>
  );
}

// ─── CMS SECTION ──────────────────────────────────────────────────────────────
function CMSSection({ dynamicBlocks, onRefresh }: any) {
  const [blocks, setBlocks] = useState<any>(dynamicBlocks || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setBlocks(dynamicBlocks || {}); }, [dynamicBlocks]);

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/dynamic-blocks", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(blocks) });
      setSaved(true); setTimeout(() => setSaved(false), 2000);
      onRefresh();
    } finally { setSaving(false); }
  };

  const updateField = (section: string, field: string, value: any) => {
    setBlocks((prev: any) => ({ ...prev, [section]: { ...(prev[section] || {}), [field]: value } }));
  };

  const Section = ({ id, title }: { id: string; title: string }) => {
    const b = blocks[id] || {};
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-black text-gray-900 mb-4 text-sm">{title}</h3>
        <div className="space-y-3">
          {Object.entries(b).map(([key, val]) => {
            if (Array.isArray(val)) return null;
            return (
              <div key={key}>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">{key}</label>
                <textarea value={String(val)} onChange={e => updateField(id, key, e.target.value)} rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#235347] resize-none" />
              </div>
            );
          })}
          {Object.keys(b).length === 0 && <p className="text-gray-400 text-sm">Нет полей для редактирования</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Редактирование текстового контента главной страницы сайта</p>
        <button onClick={save} disabled={saving}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition cursor-pointer ${saved ? "bg-emerald-500 text-white" : "bg-[#235347] hover:bg-[#051F20] text-white"}`}>
          {saved ? <><Check className="w-4 h-4" /> Сохранено!</> : <><Save className="w-4 h-4" /> {saving ? "Сохранение..." : "Сохранить изменения"}</>}
        </button>
      </div>
      <Section id="whyUs" title='Блок "Почему мы"' />
      <Section id="whatWeDo" title='Блок "Что мы делаем"' />
      <Section id="aboutUs" title='Блок "О нас"' />
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
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

  return (
    <div className="fixed inset-0 flex bg-gray-50 z-50 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-60 bg-[#051F20] flex flex-col shrink-0 overflow-y-auto">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#235347] flex items-center justify-center shrink-0">
              <span className="text-white font-black text-base">U</span>
            </div>
            <div>
              <div className="text-white font-black text-sm leading-none">UniSearch.kz</div>
              <div className="text-[#8EB69B] text-[9px] uppercase tracking-widest mt-0.5">Панель управления</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                activeSection === item.id ? "bg-[#235347] text-white" : "text-[#8EB69B] hover:bg-white/5 hover:text-white"
              }`}>
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {(item as any).badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none min-w-[18px] text-center">
                  {(item as any).badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#235347] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-black">{adminSession.username.charAt(0).toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-bold truncate">{adminSession.username}</div>
              <div className="text-[#8EB69B] text-[9px] uppercase">{isManager ? "Менеджер" : "Суперадмин"}</div>
            </div>
          </div>
          <button onClick={() => onExitAdmin?.()}
            className="w-full flex items-center justify-center gap-2 text-xs bg-white/5 hover:bg-white/10 text-[#8EB69B] hover:text-white font-bold px-3 py-2 rounded-xl transition cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> Вернуться на сайт
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-xs bg-red-900/30 hover:bg-red-900/50 text-red-400 font-bold px-3 py-2 rounded-xl transition cursor-pointer">
            <LogOut className="w-3.5 h-3.5" /> Выйти из панели
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <h1 className="text-base font-black text-gray-900">
            {navItems.find(n => n.id === activeSection)?.label || "Панель управления"}
          </h1>
          <button onClick={fetchAll}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#235347] font-semibold transition cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" /> Обновить данные
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-[#8EB69B]/20 border-t-[#235347] rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {activeSection === "dashboard" && <DashboardSection leads={leads} universities={universities} students={students} operators={operators} onNavigate={setSection} />}
              {activeSection === "leads" && <LeadsSection leads={leads} onRefresh={fetchAll} />}
              {activeSection === "universities" && <UniversitiesSection universities={universities} onRefresh={fetchAll} />}
              {activeSection === "careers" && <CareersSection careers={careers} onRefresh={fetchAll} />}
              {activeSection === "students" && <StudentsSection students={students} onRefresh={fetchAll} />}
              {activeSection === "operators" && <OperatorsSection operators={operators} onRefresh={fetchAll} />}
              {activeSection === "cms" && <CMSSection dynamicBlocks={dynamicBlocks} onRefresh={fetchAll} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
