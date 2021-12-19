module.exports = function (input) {
  if (!input.trim()) {
    throw new Error("This is a required field!!");
  }
  return true;
};
