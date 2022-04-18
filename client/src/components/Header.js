import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="container flex items-center justify-between text-white py-6">
            <div>
                <Link
                    to="/"
                    className="flex items-center text-3xl select-none cursor-pointer"
                >
                    Music Video Maker
                </Link>
                <p className="text-primary text-lg">
                    Make Music Video for your Social Media
                </p>
            </div>
            <ul className="hidden lg:flex items-center text-2xl gap-5">
                <a
                    href="https://www.repovic.ga/"
                    target="_blank"
                    rel="noreferrer"
                >
                    Developer
                </a>
                <a
                    href="https://www.paypal.me/vrepovic"
                    target="_blank"
                    rel="noreferrer"
                >
                    PayPal.me
                </a>
                <Link
                    to="/make"
                    className="px-4 py-2 bg-primary cursor-pointer rounded-lg select-none"
                >
                    Make Music Video
                </Link>
            </ul>
        </div>
    );
};

export default Header;
