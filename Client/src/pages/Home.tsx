import Banner from '../components/layout/Banner';
import Hero1 from "../components/layout/Hero1.tsx";
import  SectionWrapper  from "../hoc/SectionWrapper";
import NavigationBar from "../components/layout/Navbar.tsx";
import SubNav from "../components/layout/SubNav.tsx";

function Home() {
    return (
        <>
            <SubNav/>
            <NavigationBar />
            <Banner />
            <Hero1 />

        </>
    );
}

// Create a named wrapped component
const WrappedHome = SectionWrapper(Home);

export default WrappedHome;
