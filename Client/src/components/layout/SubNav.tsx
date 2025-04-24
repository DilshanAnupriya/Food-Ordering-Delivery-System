import SectionWrapper from "../../hoc/SectionWrapper.tsx";

const SubNavBar = () => {
    return (
        <nav className="bg-[#FAFAFA]  pl-6 py-0">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                <div className="flex items-center justify-between">
                    <img
                        src="src/assets/Star Icon.png"
                        alt="terminal"
                        className="pr-2  w-6"
                    />
                    <h3 className="text-xs"> Get 5% Off your first order, Promo: ORDER5</h3>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center ">
                    <img
                        src="src/assets/Location.png"
                        alt="terminal"
                        className="pr-2 w-6"
                    />
                    <h3 className="text-xs">Regent Street, A4, A4201, London</h3>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center h-full  ">
                  <div className="flex items-center justify-between w-16 h-13 bg-green-600  rounded-bl-lg border-r-[1px] border-white ">
                      <img
                          src="src/assets/Full Shopping Basket.png"
                          alt="terminal"
                          className="pl-5 w-12"
                      />
                  </div>
                    <div className="flex items-center justify-between w-16 h-13 bg-green-600 rounded-br-lg  border-[#FAFAFA]">
                        <h3 className="text-xs text-white pl-2">23 Items</h3>
                    </div>

                </div>
            </div>
        </nav>
    );
};


const SubNav = SectionWrapper(SubNavBar);

export default SubNav;
