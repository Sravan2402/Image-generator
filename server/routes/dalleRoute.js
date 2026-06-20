const express = require("express");
const dotenv = require("dotenv");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const FormData = require("form-data");
dotenv.config();
const router = express.Router();
router.route("/").get((req, res) => {
  res.send("hello world");
});
router.route("/").post(async (req,res)=>{
  try{
    const { prompt } = req.body;
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("output_format", "png");

    const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
        "Accept": "image/*",
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Stability error:", response.status, errBody);
      return res.status(response.status).json({
        message: "Stability AI image generation failed",
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    console.log("image generated via Stability");
    res.status(200).json({photo: base64Image});
  }
  catch(e){
    console.error(e);
    res.status(500).json({ message: "Something went wrong while generating the image" });
  }
})
module.exports = router;