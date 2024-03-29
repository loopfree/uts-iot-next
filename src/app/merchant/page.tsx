"use client";

import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  username: string;
  date: string;
  amount: string;
  clock: string;
}

export default function Page() {
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
    []
  );
  const [usName, setUsName] = useState<string | null>(null);
  const [usBalance, setUsBalance] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/transaction-history", {
        method: "GET",
      });
      const data = await response.json();
      setTransactionHistory(data.transactionHistory);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/merchant-balance", {
        method: "GET",
      });
      const data = await response.json();
      setUsBalance(data.userBalance);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    setUsName(storedUsername);
  }, []);

  return (
    <>
      <h1
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "30px",
        }}
      >
        Hello, {usName}
      </h1>
      <h2
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "green",
          marginBottom: "20px",
        }}
      >
        IDR {usBalance}
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {transactionHistory.map((transaction) => (
          <Card
            key={transaction.id}
            amount={transaction.amount}
            date={formatDate(transaction.date)}
            clock={transaction.clock}
          />
        ))}
      </div>
    </>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const formattedDate = date.toISOString().split("T")[0];
  return formattedDate;
}

interface CardInterface {
  amount: string;
  date: string;
  clock: string;
}

function Card({ amount, date, clock }: CardInterface) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "10px",
        margin: "10px",
        width: "300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <p style={{ color: "purple" }}>13520131</p>
        <p style={{ color: "green" }}>+ IDR {amount}</p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <p style={{ color: "white" }}>{date}</p>
        <p style={{ color: "white" }}>{clock}</p>
      </div>
    </div>
  );
}
