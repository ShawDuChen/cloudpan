
module.exports = {
  getToken(value) {
    return this.jwt.sign(value, this.config.jwt.secret);
  },
};
