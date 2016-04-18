/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/weeks              ->  index
 * POST    /api/weeks              ->  create
 * GET     /api/weeks/:id          ->  show
 * PUT     /api/weeks/:id          ->  update
 * DELETE  /api/weeks/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;
exports.show = show;
exports.by_user = by_user;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _week = require('./week.model');

var _week2 = _interopRequireDefault(_week);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function (entity) {
    console.log("Saving updates");
    var updated = _lodash2.default.merge(entity, updates);
    if (updated !== null && updated !== undefined && updated.number === 0) {
      console.log("Merged object: ", updated);
    }
    // Mongoose can't detect that we've changed the array automatically, so we need to tell it
    // We'll lose a little efficiency by saving it every time, but we need to save changes to the array
    // and realistically speaking, we're never going to have a problem with performance with 10 people
    updated.markModified('days');
    return updated.save().then(function (updated) {
      return updated;
    });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove().then(function () {
        res.status(204).end();
      });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Weeks
function index(req, res) {
  return _week2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Week from the DB
function show(req, res) {
  return _week2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Gets all of the Weeks associated with a user id
function by_user(req, res) {
  return _week2.default.find({ user_id: req.params.id }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new Week in the DB
function create(req, res) {
  return _week2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Updates an existing Week in the DB
function update(req, res) {
  if (req.body !== undefined && req.body !== null && req.body.number === 0) console.log("Request body: ", req.body);
  if (req.body._id) {
    delete req.body._id;
  }
  return _week2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Week from the DB
function destroy(req, res) {
  return _week2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=week.controller.js.map
