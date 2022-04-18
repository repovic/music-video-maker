import { Link } from "react-router-dom";

import {
    LandingIllustration,
    Step1Illustration,
    Step2Illustration,
    Step3Illustration,
    Step4Illustration,
} from "../assets/";

const Landing = () => {
    return (
        <>
            <div className="container w-full py-10 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-20 lg:gap-10 text-white">
                <div className="w-full">
                    <p className="text-2xl lg:text-3xl mb-3">
                        Always wanted to share music to your Social Media, but
                        song is not available outside YouTube?
                        {/* Have you ever wanted to share a song on your Social
                        Media but that exact song is not available? */}
                    </p>
                    <hr className="w-1/2 border-none bg-primary py-1 rounded-lg my-2" />
                    <p className="text-xl lg:text-2xl mb-7">
                        With Music Video Maker you can easily create music video
                        for your favorite songs.
                    </p>
                    <Link
                        to="make"
                        className="px-6 py-3 text-2xl bg-primary rounded-lg select-none"
                    >
                        Make Music Video
                    </Link>
                    <p className="text-light text-lg lg:text-xl mt-5 select-none">
                        No registration required ;)
                    </p>
                </div>
                <div className="flex max-w-[500px] lg:max-w-[700px] w-full justify-end">
                    <LandingIllustration />
                </div>
            </div>
            <div className="w-full bg-dark text-white py-5">
                <div className="container flex flex-col lg:flex-row items-center justify-between gap-5">
                    <div className="flex flex-col items-center justify-between max-h-[250px] bg-black p-5 rounded-lg">
                        <Step1Illustration />
                        <p className="text-xl mt-5 text-center">
                            Paste Video link from YouTube
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-between max-h-[250px] bg-black p-5 rounded-lg">
                        <Step2Illustration />
                        <p className="text-xl mt-5 text-center">
                            Choose Start and End time
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-between max-h-[250px] bg-black p-5 rounded-lg">
                        <Step3Illustration />
                        <p className="text-xl mt-5 text-center">
                            Download your Music Video
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-between max-h-[250px] bg-black p-5 rounded-lg">
                        <Step4Illustration />
                        <p className="text-xl mt-5 text-center">
                            Share it on your Social Media
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Landing;
