const { Message } = require("../models");

// HOME PAGE
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("author")
      .sort({ createdAt: -1 });

    res.render("index", { messages });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// NEW MESSAGE FORM
exports.newMessageGet = (req, res) => {
  res.render("new-message");
};

// CREATE MESSAGE
exports.newMessagePost = async (req, res) => {
  try {
    await Message.create({
      title: req.body.title,
      text: req.body.text,
      author: req.user._id,
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// DELETE MESSAGE
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};