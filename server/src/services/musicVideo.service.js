const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");

const self = (module.exports = {
    getVideoID: (videoLink) => {
        try {
            const videoID = ytdl.getURLVideoID(videoLink);
            return videoID;
        } catch (error) {
            console.log(error);
        }
    },
    getVideoInfo: async (videoID) => {
        try {
            return await ytdl.getBasicInfo(videoID);
        } catch (error) {
            console.log(error);
        }
    },
    downloadFromYoutube: (videoID) => {
        try {
            return new Promise((resolve, reject) => {
                const outputPath = path.resolve(
                    __dirname,
                    `../../temp/${videoID}.mp4`
                );
                ytdl(`http://www.youtube.com/watch?v=${videoID}`, {
                    quality: 18,
                })
                    .pipe(fs.createWriteStream(outputPath))
                    .on("finish", () => {
                        resolve(outputPath);
                    })
                    .on("error", (err) => {
                        reject(err);
                    });
            });
        } catch (error) {
            console.log(error);
        }
    },
    processVideo: (
        videoPath,
        outputPath,
        {
            startAt = 0,
            endAt = startAt + 60,
            width = 1080,
            height = 1920,
            background = "#000000",
        }
    ) => {
        try {
            return new Promise((resolve, reject) => {
                ffmpeg(videoPath)
                    .setStartTime(startAt)
                    .setDuration(endAt - startAt)
                    .size(`${width}x${height}`)
                    .autopad(true, background)
                    .output(outputPath)
                    .on("end", () => {
                        fs.unlink(videoPath, () => {});
                        resolve(outputPath);
                    })
                    .on("error", (err) => {
                        fs.unlink(videoPath, () => {});
                        reject(err);
                    })
                    .run();
            });
        } catch (error) {
            console.log(error);
        }
    },
    addWatermark: async (videoPath, watermarkPath, outputPath) => {
        try {
            return new Promise((resolve, reject) => {
                ffmpeg(videoPath)
                    .input(watermarkPath)
                    .complexFilter([
                        "overlay=x=(main_w-overlay_w)/2:y=1920-500",
                    ])
                    .output(outputPath)
                    .on("end", () => {
                        fs.unlink(videoPath, () => {});
                        resolve(outputPath);
                    })
                    .on("error", (err) => {
                        reject(err);
                    })
                    .run();
            });
        } catch (error) {
            console.log(error);
        }
    },
});
