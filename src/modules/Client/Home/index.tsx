import AboutUs from "./components/AboutUS/AboutUs";
import AboutUs2 from "./components/AboutUs2/AboutUs2";
import Coverage from "./components/Coverage/Coverage";
import { HeroComponent } from "./components/Hero/HeroComponent";
import LatestNews from "./components/LatestNews/LatestNews";

const HomeModule = () => {
  return (
    <div>
      <HeroComponent />
      <AboutUs />
      <AboutUs2 />
      <Coverage />
      <LatestNews />
    </div>
  );
};

export default HomeModule;
