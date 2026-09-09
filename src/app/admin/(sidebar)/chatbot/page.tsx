"use client";

import ChatbotModule from "@/modules/Admin/Chatbot";

// No hay carga inicial: el módulo arranca con la conversación vacía y consulta
// la API recién cuando el admin escribe.
export default function ChatbotPage() {
  return <ChatbotModule />;
}
