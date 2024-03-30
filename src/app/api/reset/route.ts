import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Pool } from "pg";

const userDB = process.env.DATABASE_USER as string;
const passwordDB = process.env.DATABASE_PASSWORD as string;
const hostDB = process.env.DATABASE_HOST as string;

const db = new Pool({
  user: userDB,
  database: "cashless",
  host: hostDB,
  password: passwordDB,
  ssl: true,
  port: 26257,
});

export async function POST(request: NextRequest) {
  try {
    const defaultBalance = 231000;

    await db.query("BEGIN");

    await db.query("UPDATE user_table SET balance = $2 WHERE username = $1", [
      "13520131",
      defaultBalance,
    ]);

    await db.query("UPDATE user_table SET balance = $2 WHERE username = $1", [
      "merchant",
      0,
    ]);

    await db.query("TRUNCATE transaction_table");

    await db.query("COMMIT");

    return NextResponse.json(
      {
        message: "Reset balance successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Fail to reset balance",
      },
      {
        status: 500,
      }
    );
  }
}
