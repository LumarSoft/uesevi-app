import { INoticias } from "@/shared/types/Querys/INoticias";
import AboutUs from "./components/AboutUS/AboutUs";
import Coverage from "./components/Coverage/Coverage";
import { HeroComponent } from "./components/Hero/HeroComponent";
import LatestNews from "./components/LatestNews/LatestNews";
import ScalesPreview from "./components/ScalesPreview/ScalesPreview";
import FormPreview from "./components/FormPreview/FormPreview";

const HomeModule = ({ noticias }: { noticias: INoticias[] }) => {
  return (
    <div>
      <HeroComponent />
      <AboutUs />
      <Coverage />
      <FormPreview />
      <ScalesPreview />
      {noticias.length > 0 && <LatestNews noticias={noticias} />}
    </div>
  );
};

export default HomeModule;
