'use strict';

const ExtendableError = require('./_extendable-error');

/**
 * The DatabaseError class.
 */
class DatabaseError extends ExtendableError {}

/**
 * Gets the {@link DatabaseError} class.
 * @module
 */
module.exports = DatabaseError;
