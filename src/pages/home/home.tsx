import { Component } from "solid-js";
import PrimaryHero from "../../components/primary-hero/Primary-Hero";
import Mission from './../../components/mission/Mission';
import BlogOverview from './../../components/blog-overview/Blog-Overview';
import PortfolioOverview from './../../components/portfolio-overview/Portfolio-Overview';
import MailingListRegistration from "../../components/mailing-list-registration/Mailing-List-Registration";

const Home: Component = () => {
  return (
    <>
      <PrimaryHero />
      <Mission />
      <BlogOverview />
      <PortfolioOverview />
      <MailingListRegistration />
    </>
  );
};

export default Home;
