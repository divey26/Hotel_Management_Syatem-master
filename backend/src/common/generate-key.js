function generateUniqueId(prefix) {
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  return prefix + randomNumber;
}

module.exports = generateUniqueId;
