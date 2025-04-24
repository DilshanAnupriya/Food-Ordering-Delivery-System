import SectionWrapper from "../../hoc/SectionWrapper.tsx";


const PosterSection = () => {
    return (
        <>
            <div className="mt-15">
                <img
                  src="src/assets/Food Delivery App Design.png"
                  alt=""
                   className=""
                />
            </div>
        </>
    )
}


const Poster = SectionWrapper(PosterSection);

export default Poster;
