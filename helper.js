module.exports = {
  msgSplit: (msg) => {
    return [
      msg.substring(0, 1999),
      msg.substring(2000, 3999)
    ]
  }
}