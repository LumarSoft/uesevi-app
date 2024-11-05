import Link from "next/link";
import React from "react";

const WspLogo = () => {
  return (
    <Link href="https://wa.me/5493413750003" className="fixed right-10 bottom-10">
      <img src="/whatsapp.svg" className="w-20" alt="Whatsapp icono" />
    </Link>
  );
};

export default WspLogo;
