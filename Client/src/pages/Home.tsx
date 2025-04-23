import Banner from '../components/layout/Banner';
import Hero1 from "../components/layout/Hero1.tsx";
import  SectionWrapper  from "../hoc/SectionWrapper";
import NavigationBar from "../components/layout/Navbar.tsx";
import SubNav from "../components/layout/SubNav.tsx";
import Footer from "../components/layout/Footer.tsx";
import Discount from "../components/layout/Discount.tsx";
import Category from "../components/layout/Category.tsx";
import Poster from "../components/layout/Poster.tsx";
import PartnerCard from "../components/layout/PartnerCard.tsx";
import FAQContent from "../components/layout/AboutUs.tsx";
import StatsDisplay from "../components/layout/StatsDisplay.tsx";

function Home() {
    return (
        <>
            <SubNav/>
            <NavigationBar />
            <Banner />
            <Discount/>
            <Category />
            <Hero1 />
            <Poster/>
            <PartnerCard/>
            <FAQContent/>
            <StatsDisplay/>
            <Footer/>

        </>
    );
}

// Create a named wrapped component
const WrappedHome = SectionWrapper(Home);

export default WrappedHome;
