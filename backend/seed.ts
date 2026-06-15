/**
 * Скрипт одноразовой миграции данных из database.json в PostgreSQL.
 * Запускать один раз: npm run seed
 */
import { pool, initDB } from "./db";
import fs from "fs";
import path from "path";

async function seed() {
  console.log("Инициализация таблиц PostgreSQL...");
  await initDB();

  const jsonPath = path.join(process.cwd(), "backend", "database.json");
  if (!fs.existsSync(jsonPath)) {
    console.log("database.json не найден, пропускаем миграцию данных.");
    await pool.end();
    return;
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  // Universities
  let uniCount = 0;
  for (const u of data.universities || []) {
    const res = await pool.query(
      `INSERT INTO universities VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       ON CONFLICT (id) DO NOTHING`,
      [u.id, u.name, u.address||"", u.contacts||"",
       u.entMinSchool||0, u.entMinCollege||0,
       u.hasHostel||false, u.hostelDetails||"",
       JSON.stringify(u.languages||[]),
       u.hasGrants||false, u.hasQuotas||false,
       u.tuitionFee||0, u.deadlines||"",
       JSON.stringify(u.faculties||[]),
       u.imageUrl||"", u.description||""]
    );
    if (res.rowCount) uniCount++;
  }
  console.log(`✓ Университеты: ${uniCount} записей`);

  // Careers
  let careerCount = 0;
  for (const c of data.careers || []) {
    const res = await pool.query(
      `INSERT INTO careers VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`,
      [c.id, c.name, c.iconName||"", c.essence, c.socialSignificance||"", JSON.stringify(c.directions||[])]
    );
    if (res.rowCount) careerCount++;
  }
  console.log(`✓ Профессии: ${careerCount} записей`);

  // Leads
  let leadCount = 0;
  for (const l of data.leads || []) {
    const res = await pool.query(
      `INSERT INTO leads VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING`,
      [l.id, l.name, l.phone, l.email||"", l.profession||"", l.budget||"", l.createdAt, l.status||"new"]
    );
    if (res.rowCount) leadCount++;
  }
  console.log(`✓ Заявки (лиды): ${leadCount} записей`);

  // Users
  let userCount = 0;
  for (const u of data.users || []) {
    const res = await pool.query(
      `INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (id) DO NOTHING`,
      [u.id, u.username, u.fullName||"", u.phone||"", u.email||"",
       u.passwordHash||"", u.entScore||0, u.isCollegeGraduate||false,
       u.budget||1500000, JSON.stringify(u.interests||[])]
    );
    if (res.rowCount) userCount++;
  }
  console.log(`✓ Пользователи: ${userCount} записей`);

  // Operators
  let opCount = 0;
  for (const op of data.operators || []) {
    const res = await pool.query(
      `INSERT INTO operators VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING`,
      [op.id, op.email, op.password, op.createdAt||new Date().toISOString()]
    );
    if (res.rowCount) opCount++;
  }
  console.log(`✓ Операторы: ${opCount} записей`);

  // Dynamic blocks
  if (data.dynamicBlocks) {
    await pool.query(
      `INSERT INTO settings (key, value) VALUES ('dynamicBlocks', $1)
       ON CONFLICT (key) DO UPDATE SET value = $1`,
      [JSON.stringify(data.dynamicBlocks)]
    );
    console.log("✓ Динамические блоки (CMS) перенесены");
  }

  await pool.end();
  console.log("\n✅ Миграция завершена успешно!");
}

seed().catch((err) => {
  console.error("Ошибка миграции:", err.message);
  process.exit(1);
});
