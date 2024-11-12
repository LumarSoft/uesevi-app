import React from "react";

export const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br">
      {/* Círculo exterior */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-8 border-blue-700 border-t-blue-500 animate-spin"></div>

        {/* Círculos rebotantes internos */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s] shadow-lg shadow-blue-500/50"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s] shadow-lg shadow-blue-500/50"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce shadow-lg shadow-blue-500/50"></div>
        </div>
      </div>

      {/* Texto de carga con efecto de pulso */}
      <div className="mt-8 text-blue-800 font-semibold tracking-wider animate-pulse">
        CARGANDO...
      </div>
    </div>
  );
};
