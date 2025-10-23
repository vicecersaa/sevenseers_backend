const mongoose = require("mongoose");

const socialLinkSchema = new mongoose.Schema({
  logo: {
    type: String, // path/image URL ke icon sosial media
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const footerSectionSchema = new mongoose.Schema(
  {
    topFooter: {
      caption: { type: String, default: "" },
      sites: { type: String, default: "" },
      phoneNumber: { type: String, default: "" },
      email: { type: String, default: "" },
    },
    bottomFooter: {
      logo: { type: String, default: "" }, // path/image URL logo footer
      caption: { type: String, default: "" },
      socialLinks: [socialLinkSchema], // array of social link objects
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FooterSection", footerSectionSchema);
