'use strict';

const { Controller } = require('egg');

class PostsController extends Controller {
  // /post GET
  async index() {
    this.ctx.body = 'posts get';
  }

  // /post/:id GET
  async show() {
    this.ctx.body = 'posts show';
  }

  // /post/new GET
  async new() {
    this.ctx.body = 'posts new';
  }

  // /post/:id/edit GET
  async edit() {
    this.ctx.body = 'posts edit';
  }

  // /post POST
  async create() {
    this.ctx.body = 'posts post';
  }

  // /post/:id PUT
  async update() {
    this.ctx.body = 'posts put';
  }

  // /post/:id DELETE
  async destroy() {
    this.ctx.body = 'posts delete';
  }

}

module.exports = PostsController;
