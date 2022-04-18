import { Fragment, useState, useContext, useEffect } from "react";
import { Switch, Listbox, Transition } from "@headlessui/react";
import { MakeIllustration } from "../assets/";

import NotificationContext from "../context/NotificationContext";

const axios = require("axios");
const FileSaver = require("file-saver");

const MakeMusicVideo = () => {
    const [videoLink, setVideoLink] = useState("");
    const [videoDetails, setVideoDetails] = useState(null);
    const [withWatermark, setWithWatermark] = useState(true);
    const [startTime, setStartTime] = useState("00:00");
    const [endTime, setEndTime] = useState("");

    const [isProcessed, setIsProcessed] = useState(null);

    const backgrounds = [
        {
            id: 1,
            name: "Black (#000000)",
            value: "#000000",
        },
        {
            id: 2,
            name: "White (#FFFFFF)",
            value: "#FFFFFF",
        },
    ];
    const [selectedBackground, setSelectedBackground] = useState(
        backgrounds[0]
    );

    const resolutions = [
        {
            id: 1,
            name: "1080x1920 (9:16)",
            value: {
                width: 1080,
                height: 1920,
            },
        },
        {
            id: 2,
            name: "1920x1080 (16:9)",
            value: {
                width: 1920,
                height: 1080,
            },
        },
    ];
    const [selectedResolution, setSelectedResolution] = useState(
        resolutions[0]
    );

    const { showNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (selectedResolution.name === resolutions[1].name)
            setWithWatermark(false);
        if (selectedResolution.name === resolutions[0].name)
            setWithWatermark(true);
    }, [selectedResolution]);

    const getVideoDetails = async () => {
        if (!videoLink) {
            return;
        }
        setIsProcessed(false);
        if (videoLink.length > 0 && videoLink.includes("youtu")) {
            await axios
                .get(
                    `${process.env.REACT_APP_SERVER_URL}/?videoLink=${videoLink}`
                )
                .then(({ data }) => {
                    setIsProcessed(null);
                    if (data.success) {
                        console.log(data.data);
                        setVideoDetails(data.data);
                    } else {
                        showNotification(data?.error?.message);
                        console.error(data?.error?.message);
                    }
                })
                .catch((err) => {
                    setIsProcessed(null);
                    showNotification(err.message);
                    console.error(err.message);
                });
        } else {
            showNotification("Please enter a valid YouTube link!");
            setVideoLink("");
            setIsProcessed(null);
        }
    };

    const downloadVideo = async () => {
        setIsProcessed(false);
        await axios
            .post(
                process.env.REACT_APP_SERVER_URL,
                {
                    videoLink,
                    startAt: startTime,
                    endAt: endTime,
                    width: selectedResolution.value.width,
                    height: selectedResolution.value.height,
                    background: selectedBackground.value,
                    withWatermark,
                },
                {
                    responseType: "blob",
                }
            )
            .then(({ data }) => {
                setIsProcessed(true);
                showNotification("Processing finished, download started!");
                FileSaver.saveAs(data, "video.mp4");
            })
            .catch((error) => {
                setIsProcessed(null);
                if (error.response) {
                    const type = error.response.data.type;
                    if (type.includes("application/json")) {
                        let reader = new FileReader();
                        reader.addEventListener("loadend", function () {
                            const response = JSON.parse(reader.result);
                            showNotification(response.error.message);
                        });
                        reader.readAsText(error.response.data);
                    }
                    console.log(error);
                } else {
                    showNotification(error.message, "error");
                    console.error(error);
                }
            });
    };

    return (
        <div className="container w-full py-10 lg:py-32 flex flex-col-reverse lg:flex-row items-center justify-between gap-20 lg:gap-10 text-white">
            <div className="w-full">
                <p className="text-3xl">Make Music Video</p>
                <hr className="w-1/2 border-none bg-primary py-1 rounded-lg my-2" />
                <p className="text-xl">
                    Just paste YouTube Video Link and we will make it for you!
                </p>
                <form autoComplete="off" className="my-10 w-full lg:w-2/3">
                    <div className="flex flex-col gap-1 mb-5">
                        <label htmlFor="videoLink" className="text-xl">
                            Video Link:
                        </label>
                        <input
                            type="text"
                            id="videoLink"
                            onChange={(e) => setVideoLink(e.target.value)}
                            value={videoLink}
                            placeholder="https://www.youtube.com/watch?v=..."
                            disabled={videoDetails !== null}
                            className={`w-full text-xl truncate border-2 bg-dark text-white ${
                                videoDetails ? "cursor-not-allowed" : ""
                            } border-transparent focus:border-primary outline-none rounded-lg py-2 px-4`}
                        />
                    </div>
                    {videoDetails && (
                        <>
                            <div className="flex flex-row gap-10 mb-5">
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="background"
                                        className="text-xl"
                                    >
                                        Start time:
                                    </label>
                                    <input
                                        placeholder="MM:SS"
                                        value={startTime}
                                        onChange={(e) =>
                                            setStartTime(e.target.value)
                                        }
                                        disabled={
                                            isProcessed === false ? true : false
                                        }
                                        className={`w-full text-xl border-2 bg-dark text-white border-transparent focus:border-primary outline-none rounded-lg py-2 px-4 ${
                                            isProcessed === false
                                                ? "cursor-not-allowed"
                                                : ""
                                        }`}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="background"
                                        className="text-xl"
                                    >
                                        End time:
                                    </label>
                                    <input
                                        placeholder="MM:SS"
                                        value={endTime}
                                        onChange={(e) =>
                                            setEndTime(e.target.value)
                                        }
                                        disabled={
                                            isProcessed === false ? true : false
                                        }
                                        className={`w-full text-xl border-2 bg-dark text-white border-transparent focus:border-primary outline-none rounded-lg py-2 px-4 ${
                                            isProcessed === false
                                                ? "cursor-not-allowed"
                                                : ""
                                        }`}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 mb-5">
                                <label htmlFor="" className="text-xl">
                                    Resolution:
                                </label>
                                <Listbox
                                    value={selectedResolution}
                                    disabled={
                                        isProcessed === false ? true : false
                                    }
                                    onChange={setSelectedResolution}
                                >
                                    <div className="relative">
                                        <Listbox.Button
                                            className={`relative text-xl w-full py-2 pl-3 pr-10 text-left bg-dark rounded-lg shadow-md ${
                                                isProcessed === false
                                                    ? "cursor-not-allowed"
                                                    : "cursor-pointer"
                                            } focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-primary focus-visible:ring-offset-2 focus-visible:border-primary`}
                                        >
                                            <span className="block truncate">
                                                {selectedResolution.name}
                                            </span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                                                    />
                                                </svg>
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="z-10 absolute text-xl w-full py-1 mt-1 overflow-auto bg-dark rounded-lg shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                {resolutions.map(
                                                    (resolution) => (
                                                        <Listbox.Option
                                                            key={resolution.id}
                                                            className={({
                                                                active,
                                                            }) =>
                                                                `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                                                                    active
                                                                        ? "text-white bg-primary"
                                                                        : "text-white"
                                                                }`
                                                            }
                                                            value={resolution}
                                                        >
                                                            {({
                                                                selectedResolution,
                                                            }) => (
                                                                <>
                                                                    <span
                                                                        className={`block truncate ${
                                                                            selectedResolution
                                                                                ? "font-medium"
                                                                                : "font-normal"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            resolution.name
                                                                        }
                                                                    </span>
                                                                    {selectedResolution ? (
                                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                className="h-6 w-6"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                stroke="currentColor"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={
                                                                                        2
                                                                                    }
                                                                                    d="M5 13l4 4L19 7"
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    )
                                                )}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                            <div className="flex flex-col gap-1 mb-5">
                                <label htmlFor="" className="text-xl">
                                    Background:
                                </label>
                                <Listbox
                                    value={selectedBackground}
                                    disabled={
                                        isProcessed === false ? true : false
                                    }
                                    onChange={setSelectedBackground}
                                >
                                    <div className="relative">
                                        <Listbox.Button
                                            className={`relative text-xl w-full py-2 pl-3 pr-10 text-left bg-dark rounded-lg shadow-md ${
                                                isProcessed === false
                                                    ? "cursor-not-allowed"
                                                    : "cursor-pointer"
                                            } focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-primary focus-visible:ring-offset-2 focus-visible:border-primary`}
                                        >
                                            <span className="block truncate">
                                                {selectedBackground.name}
                                            </span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                                                    />
                                                </svg>
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="z-10 absolute text-xl w-full py-1 mt-1 overflow-auto bg-dark rounded-lg shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                {backgrounds.map(
                                                    (background) => (
                                                        <Listbox.Option
                                                            key={background.id}
                                                            className={({
                                                                active,
                                                            }) =>
                                                                `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                                                                    active
                                                                        ? "text-white bg-primary"
                                                                        : "text-white"
                                                                }`
                                                            }
                                                            value={background}
                                                        >
                                                            {({
                                                                selectedBackground,
                                                            }) => (
                                                                <>
                                                                    <span
                                                                        className={`block truncate ${
                                                                            selectedBackground
                                                                                ? "font-medium"
                                                                                : "font-normal"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            background.name
                                                                        }
                                                                    </span>
                                                                    {selectedBackground ? (
                                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                className="h-6 w-6"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                stroke="currentColor"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={
                                                                                        2
                                                                                    }
                                                                                    d="M5 13l4 4L19 7"
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    )
                                                )}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                            <div className="flex flex-row items-center gap-5 mb-5">
                                <label
                                    htmlFor="withWatermark"
                                    className="text-xl leading-loose"
                                >
                                    Include Watermark:
                                </label>
                                <Switch
                                    id="withWatermark"
                                    checked={withWatermark}
                                    disabled={
                                        isProcessed === false ||
                                        selectedResolution.name ===
                                            resolutions[1].name
                                            ? true
                                            : false
                                    }
                                    onChange={setWithWatermark}
                                    className={`${
                                        withWatermark ? "bg-primary" : "bg-dark"
                                    }
          relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full ${
              isProcessed === false ||
              selectedResolution.name === resolutions[1].name
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
          } transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                                >
                                    <span className="sr-only">Use setting</span>
                                    <span
                                        aria-hidden="true"
                                        className={`${
                                            withWatermark
                                                ? "translate-x-9"
                                                : "translate-x-0"
                                        }
            pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                                    />
                                </Switch>
                            </div>
                        </>
                    )}
                </form>
                <div className="flex items-center justify-start">
                    <p
                        className={`px-6 py-3 text-2xl ${
                            videoLink ? "bg-primary" : "bg-dark"
                        } flex items-center justify-start gap-3 rounded-lg select-none ${
                            videoLink ? "cursor-pointer" : ""
                        }`}
                        onClick={
                            videoDetails
                                ? isProcessed === false
                                    ? () => {
                                          showNotification(
                                              "Already processing, please wait!"
                                          );
                                      }
                                    : downloadVideo
                                : getVideoDetails
                        }
                    >
                        {videoDetails ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                />
                            </svg>
                        )}
                        {videoDetails
                            ? isProcessed === false
                                ? "Processing..."
                                : "Downlaod"
                            : isProcessed === false
                            ? "Loading..."
                            : "Next"}
                    </p>
                    {videoDetails && isProcessed !== false && (
                        <p
                            className={`ml-5 text-2xl inline rounded-lg select-none cursor-pointer`}
                            onClick={() => {
                                setVideoLink("");
                                setVideoDetails(null);
                                setStartTime("00:00");
                                setEndTime("");
                                setSelectedResolution(resolutions[0]);
                                setSelectedBackground(backgrounds[0]);
                                setWithWatermark(true);
                            }}
                        >
                            Go Back
                        </p>
                    )}
                </div>
            </div>
            <div className="w-full">
                {videoDetails ? (
                    <div className="bg-dark rounded-lg p-5 flex flex-col justify-center">
                        <a
                            href={videoDetails.video_url}
                            target="_blank"
                            rel="noreferrer"
                            draggable={false}
                        >
                            <img
                                className="w-full rounded-lg select-none cursor-pointer"
                                src={videoDetails.thumbnails.at(-1).url}
                                draggable={false}
                                alt={`${videoDetails.title} - Thumbnail`}
                            />
                        </a>
                        <p className="text-2xl mt-5">{videoDetails.title}</p>
                        <p className="text-xl">
                            {videoDetails.ownerChannelName}
                        </p>
                    </div>
                ) : (
                    <MakeIllustration />
                )}
            </div>
        </div>
    );
};

export default MakeMusicVideo;
