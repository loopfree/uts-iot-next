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
  const { username, password } = await request.json();

  const getData = await db.query(
    "SELECT password, role FROM user_table WHERE username = $1",
    [username]
  );

  if (getData.rowCount === 0) {
    return NextResponse.json(
      {
        body: "Invalid credentials",
      },
      {
        status: 400,
      }
    );
  }

  const rowPassword = getData.rows[0].password;

  if (rowPassword !== password) {
    return NextResponse.json(
      {
        body: "Invalid credentials",
      },
      {
        status: 400,
      }
    );
  }

  const role = parseInt(getData.rows[0].role) === 0 ? "user" : "merchant";

  return NextResponse.json(
    {
      message: `Successful login, you are: ${username} with role: ${role}`,
      username: username,
      role: role,
    },
    {
      status: 200,
    }
  );
}
