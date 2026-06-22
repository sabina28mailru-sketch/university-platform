import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import Groq from "groq-sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { University, CareerProfession, Lead } from "../frontend/src/types";
import dotenv from "dotenv";
import { pool, initDB, uniFromRow, careerFromRow, userFromRow } from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;
if (!groq) {
  console.warn("GROQ_API_KEY не задан. AI-помощник работает в демо-режиме.");
}

// ==========================================
// UNIVERSITIES (CRUD)
// ==========================================

app.get("/api/universities", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM universities ORDER BY name");
    res.json(result.rows.map(uniFromRow));
  } catch (e) { dbErr(res, e); }
});

app.post("/api/universities", async (req, res) => {
  const u: University = req.body;
  if (!u.name) { res.status(400).json({ error: "Наименование ВУЗа обязательно" }); return; }
  u.id = u.id || "uni_" + Date.now();
  try {
    await pool.query(
      `INSERT INTO universities VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      [u.id, u.name, u.address||"", u.contacts||"",
       u.entMinSchool||0, u.entMinCollege||0,
       u.hasHostel||false, u.hostelDetails||"",
       JSON.stringify(u.languages||[]), u.hasGrants||false, u.hasQuotas||false,
       u.tuitionFee||0, u.deadlines||"",
       JSON.stringify(u.faculties||[]), u.imageUrl||"", u.description||""]
    );
    res.status(201).json(u);
  } catch (e) { dbErr(res, e); }
});

app.put("/api/universities/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const existing = await pool.query("SELECT * FROM universities WHERE id = $1", [id]);
    if (!existing.rows.length) { res.status(404).json({ error: "ВУЗ не найден" }); return; }
    const u = { ...uniFromRow(existing.rows[0]), ...req.body, id };
    await pool.query(
      `UPDATE universities SET name=$2, address=$3, contacts=$4, entMinSchool=$5, entMinCollege=$6,
       hasHostel=$7, hostelDetails=$8, languages=$9, hasGrants=$10, hasQuotas=$11,
       tuitionFee=$12, deadlines=$13, faculties=$14, imageUrl=$15, description=$16
       WHERE id=$1`,
      [id, u.name, u.address||"", u.contacts||"",
       u.entMinSchool||0, u.entMinCollege||0,
       u.hasHostel||false, u.hostelDetails||"",
       JSON.stringify(u.languages||[]), u.hasGrants||false, u.hasQuotas||false,
       u.tuitionFee||0, u.deadlines||"",
       JSON.stringify(u.faculties||[]), u.imageUrl||"", u.description||""]
    );
    res.json(u);
  } catch (e) { dbErr(res, e); }
});

app.delete("/api/universities/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM universities WHERE id = $1", [req.params.id]);
    if (!result.rowCount) { res.status(404).json({ error: "ВУЗ не найден" }); return; }
    res.json({ success: true, message: "ВУЗ успешно удален" });
  } catch (e) { dbErr(res, e); }
});

// ==========================================
// CAREERS (CRUD)
// ==========================================

app.get("/api/careers", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM careers ORDER BY name");
    res.json(result.rows.map(careerFromRow));
  } catch (e) { dbErr(res, e); }
});

app.post("/api/careers", async (req, res) => {
  const c: CareerProfession = req.body;
  if (!c.name || !c.essence) { res.status(400).json({ error: "Название и суть профессии обязательны" }); return; }
  c.id = c.id || "career_" + Date.now();
  try {
    await pool.query(
      `INSERT INTO careers VALUES ($1,$2,$3,$4,$5,$6)`,
      [c.id, c.name, c.iconName||"", c.essence, c.socialSignificance||"", JSON.stringify(c.directions||[])]
    );
    res.status(201).json(c);
  } catch (e) { dbErr(res, e); }
});

app.put("/api/careers/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const existing = await pool.query("SELECT * FROM careers WHERE id = $1", [id]);
    if (!existing.rows.length) { res.status(404).json({ error: "Профессия не найдена" }); return; }
    const c = { ...careerFromRow(existing.rows[0]), ...req.body, id };
    await pool.query(
      `UPDATE careers SET name=$2, iconName=$3, essence=$4, socialSignificance=$5, directions=$6 WHERE id=$1`,
      [id, c.name, c.iconName||"", c.essence, c.socialSignificance||"", JSON.stringify(c.directions||[])]
    );
    res.json(c);
  } catch (e) { dbErr(res, e); }
});

app.delete("/api/careers/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM careers WHERE id = $1", [req.params.id]);
    if (!result.rowCount) { res.status(404).json({ error: "Профессия не найдена" }); return; }
    res.json({ success: true, message: "Профессия успешно удалена" });
  } catch (e) { dbErr(res, e); }
});

// ==========================================
// LEADS
// ==========================================

app.get("/api/leads", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM leads ORDER BY createdAt DESC");
    res.json(result.rows);
  } catch (e) { dbErr(res, e); }
});

app.post("/api/leads", async (req, res) => {
  const { name, phone, email, profession, budget } = req.body;
  if (!name || !phone) { res.status(400).json({ error: "Имя и телефон обязательны" }); return; }
  const newLead: Lead = {
    id: "lead_" + Date.now(), name, phone,
    email: email || "", profession: profession || "Не знаю",
    budget: budget || "Не указан",
    createdAt: new Date().toISOString(), status: "new",
  };
  try {
    await pool.query(
      `INSERT INTO leads (id, name, phone, email, profession, budget, createdAt, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [newLead.id, newLead.name, newLead.phone, newLead.email,
       newLead.profession, newLead.budget, newLead.createdAt, newLead.status]
    );
    res.status(201).json(newLead);
  } catch (e) { dbErr(res, e); }
});

app.put("/api/leads/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const existing = await pool.query("SELECT * FROM leads WHERE id = $1", [id]);
    if (!existing.rows.length) { res.status(404).json({ error: "Лид не найден" }); return; }
    const r = existing.rows[0];
    const updated = { ...r, ...req.body, id, createdAt: req.body.createdAt || r.createdAt };
    await pool.query(
      `UPDATE leads SET name=$2, phone=$3, email=$4, profession=$5, budget=$6, createdAt=$7, status=$8 WHERE id=$1`,
      [id, updated.name, updated.phone, updated.email,
       updated.profession, updated.budget, updated.createdAt, updated.status]
    );
    res.json(updated);
  } catch (e) { dbErr(res, e); }
});

app.delete("/api/leads/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM leads WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { dbErr(res, e); }
});

// ==========================================
// AUTH
// ==========================================

app.post("/api/auth/register", async (req, res) => {
  const { username, password, fullName, phone, email, entScore } = req.body;
  if (!username || !password) { res.status(400).json({ error: "Имя и пароль обязательны" }); return; }
  try {
    const exists = await pool.query(
      "SELECT id FROM users WHERE lower(username) = lower($1) OR (email != '' AND lower(email) = lower($2))",
      [username, email || ""]
    );
    if (exists.rows.length) { res.status(400).json({ error: "Пользователь с таким именем или почтой уже существует" }); return; }
    const id = "user_" + Date.now();
    await pool.query(
      `INSERT INTO users (id, username, fullName, phone, email, passwordHash, entScore, isCollegeGraduate, budget, interests) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [id, username, fullName||username, phone||"", email||"",
       password, entScore ? Number(entScore) : 0, 0, 1500000, "[]"]
    );
    res.status(201).json({ id, username, fullName: fullName||username, phone: phone||"",
      email: email||"", entScore: entScore||0, isCollegeGraduate: false,
      budget: 1500000, interests: [], role: "student" });
  } catch (e) { dbErr(res, e); }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) { res.status(400).json({ error: "Поля логина и пароля обязательны" }); return; }

  if ((username.toLowerCase() === "admin@gmail.com" || username.toLowerCase() === "admin") && password === "asdasd123") {
    res.json({ id: "admin_super", username: "admin@gmail.com", role: "admin", entScore: 140, isCollegeGraduate: false, budget: 4000000, interests: [] });
    return;
  }

  try {
    const op = await pool.query("SELECT * FROM operators WHERE lower(email) = lower($1) AND password = $2", [username, password]);
    if (op.rows.length) {
      res.json({ id: op.rows[0].id, username: op.rows[0].email, role: "manager", entScore: 140, isCollegeGraduate: false, budget: 4000000, interests: [] });
      return;
    }
    const user = await pool.query(
      "SELECT * FROM users WHERE (lower(username) = lower($1) OR (email != '' AND lower(email) = lower($1))) AND passwordHash = $2",
      [username, password]
    );
    if (!user.rows.length) { res.status(401).json({ error: "Неверный логин (имя/почта) или пароль" }); return; }
    res.json({ ...userFromRow(user.rows[0]), role: "student" });
  } catch (e) { dbErr(res, e); }
});

app.post("/api/auth/admin-login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ error: "Почта и пароль обязательны" }); return; }
  if (email.toLowerCase() === "admin@gmail.com" && password === "asdasd123") {
    res.json({ role: "admin", username: "admin@gmail.com" }); return;
  }
  try {
    const op = await pool.query("SELECT * FROM operators WHERE lower(email) = lower($1) AND password = $2", [email, password]);
    if (op.rows.length) { res.json({ role: "manager", username: op.rows[0].email }); return; }
    res.status(401).json({ error: "Неверный логин или пароль для панели управления" });
  } catch (e) { dbErr(res, e); }
});

// ==========================================
// OPERATORS
// ==========================================

app.get("/api/operators", async (_req, res) => {
  try {
    res.json((await pool.query("SELECT * FROM operators")).rows);
  } catch (e) { dbErr(res, e); }
});

app.post("/api/operators", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ error: "Почта и пароль обязательны" }); return; }
  try {
    const exists = await pool.query("SELECT id FROM operators WHERE lower(email) = lower($1)", [email]);
    if (exists.rows.length) { res.status(400).json({ error: "Этот адрес оператора уже зарегистрирован" }); return; }
    const newOp = { id: "op_" + Date.now(), email, password, createdAt: new Date().toISOString() };
    await pool.query(`INSERT INTO operators (id, email, password, createdAt) VALUES ($1,$2,$3,$4)`, [newOp.id, newOp.email, newOp.password, newOp.createdAt]);
    res.status(201).json(newOp);
  } catch (e) { dbErr(res, e); }
});

app.delete("/api/operators/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM operators WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { dbErr(res, e); }
});

// ==========================================
// USERS / PROFILE
// ==========================================

app.get("/api/users", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows.map(userFromRow));
  } catch (e) { dbErr(res, e); }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { dbErr(res, e); }
});

app.put("/api/profile/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const existing = await pool.query("SELECT id FROM users WHERE id = $1", [id]);
    if (!existing.rows.length) { res.status(404).json({ error: "Пользователь не найден" }); return; }
    await pool.query(
      `UPDATE users SET entScore=$2, isCollegeGraduate=$3, budget=$4, interests=$5 WHERE id=$1`,
      [id, Number(req.body.entScore)||0, req.body.isCollegeGraduate ? 1 : 0,
       Number(req.body.budget)||1500000,
       JSON.stringify(Array.isArray(req.body.interests) ? req.body.interests : [])]
    );
    const updated = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    res.json(userFromRow(updated.rows[0]));
  } catch (e) { dbErr(res, e); }
});

// ==========================================
// DYNAMIC BLOCKS (CMS)
// ==========================================

app.get("/api/dynamic-blocks", async (_req, res) => {
  try {
    const result = await pool.query("SELECT value FROM settings WHERE key = 'dynamicBlocks'");
    if (!result.rows.length) {
      res.json({ whyUs: { title: "", subtitle: "", cards: [] }, whatWeDo: { title: "", description: "", items: [] }, aboutUs: { title: "", text: "", stats: [] } });
      return;
    }
    const raw = result.rows[0].value;
    res.json(typeof raw === "string" ? JSON.parse(raw) : raw);
  } catch (e) { dbErr(res, e); }
});

app.put("/api/dynamic-blocks", async (req, res) => {
  try {
    const existing = await pool.query("SELECT value FROM settings WHERE key = 'dynamicBlocks'");
    const current = existing.rows.length
      ? (typeof existing.rows[0].value === "string" ? JSON.parse(existing.rows[0].value) : existing.rows[0].value)
      : {};
    const updated = { ...current, ...req.body };
    await pool.query(
      `INSERT INTO settings (key, value) VALUES ('dynamicBlocks', $1) ON CONFLICT (key) DO UPDATE SET value = excluded.value`,
      [JSON.stringify(updated)]
    );
    res.json(updated);
  } catch (e) { dbErr(res, e); }
});

// ==========================================
// AI ASSISTANT
// ==========================================

app.post("/api/assistant", async (req, res) => {
  const { entScore, isCollegeGraduate, budget, interests, comments } = req.body;

  let universitiesList: University[] = [];
  try {
    const result = await pool.query("SELECT * FROM universities");
    universitiesList = result.rows.map(uniFromRow) as University[];
  } catch (e) {
    dbErr(res, e); return;
  }

  const matchedUnis = universitiesList.filter((uni) => {
    const requiredMin = isCollegeGraduate ? uni.entMinCollege : uni.entMinSchool;
    if (budget <= 750000) return uni.hasGrants;
    return entScore >= requiredMin || uni.tuitionFee <= budget || uni.hasGrants;
  });

  const uniContext = matchedUnis.slice(0, 8).map((uni) => ({
    name: uni.name,
    minScore: isCollegeGraduate ? uni.entMinCollege : uni.entMinSchool,
    fee: `${uni.tuitionFee.toLocaleString()} ₸/год`,
    hostel: uni.hasHostel,
    langs: uni.languages.join(", "),
    grants: uni.hasGrants,
  }));

  const userTypeStr = isCollegeGraduate ? "выпускник колледжа (сокращенная форма ЕНТ)" : "выпускник школы";

  const systemPrompt = `Ты — профессиональный академический консультант по поступлению в ВУЗы Казахстана.
Твоя задача — сопоставить профиль абитуриента с предоставленной базой данных университетов Казахстана.
На основе реальных фактов и требований, рассчитай реалистичные шансы на поступление (как на грант, так и на коммерческое отделение) и дай четкий профессиональный пошаговый план.

Профиль абитуриента:
- Тип абитуриента: ${userTypeStr}
- Баллы ЕНТ (UNT): ${entScore} из 140
- Максимальный комфортный годовой бюджет: ${budget <= 750000 ? "Грант / Бесплатно" : `${budget.toLocaleString()} ₸/год`}
- Интересы / Сферы деятельности: ${Array.isArray(interests) ? interests.join(", ") : "Все сферы"}
- Дополнительные комментарии/пожелания: ${comments || "Нет"}

Подходящие университеты (топ-8):
${JSON.stringify(uniContext)}

Инструкции к ответу:
1. Пиши исключительно на русском языке, вежливо и профессионально, обращаясь к абитуриенту.
2. Сделай структурированный отчет на основе Markdown.
3. Рассчитай примерный % вероятности получения Государственного Образовательного Гранта.
4. Укажи конкретные ВУЗы из предоставленного списка.
5. Распиши 4-шаговый практический алгоритм подачи документов.
6. Не выдумывай университеты или специальности, которых нет в предоставленном списке.`;

  if (!groq) {
    let demoMarkdown = `### 🎓 Анализ шансов поступления (Демо-режим)\n\n*Примечание: API-ключ Gemini не установлен, используется встроенный алгоритм.*\n\n**Ваш профиль:**\n* Категория: **${userTypeStr}**\n* Баллы ЕНТ: **${entScore}** из 140\n* Годовой бюджет: **${budget.toLocaleString()} ₸**\n* Сферы интересов: **${Array.isArray(interests) && interests.length > 0 ? interests.join(", ") : "Общие направления"}**\n\n---\n\n### 🏛️ Подходящие университеты из базы данных:\n`;
    if (matchedUnis.length === 0) {
      demoMarkdown += `\nНе найдено совпадений. Рекомендуется повысить бюджет или указать более высокие баллы ЕНТ.`;
    } else {
      matchedUnis.forEach((uni) => {
        const requiredMin = isCollegeGraduate ? uni.entMinCollege : uni.entMinSchool;
        const grantChance = entScore >= 110 ? "Высокая (85-100%)" : entScore >= 85 ? "Средняя (50-80%)" : "Минимальная (менее 30%)";
        const feeStatus = uni.tuitionFee <= budget ? "✅ Подходит" : "❌ Превышает бюджет";
        demoMarkdown += `\n#### 🏫 ${uni.name}\n* **Шансы на грант:** ${grantChance}\n* **Проходной балл ЕНТ:** ${requiredMin} (У Вас: **${entScore}**)\n* **Стоимость:** ${uni.tuitionFee.toLocaleString()} ₸/год (${feeStatus})\n* **Общежитие:** ${uni.hasHostel ? "Да" : "Нет"}\n* **Языки:** ${uni.languages.map((l) => l.toUpperCase()).join(", ")}\n`;
      });
    }
    demoMarkdown += `\n---\n\n### 📋 4 Шага к успешному зачислению:\n1. **Сдача ЕНТ:** Подготовка и сдача профилирующих предметов.\n2. **Конкурс грантов:** Подача заявления на eGov в июле. До 4 направлений/университетов.\n3. **Подача оригиналов:** Аттестат/диплом, медсправка 075-У, фото 3х4, удостоверение до 25 августа.\n4. **Заявка на общежитие:** Сразу после зачисления обратиться в деканат.\n`;
    res.json({ text: demoMarkdown }); return;
  }

  try {
    const completion = await groq!.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: systemPrompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });
    const text = completion.choices[0]?.message?.content;
    if (!text) throw new Error("Empty response from Groq");
    res.json({ text });
  } catch (error: any) {
    const msg = error?.message || String(error);
    console.error("Groq API error:", msg);
    res.status(500).json({ error: `Ошибка интеграции AI: ${msg}. Пожалуйста, попробуйте позже.` });
  }
});

// ==========================================
// ERROR HELPER
// ==========================================

function dbErr(res: express.Response, error: any) {
  console.error("DB error:", error?.message || error);
  res.status(500).json({ error: "Ошибка базы данных" });
}

// ==========================================
// STATIC FRONTEND (production)
// ==========================================

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, ".")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
  });
}

// ==========================================
// START
// ==========================================

async function main() {
  await initDB();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✓ Backend API запущен: http://localhost:${PORT}`);
    console.log(`  База данных: PostgreSQL (${process.env.DB_NAME || "university_platform"})`);
  });
}

main().catch((err) => {
  console.error("Ошибка запуска сервера:", err.message);
  process.exit(1);
});
