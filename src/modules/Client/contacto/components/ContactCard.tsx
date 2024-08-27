"use client";
import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import emailjs from "@emailjs/browser";
import { useToast } from "@/components/ui/use-toast";
import { FramerComponent } from "@/shared/Framer/FramerComponent";

export default function ContactCard() {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
    message: "",
  });

  const form = useRef<HTMLFormElement | null>(null);
  const { toast } = useToast();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.user_email || !formData.user_phone || !formData.message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, completa todos los campos.",
      });
      return;
    }

    try {
      await emailjs.sendForm(
        "service_bxf00hj",
        "template_76rjx6b",
        (form.current ?? undefined) as unknown as HTMLFormElement,
        "QKnAoh9QQZ0-6AXIU"
      );
      toast({
        title: "Mensaje enviado con éxito!",
        className: "bg-green-200 text-green-600 border-green-500 font-bold",
      });
      setFormData({
        user_name: "",
        user_email: "",
        user_phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.",
      });
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
        <form className="space-y-6" ref={form} onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="user_name"
                name="user_name"
                placeholder="Juan Pérez"
                type="text"
                value={formData.user_name}
                onChange={handleChange}
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
                value={formData.user_email}
                onChange={handleChange}
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
              value={formData.user_phone}
              onChange={handleChange}
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
              value={formData.message}
              onChange={handleChange}
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
