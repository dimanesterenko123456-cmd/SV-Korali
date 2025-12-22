import css from "./AboutPage.module.css";

import HeroAbout from "../../components/About/HeroAbout/HeroAbout";
import OurStory from "../../components/About/OurStory/OurStory";
import MissionValues from "../../components/About/MissionValues/MissionValues";
import ArtisanTeam from "../../components/About/ArtisanTeam/ArtisanTeam";
import CraftProcess from "../../components/About/CraftProcess/CraftProcess";
import ImpactCommunity from "../../components/About/ImpactCommunity/ImpactCommunity";
import AboutCTA from "../../components/About/AboutCTA/AboutCTA";

const AboutPage = () => {
  return (
    <div className={css.page}>
      <HeroAbout />
      <OurStory />
      <MissionValues />
      {/* <ArtisanTeam /> */}
      <CraftProcess />
      {/* <ImpactCommunity /> */}
      <AboutCTA />
    </div>
  );
};

export default AboutPage;
