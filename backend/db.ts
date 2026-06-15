import Database from "better-sqlite3";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// SQLite Database
const dbPath = path.join(process.cwd(), "backend", "university.db");
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

function parseJson(val: any, fallback: any = []) {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return val;
}

// Mock pool for compatibility with existing code
export const pool = {
  async query(sql: string, params: any[] = []) {
    try {
      let sqliteQuery = sql;

      // Replace $N placeholders with ? — iterate in reverse so $10 is replaced before $1
      for (let i = params.length; i >= 1; i--) {
        sqliteQuery = sqliteQuery.replace(new RegExp(`\\$${i}`, "g"), "?");
      }

      if (sqliteQuery.toLowerCase().trimStart().startsWith("select")) {
        const stmt = db.prepare(sqliteQuery);
        const rows = stmt.all(...params);
        return { rows, rowCount: rows.length };
      } else {
        const stmt = db.prepare(sqliteQuery);
        const result = stmt.run(...params);
        return { rows: [], changes: result.changes, rowCount: result.changes };
      }
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  }
};

export async function initDB() {
  // university.db uses camelCase column names — keep consistent
  db.exec(`
    CREATE TABLE IF NOT EXISTS universities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT DEFAULT '',
      contacts TEXT DEFAULT '',
      entMinSchool INTEGER DEFAULT 0,
      entMinCollege INTEGER DEFAULT 0,
      hasHostel INTEGER DEFAULT 0,
      hostelDetails TEXT DEFAULT '',
      languages TEXT DEFAULT '[]',
      hasGrants INTEGER DEFAULT 0,
      hasQuotas INTEGER DEFAULT 0,
      tuitionFee INTEGER DEFAULT 0,
      deadlines TEXT DEFAULT '',
      faculties TEXT DEFAULT '[]',
      imageUrl TEXT DEFAULT '',
      description TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS careers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      iconName TEXT DEFAULT '',
      essence TEXT NOT NULL,
      socialSignificance TEXT DEFAULT '',
      directions TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT DEFAULT '',
      profession TEXT DEFAULT '',
      budget TEXT DEFAULT '',
      createdAt TEXT NOT NULL,
      status TEXT DEFAULT 'new'
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      fullName TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      email TEXT DEFAULT '',
      passwordHash TEXT NOT NULL,
      entScore INTEGER DEFAULT 0,
      isCollegeGraduate INTEGER DEFAULT 0,
      budget INTEGER DEFAULT 1500000,
      interests TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS operators (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT '{}'
    );
  `);
  console.log("✓ SQLite таблицы готовы");
}

// Row converters: DB row → camelCase TypeScript objects
export function uniFromRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    address: row.address ?? "",
    contacts: row.contacts ?? "",
    entMinSchool: row.entMinSchool ?? 0,
    entMinCollege: row.entMinCollege ?? 0,
    hasHostel: !!row.hasHostel,
    hostelDetails: row.hostelDetails ?? "",
    languages: parseJson(row.languages, []),
    hasGrants: !!row.hasGrants,
    hasQuotas: !!row.hasQuotas,
    tuitionFee: row.tuitionFee ?? 0,
    deadlines: row.deadlines ?? "",
    faculties: parseJson(row.faculties, []),
    imageUrl: row.imageUrl ?? "",
    description: row.description ?? "",
  };
}

export function careerFromRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    iconName: row.iconName ?? "",
    essence: row.essence ?? "",
    socialSignificance: row.socialSignificance ?? "",
    directions: parseJson(row.directions, []),
  };
}

export function userFromRow(row: any) {
  return {
    id: row.id,
    username: row.username,
    fullName: row.fullName ?? row.username,
    phone: row.phone ?? "",
    email: row.email ?? "",
    entScore: row.entScore ?? 0,
    isCollegeGraduate: !!row.isCollegeGraduate,
    budget: row.budget ?? 1500000,
    interests: parseJson(row.interests, []),
  };
}
