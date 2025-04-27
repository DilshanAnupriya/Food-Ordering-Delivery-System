import Navbar from '../../components/layout/Navbar';
import SubNav from '../../components/layout/SubNav';
import Footer from '../../components/layout/Footer';
import ContactForm from '../ContactUs/ContactForm';

const ContactUs = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <SubNav />
            <Navbar />
            <main className="flex-grow">
                <ContactForm />
            </main>
            <Footer />
        </div>
    );
};

export default ContactUs;