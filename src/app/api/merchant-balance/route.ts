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

export async function GET(request: NextRequest) {
  const getData = await db.query(
    "SELECT balance FROM user_table WHERE username = $1",
    ["merchant"]
  );

  return NextResponse.json(
    {
      userBalance: getData.rows[0].balance,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export const revalidate = 0;
