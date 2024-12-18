"use client";
import CalculadoraModule from "@/modules/Admin/Calculadora";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function CalculadoraPage() {
  const [rate, setRate] = useState([]);

  useEffect(() => {
    const fetchRate = async () => {
      const rate = await fetchData("rates");

      if (rate.ok) {
        setRate(rate.data[0]);
      }
    };

    fetchRate();
  }, []);

  return <CalculadoraModule interes={rate} />;
}
