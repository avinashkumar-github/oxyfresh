function cartController() {
  return {
    add(req, res) {
      res.json({ message: "test" });
    }
  };
}

module.exports = cartController;
