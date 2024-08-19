const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

async function ImageUpscale(imageFile, OutputFile) {
  const data = new FormData();
  data.append("image", fs.createReadStream(imageFile));
  data.append("sizeFactor", "2");
  data.append("imageStyle", "default");
  data.append("noiseCancellationFactor", "0");

  const options = {
    method: "POST",
    maxBodyLength: Infinity,
    url: "https://ai-picture-upscaler.p.rapidapi.com/supersize-image",
    headers: {
      "X-RapidAPI-Key": "66c64ebc2fmshee2fce70eb5d0f5p1cab80jsn2f97299d3648",
      "X-RapidAPI-Host": "ai-picture-upscaler.p.rapidapi.com",
      ...data.getHeaders(),
    },
    data: data,
    responseType: "arraybuffer",
  };

  try {
    console.log("Processing");
    const response = await axios.request(options);

    console.log("Content Type: ", response.headers['content-type']);
    console.log("Count Left: ", response.headers['x-ratelimit-requests-remaining']);
    fs.writeFileSync(OutputFile, response.data);
    
  } catch (error) {
    console.error(error);
  }
}

module.exports = ImageUpscale;
