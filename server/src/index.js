const fs = require("fs");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const {
    getVideoID,
    getVideoInfo,
    downloadFromYoutube,
    processVideo,
    addWatermark,
} = require("./services/musicVideo.service");
require("dotenv").config({
    path: "../.env",
});

const app = express();

app.use(
    cors({
        origin: "*",
    })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

router.get("/", async (req, res) => {
    try {
        const { videoLink } = req.query;
        if (!videoLink) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "All fields are required!",
                },
            });
        }

        const videoID = getVideoID(videoLink);
        const videoInfo = await getVideoInfo(videoID);
        res.status(200).json({
            success: true,
            data: videoInfo.videoDetails,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: "Server error occurred!",
            },
        });
        console.log(error);
    }
});

router.post("/", async (req, res) => {
    try {
        const {
            videoLink,
            startAt,
            endAt,
            width,
            height,
            background,
            withWatermark,
        } = req.body;
        if (!videoLink || !startAt || !endAt) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "All fields are required!",
                },
            });
        }

        const videoID = getVideoID(videoLink);
        const videoInfo = await getVideoInfo(videoID);

        if (videoInfo.videoDetails.lengthSeconds > 60 * 5) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Video duration must be less than 5 minutes!",
                },
            });
        }

        const allowedResolutions = ["1080x1920", "1920x1080"];

        if (!allowedResolutions.includes(`${width}x${height}`)) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Allowed resolutions are 1080x1920 and 1920x1080!",
                },
            });
        }

        const startAtSeconds =
            Number(startAt.split(":")[0] * 60) + Number(startAt.split(":")[1]);
        const endAtSeconds =
            Number(endAt.split(":")[0] * 60) + Number(endAt.split(":")[1]);

        if (startAtSeconds >= endAtSeconds) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Start time must be less than end time!",
                },
            });
        }

        if (endAtSeconds - startAtSeconds > 60) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Video must be less than 1 minute!",
                },
            });
        }

        if (endAtSeconds > videoInfo.videoDetails.lengthSeconds) {
            fs.unlink(videoPath, () => {});
            return res.status(400).json({
                success: false,
                error: {
                    message: "End time must be less then video length!",
                },
            });
        }

        if (width !== 1080 && height !== 1920 && withWatermark) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Resolution must be 1080x1920 for withWatermark!",
                },
            });
        }

        const videoPath = await downloadFromYoutube(videoID).catch((err) => {
            return res.status(400).json({
                success: false,
                error: {
                    message: err.message,
                },
            });
        });

        const processedVideoPath = await processVideo(
            videoPath,
            path.join(
                __dirname,
                "../videos/",
                `${videoID}-${startAtSeconds}-${endAtSeconds}-${width}x${height}.mp4`
            ),
            {
                startAt: startAtSeconds,
                endAt: endAtSeconds,
                width,
                height,
                background,
            }
        );

        const withWatermarkVideoPath =
            withWatermark === true
                ? await addWatermark(
                      processedVideoPath,
                      path.join(
                          __dirname,
                          "../watermarks/",
                          `${width}x${height}-${background.split("#")[1]}.png`
                      ),
                      path.join(
                          __dirname,
                          "../videos/",
                          `${videoID}-${startAtSeconds}-${endAtSeconds}-${width}x${height}-withWatermark.mp4`
                      )
                  )
                : null;

        res.download(
            withWatermarkVideoPath ? withWatermarkVideoPath : processedVideoPath
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: "Server error occurred!",
            },
        });
        console.log(error);
    }
});

app.use(router);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
});
