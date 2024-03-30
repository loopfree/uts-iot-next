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
    const price = 20000;

    const currentBalanceResult = await db.query(
      "SELECT balance from user_table WHERE username = $1",
      ["13520131"]
    );

    const currentBalance: string = currentBalanceResult.rows[0].balance;

    if (parseInt(currentBalance) < price) {
      throw new Error("Insufficient Balance");
    }

    await db.query("BEGIN");

    await db.query(
      "UPDATE user_table SET balance = balance - $2 WHERE username = $1",
      ["13520131", price]
    );

    await db.query(
      "UPDATE user_table SET balance = balance + $2 WHERE username = $1",
      ["merchant", price]
    );

    await db.query("COMMIT");

    const currentDate = new Date();

    // Format the date according to PostgreSQL's expected format
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    const formattedDate = currentDate.toLocaleDateString("en-US", dateOptions);

    // Format the time to hh:mm format
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };

    const formattedTime = currentDate.toLocaleTimeString("en-US", timeOptions);

    console.log("Date:", formattedDate);
    console.log("Time:", formattedTime);

    await db.query(
      "INSERT INTO transaction_table (username, date, amount, clock) VALUES ($1, $2, $3, $4)",
      ["13520131", formattedDate, price, formattedTime]
    );

    return NextResponse.json(
      {
        message: "Reduce balance successfully",
        newBalance: parseInt(currentBalance) - price,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Fail to reduce balance",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
