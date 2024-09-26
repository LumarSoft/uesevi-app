"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { FramerComponent } from "@/shared/Framer/FramerComponent";
import { postData } from "@/services/mysql/functions";
import { toast } from "react-toastify";

export default function ContactCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("message", message);

    try {
      const result = await postData("inquiries", formData);
      console.log(result);
      if (!result) {
        return toast.error("Error al enviar el mensaje");
      } else if (result.data.message === "Inquiry added") {
        return toast.success("Mensaje enviado correctamente");
      }
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FramerComponent
      style="bg-background p-8 lg:p-12 flex flex-col justify-center items-center"
      animationInitial={{ x: -200, opacity: 0 }}
      animationAnimate={{ x: 0, opacity: 1 }}
    >
      <div className="w-full max-w-xl space-y-8">
        <div className="flex flex-col items-center space-y-4 ">
          <MessageSquare className="w-12 h-12" />
          <h2 className="text-3xl font-bold text-center lg:text-4xl">
            Contáctanos
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="user_name"
                name="user_name"
                placeholder="Juan Pérez"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user_email">Email</Label>
              <Input
                id="user_email"
                name="user_email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="user_phone">Teléfono</Label>
            <Input
              id="user_phone"
              name="user_phone"
              type="number"
              placeholder="(555) 555-5555"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje</Label>
            <Textarea
              id="message"
              name="message"
              rows={4}
              placeholder="¿En qué podemos ayudarte?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Enviar
          </Button>
        </form>
      </div>
    </FramerComponent>
  );
}
