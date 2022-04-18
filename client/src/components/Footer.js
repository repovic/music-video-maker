import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="container flex items-center justify-between text-white py-6">
            <Link
                to="/"
                className="hidden lg:flex items-center text-3xl select-none cursor-pointer"
            >
                Music Video Maker
            </Link>
            <div className="text-center lg:text-left text-xl">
                Copyright &copy; {new Date().getFullYear()}{" "}
                <a href="https://www.repovic.ga/" className="text-primary">
                    Vasilije Repović
                </a>{" "}
                - All rights reserved!
            </div>
        </div>
    );
};

export default Footer;
