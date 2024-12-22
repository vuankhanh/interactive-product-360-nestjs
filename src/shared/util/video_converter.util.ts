import { Injectable } from "@nestjs/common";
import { imageTypes, videoTypes } from "src/constant/file.constanst";
import { Readable, Stream, Writable } from "stream";

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

@Injectable()
export class VideoConverterUtil {
  constructor() { }

  static convert(file: Express.Multer.File, extension: string = videoTypes.webm.extension) {
    // Create a Readable stream from the file buffer
    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null);

    // Create an array to store the chunks of the output
    const chunks: any[] = [];
    // Create a Writable stream for the output
    const output = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      },
    });

    const outputWebmOption = ['-f', extension, '-c:v', 'libvpx-vp9', '-b:v', '1M', '-acodec', 'libvorbis'];
    return new Promise<Buffer>((resolve, reject) => {
      ffmpeg(stream)
        .outputOptions(outputWebmOption)
        .on('end', () => {
          const result = Buffer.concat(chunks);
          resolve(result);
        })
        .on('error', (error: Error) => {
          reject(error);
        })
        .output(output) // Output to the stream buffer
        .run();
    })

  }

  static generateThumbnail(video: Buffer, extension: string = imageTypes.webp.extension) {
    return new Promise<Buffer>((resolve, reject) => {
      // Create a Readable stream from the file buffer
      const stream = new Readable();
      stream.push(video);
      stream.push(null);

      // Create an array to store the chunks of the output
      const chunks: any[] = [];
      // Create a Writable stream for the output
      const output = new Writable({
        write(chunk, encoding, callback) {
          chunks.push(chunk);
          callback();
        },
      });

      ffmpeg(stream)
        .outputOptions('-ss 00:00:01') // Seek to the specific timestamp
        .outputOptions('-vframes 1') // Only output one frame (screenshot)
        .outputOptions('-vf scale=400:225') // Set the size of the screenshot
        .outputOptions('-f image2pipe') // Output format is a stream of images
        .outputOptions(`-vcodec ${extension}`) // Output codec is webp
        .on('end', () => {
          const result = Buffer.concat(chunks);
          resolve(result);
        })
        .on('error', (error: Error) => {
          reject(error)
        }).output(output) // Output to the stream buffer
        .run();
    })
  }
}