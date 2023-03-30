// app/extend/context.js
module.exports = {
  // success
  apiSuccess(data = '', msg = 'ok', code = 200) {
    this.body = { msg, data, code };
    this.status = code;
  },
  apiFail(data = '', msg = 'fail', code = 400) {
    this.body = { msg, data, code };
    this.status = code;
  },
};
