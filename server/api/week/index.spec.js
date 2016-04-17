'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var weekCtrlStub = {
  index: 'weekCtrl.index',
  show: 'weekCtrl.show',
  create: 'weekCtrl.create',
  update: 'weekCtrl.update',
  destroy: 'weekCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var weekIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './week.controller': weekCtrlStub
});

describe('Week API Router:', function() {

  it('should return an express router instance', function() {
    weekIndex.should.equal(routerStub);
  });

  describe('GET /api/weeks', function() {

    it('should route to week.controller.index', function() {
      routerStub.get
        .withArgs('/', 'weekCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/weeks/:id', function() {

    it('should route to week.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'weekCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/weeks', function() {

    it('should route to week.controller.create', function() {
      routerStub.post
        .withArgs('/', 'weekCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/weeks/:id', function() {

    it('should route to week.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'weekCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/weeks/:id', function() {

    it('should route to week.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'weekCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/weeks/:id', function() {

    it('should route to week.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'weekCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
