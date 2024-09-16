import { INoticias } from "@/shared/types/Querys/INoticias";
import AboutUs from "./components/AboutUS/AboutUs";
import AboutUs2 from "./components/AboutUs2/AboutUs2";
import Coverage from "./components/Coverage/Coverage";
import { HeroComponent } from "./components/Hero/HeroComponent";
import LatestNews from "./components/LatestNews/LatestNews";
import Footer from "@/shared/components/Footer/Footer";

const HomeModule = ({ noticias }: { noticias: INoticias[] }) => {
  return (
    <div>
      <HeroComponent />
      <AboutUs />
      <AboutUs2 />
      <Coverage />
      <LatestNews noticias={noticias} />
      <Footer />
    </div>
  );
};

export default HomeModule;
