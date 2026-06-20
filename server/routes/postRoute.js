const express = require("express");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const Post = require("../mongodb/models/post.js");
dotenv.config();
const router = express.Router();
// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// GET request to fetch all posts from the database
router.route("/").get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: post });
  } catch (e) {
    res.status(404).json({ success: false, message: e });
  }
});
// POST request to create a new post and upload the image to Cloudinary
router.route("/").post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;
    const photoUrl = await cloudinary.uploader.upload(photo);
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
    });
    res.status(200).json({ success: true, data: newPost });
  } catch (e) {
    res.status(404).json({ success: false, message: e });
  }
});
module.exports = router;
