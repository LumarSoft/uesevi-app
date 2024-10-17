"use client";
import AdminDashboardModule from "@/modules/Admin/Dashboard";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchData("dashboard");
      setData(response.data);
    };
    fetch();
  }, []);

  if (!data.length) return null;

  return <AdminDashboardModule data={data[0]} />;
}
