import { INoticias } from "@/shared/types/Querys/INoticias";
import AboutUs from "./components/AboutUS/AboutUs";
import AboutUs2 from "./components/AboutUs2/AboutUs2";
import Coverage from "./components/Coverage/Coverage";
import { HeroComponent } from "./components/Hero/HeroComponent";
import LatestNews from "./components/LatestNews/LatestNews";
import ScalesPreview from "./components/ScalesPreview/ScalesPreview";
import FormPreview from "./components/FormPreview/FormPreview";

const HomeModule = ({ noticias }: { noticias: INoticias[] }) => {
  console.log(noticias);
  return (
    <div>
      <HeroComponent />
      <AboutUs />
      <AboutUs2 />
      <Coverage />
      <FormPreview />
      <ScalesPreview />
      <LatestNews noticias={noticias} />
    </div>
  );
};

export default HomeModule;
