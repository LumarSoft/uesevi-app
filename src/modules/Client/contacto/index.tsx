import ContactCard from "./components/ContactCard";
import Ubication from "./components/Ubication";

export default function ContactModule() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 lg:h-screen">
      <ContactCard/>
      <Ubication />
    </main>
  );
}
