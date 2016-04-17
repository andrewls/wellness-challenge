/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/weeks              ->  index
 * POST    /api/weeks              ->  create
 * GET     /api/weeks/:id          ->  show
 * PUT     /api/weeks/:id          ->  update
 * DELETE  /api/weeks/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Week from './week.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    console.log("Saving updates");
    var updated = _.merge(entity, updates);
    if (updated !== null && updated !== undefined && updated.number === 0) {
      console.log("Merged object: ", updated);
    }
    // Mongoose can't detect that we've changed the array automatically, so we need to tell it
    // We'll lose a little efficiency by saving it every time, but we need to save changes to the array
    // and realistically speaking, we're never going to have a problem with performance with 10 people
    updated.markModified('days');
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Weeks
export function index(req, res) {
  return Week.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Week from the DB
export function show(req, res) {
  return Week.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets all of the Weeks associated with a user id
export function by_user(req, res) {
  return Week.find({user_id: req.params.id}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Week in the DB
export function create(req, res) {
  return Week.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Week in the DB
export function update(req, res) {
  if (req.body !== undefined && req.body !== null && req.body.number === 0)
    console.log("Request body: ", req.body);
  if (req.body._id) {
    delete req.body._id;
  }
  return Week.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Week from the DB
export function destroy(req, res) {
  return Week.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
