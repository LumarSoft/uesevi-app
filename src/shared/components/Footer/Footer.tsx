import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#1f294c] text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <form className="space-y-4">
              <Input placeholder="Su nombre" className="text-black" />
              <Input
                type="email"
                placeholder="Su Email"
                className="text-black"
              />
              <Input
                type="tel"
                placeholder="Su telefono"
                className="text-black"
              />
              <Textarea placeholder="Su mensaje" className="text-black" />
              <Button type="submit" variant="secondary">
                Enviar mensaje
              </Button>
            </form>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="mr-2" />
              <span>info@securityguild.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2" />
              <span>123 Security Ave, Safetown, ST 12345</span>
            </div>
            <div className="rounded-xl overflow-hidden w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13394.34349168578!2d-60.6484735!3d-32.9355381!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7ab39d5d541eb%3A0xb84e8b229a27bc01!2sU.E.SE.VI%20-%20UNION%20EMPLEADOS%20DE%20SEGURIDAD%20Y%20VIGILANCIA!5e0!3m2!1ses-419!2sar!4v1724781460423!5m2!1ses-419!2sar"
                className="w-full h-full"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
