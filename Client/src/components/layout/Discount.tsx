
import { textVariant } from "../../util/motion.ts";
import { motion } from 'framer-motion';
import {Link} from "react-router-dom";
import SectionWrapper from "../../hoc/SectionWrapper.tsx";
import React from "react";

interface DiscountProps {
    image: string;
    name: string;
    restaurant: string;
}

const Nav = ()=>{
    return(
        <nav className="pl-1  py-10">
            <div className="max-w-7xl mx-auto  items-center ">
                {/* Logo */}

                <h2 className="text-black absolute font-black md:text-[25px] sm:text-[50px] xs:text-[40px] text-[15px] pt-2 ">
                    Exclusive Deals 🎉
                </h2>


                <div className="flex items-center justify-end   w-full">
                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-gray-700   rounded-2xl hover:text-white transition-colors text-[14px] mr-10"
                        >
                            vegan
                        </Link>
                        <Link
                            to="/browse-menu"
                            className="text-gray-700 hover:text-orange-500 transition-colors text-[14px] mr-10"
                        >
                            Sushi
                        </Link>
                        <Link
                            to="/contact"
                            className="text-gray-700 hover:text-orange-500 border-2  px-6 py-2 border-[#FC8A06] rounded-2xl transition-colors text-[14px]"
                        >
                            Pizza & Fast food
                        </Link>
                        <Link
                            to="/contact"
                            className="text-gray-700 hover:text-orange-500 transition-colors text-[14px] mr-4"
                        >
                            Others
                        </Link>

                    </div>

                </div>
            </div>
        </nav>
    )
}

const DiscountCard: React.FC<DiscountProps> = ({image,name,restaurant})=>{
    return(
        <>

            <div className="relative w-full max-w-sm mx-auto md:max-w-md lg:max-w-lg rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
                <div className="relative">
                    <img
                        src={image}
                        alt="Restaurant food display"
                        className="w-full h-48 sm:h-56 md:h-64 object-cover"
                    />

                    {/* Discount badge */}
                    <div className="absolute top-0 right-0 bg-black text-white font-bold py-2 px-4 rounded-bl-lg">
                        -10%
                    </div>

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-orange-400 font-medium text-sm sm:text-base">{restaurant}</p>
                        <h2 className="text-white text-xl sm:text-2xl font-bold">{name}</h2>
                    </div>
                </div>


            </div>
        </>
    )
}


const Discount = () => {
    return (
        <>
            <motion.div variants={textVariant(0.3)}>
            <Nav/>
            </motion.div>
            <div className="flex items-center  gap-15 w-full">
                <DiscountCard image={"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/" +
                    "2wCEAAkGBxMTEhUSEhIWFhUWFxgVFxgXGBgYFhUXFxoXFxcXGRYYHSggGB0lGxUVITEiJSkrLi4uFx8zODMtNygtLisBCg" +
                    "oKDg0OGxAQGy4mICYwLys1MDIvLS0tListLy0tLS0vLS0tLy8yLS0tNy0tNS0tLy0tLS0tLS0uLS0tLS0tLf/AABEIALcB" +
                    "EwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAEAgMFBgcAAQj/xAA/EAACAQIEAwYDBgQGAgIDAAABAhEAAwQSITEF" +
                    "QVEGEyJhcZEygaEHFEKx0fAjUpLBFTNTYuHxJHJDskSCwv/EABoBAAMBAQEBAAAAAAAAAAAAAAECAwQABQb/xAAwEQACAgED" +
                    "AQMNAQEBAQAAAAAAAQIRAxIhMQRBUZEFExQiMmFxgaGxwdHw4ULxI//aAAwDAQACEQMRAD8A8JpF06UugcXdivFPpB21c1pN" +
                    "4TQVm7rRqtNGgDLpXAU+yzSMtcA8ApamkPpTBv1wGLv3KHz0m/eFO8P4bfvmLNl3mTIHh0ifEYHMc+dMkI3XIzcem1uVbeF9" +
                    "hCYOLu92WnLbQqzyNWzMZURp19RT1rszhLbhAbmLuEkQpyIB18OsiP5ue1GTUeWIp3wUm5coN73nWtY04fDgIMDZV4kZgrED" +
                    "kWJBJOh50JwNLedc2HsLb8UstqJn+a4cx35D02qb6jGpab3HUZuOqtjNxhbuVbgtvkY5VbK2ViNSFManQ7dKlMP2axryq4a5" +
                    "IgmQFidvjIrRMbindzbt4vLaCuzOyi2lsAiEUiCYH5UngS3bbW3u3cqnwW13a4TIUlB4iIM667TRWZOVJbd+37Faajdq+7cz" +
                    "q/wXEplBQSxACrctsxJ0HhVid4qQwnY3HO2XuQpjN4nTQeYBJ+lXS4bCSL6o9x2YXMtru7ymSRdDMSAIywOcioxeK2rVtjZs" +
                    "" +
                    "kX9QLpcqxE/Ecsgaa5dqV51F1KvH/wBGUZyXqr6bfdEXi+xONtgMe7YSASHjLOktmA0HWmB2auAw2Iwq+LLreGrROXQb61KYL" +
                    "G4nRwt66iuGuCWZSSfhg7gk/CKNsY7Dviy6WLlq8MoXJACsQVcvbcADRhPpyoLqIyVrb4nPHkjae/w/JW14FeyZx3ZGsgXE" +
                    "kEErEE66jlNP2uzeKdO8WycusSVBMaaAmTQfaqzjRdF/EKU1hSoWJBkeJCddJ3oXCccxTvlbEaP4SbrEWwIIkxtE70Vkfai" +
                    "ixScbi0EcS4VesQL1tknaYg/MaUCoq88P7RYbC4V7N7EJfuopcFHa53hElVMzlOw6RrXHh2GvYdbhsG1dv2jfthAzZcurCA" +
                    "SCSCJUAHXyqvKIa2uV8ymWpotUmnLWCJsrfRldG6EZ01jxputeK0UjKJ2eHSozE70ViblBZq5BEpM0Zbs+dJwyine+1osK" +
                    "Q6ugoa5ek0TcGlCXRFA4bvNpQyAinSa6KZHWd3ldXBK6uo6yeoLE25o1jpQ+9IOR9u1rUgiUoWhTpXSus4apDUs0NeeKIr" +
                    "E4h6ZwWBuXScikqsZ2AkIpIE7iT5bmj+DcNOIuFS2VFGZ33yrygcyToP8AirY12LWS1by2rcaAaAnTMx5meZpMmVY17wKL" +
                    "k6QrBdm8HCsGRQhnPd8Vx201KTlA6Ag1MYvEMiNfAWMot2sxKaciEG7M4AA322qDfhN7uxdJ8yAfEqQTmPQaetBYoQA1yA" +
                    "ikKM06Z2ynKus7z5xUfSJr2o8g8xGT2lZKWLbSr4lEu3chhnuEd2uklkAygE+eseVeX+MssBUteFSpMEhuhAkEDeBPOnRx" +
                    "O2g7vCqHAnPcuAhSw010lzOsCBpvTHEMQ+JdVS1bB3YqAXeBHxHYes7DWjJ0qjLfx+oIq3co7eFfIh7IBaH5+5jU6irFexDX" +
                    "1azataMmREBhLYG7nqdR02+dCcVw6WnW2rhmP4cpkCDrpoBoRSsOtnunD4h7WaVIQMMw6ZlExPIEVHGpQnpb+PH5K5HGcVJf" +
                    "Ln7IjcZ3KYfvO8zXO8yFAJHxZTBEzEEz5Gk2brXL2FGgsoGDkGC2YhlmBIgz70XwrgYey5WVCpNpAILHWAVI02+vKmrwtZB" +
                    "ZW2/3klQxYhVtNoWHhJnQnl50mmSWpJJe/t/0pqi2422/tf6DV4Cz4lxfux3njt5S13MqwBnn4YBXy86fxVi0tm7aOHd+6d" +
                    "AO5XK11iAfjOu7QQOhGu1RnEMO+DvhC4l1zEpILIDBB2O8UHxnH371x4JVGyBbduRomZgTGpMmfYcqoskYSeqNS8eSaxTy" +
                    "VUrj4cEr2X4i/erbxo7pFBNu22iKwIKsdBmI/mPPXeofG9rkHFbhbMbKIbIayYLnfMWB8YDSBt84ojE9pTdwzo6C5dMC1" +
                    "4VIUkEMxO4MEa+tU/F4C7Z7o3kZe9WUYkeMgbxyGq6GrY8vq0t+34fc6PTpzbnt2V3+9EtZ4PcxbXsSWa5h7Dyz3CVuMgGY" +
                    "5V6hJ6DpvUb2swFi1iF+6vns3UDoZzZSZGQnroNDrrT68SvLh7thLhW3cXLciJgjUajQEEiR71PcDxFzHImFvuRYWJyW1D" +
                    "EoQVXvD4UGkkxMCNzTQnFqu0eanjer/lfb9lX7adnzgDYW5cVmupnIVYyMIld9RqADpzpnsrx1LeLsPiXc27JOUSSqyCJ" +
                    "C+sHTpU/xbs8MXxUJiL5uKbTMFtEu9q1bnJbJAO877mT5VB27HCwcTavHEW2RyLN3KxhQBo9qJnNO4GkbVp0rlEFk1QqW" +
                    "+wZx3H4exjbt9WtO7N94tQ2exeQqFaxcVdUfMrMpPMiaMfiKXlS7msq10wLdpiYPJdQPFyIjlpM1n3C7mHGIRsSrPZzjO" +
                    "FkMy7aaz0MTUrwHgNu7ijmN6zacXbmEYCHu5HIUIzcxHrIjSRVJQVbkL0ss1631oHu9ab7P8Re8rJcBLLIzkEZ40JM7Nq" +
                    "JHnUhcs1Bpp0zQmmrOtJpTRWDT9qYpi8KARbXaafUUhXikm5NGhRthXW2pboaYVYNMcGrbFdSFfzryloOxKTpXiV1saU2z" +
                    "RSjjrNSDfpJM153dEDEPdpi40066ipDs6wW4zkAlUIWdgzELPsWoSkoq2Cm3SLDh+7t2LVkDJoGuuRqWPxExqQswB5VIWF" +
                    "LzZwwAR4nPrIXXMSeZPKod03BMk67bfuKXevMCCCRpEglSJ0MEbaTXkektzuX+13Gh4fVqP+X3kthsI2c4dbygOs3AIMRIK" +
                    "nz9I50DYtAjPOafxHUeop7AWVXDd8yMS5bIkF5Mx4mPVuZ61Jrgh3TP4URB5ACBsAOlbFj1pJL69n9uZnk0N2/dx2kNkVRn" +
                    "cFgDOURLc43ruFYM32JYAF2JKj4bYjRZHQR85om5dtJlQuSXKgjIQ6ToRtpE/SRNSK2bdpnfvbajIr21JA0Ualgeumv6U8c" +
                    "XZ4gnlrdXfYRvDuH4excuEWi4EKCNM7AazJ1AJI57GmOKYU/dxcCHvTd/CGNtFLdYgKEA1MSfWKnziHIN3+Eh0kuG8KRObcb" +
                    "E67aDehMVbY2xYuXS8eMhQqhwWaDAGwbYTy51Z4ouL7t+z8kY5Zal37dv8hjB3haviwbkGASwByxOok6CYj0NVy9hgMRiO6" +
                    "Ja33k55nVhmIzc8pOUHX4akOKYq4zgNdLKDoIUanQFgo1OU89KmcFiTZtE92HzeEqTAM7DYjqI86yS0S/+fC5vuNC1Q9flv" +
                    "" +
                    "aiH4Mq3L5uvZOJusAihmHhCzMhtI/U86EN17OKd3RIDDS1LWreYR3ReAMxA16Zh6V5YDIGVpnUECYnXSTvvqaE4" +
                    "5xa/dtrh1V" +
                    "LWHRk8NsEEhCGUSToNAdB86njyRlFxm91wy/m5a7jw9n8P7uXzJpwxwWLa3ZtoSLlzvGacsiQF0nMACeQBIqkcd4jicY1q/c" +
                    "HgBFpSFItIWifEZ1IAJk7CpHiuOuNZ7gOwtGGdVjx9QW3jQeEVGdqO0j38JZwlq0tu3bKksGlnImDljw6kk7ya14Jq" +
                    "cUuO8CwyhLUle/gi4cGwy4bEqtwreJ+AIVMyIDQ0CASPFTXGMReQ4/8A89rIS214WVUoQzAhQHdPEGYSSh1LGqnwTFEN" +
                    "m/FzjQmPyr3thev4y/YRwrMFKLlU5nk/ik6nTkOZ60uCSjNwfxOy9PJtSvs/tiF7M465hz31gsrfDmAEAnUAkiDInSrJ" +
                    "wSwMS+Ix+OKXEsJL2yFXvYDlRCx5amZ0FWNsBYwOEbDXla4XVLr2xbLGy4JHeFrcgJI3JGi+cVm3Gyzu17u+7s3HItjK" +
                    "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"}
                name={"Cheese Burger"}
                restaurant={"Burger King"}
                />
                <DiscountCard image={"https://cdn.shopify.com/s/files/1/0274/9503/9079/files/TomatoRicotta-_Resized_7d8f3685-8c73-4d77-9f08-5eee0147eb05.jpg?v=1723657379"}
                              name={"Veg-Pizza"}
                              restaurant={"Pizza Hut"}
                />
                <DiscountCard image={"https://deliciousmadeeasy.com/wp-content/uploads/2018/04/chocoholic-cold-brew-coffee-1-of-1-7-720x720.jpg"}
                              name={"ice Coffee"}
                              restaurant={"Barista"}
                />
            </div>

        </>
    );
};


const DiscountWrapper = SectionWrapper(Discount);

export default DiscountWrapper;
