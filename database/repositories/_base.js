// The base repo was originally coded when I was working with mongoose, small changes may need to be
// made for using it with Sequelize

const errors = require('./../../backend/errors');
const DatabaseError = errors.DatabaseError;

/**
 * The Base Repository class.
 * @class
 */
class BaseRepository {
  /**
   * Initializes a new instance of the BaseRepository class.
   * @param {Object}  model  The mongoose model used in the repo.
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Finds a document using the given query.
   * @param  {Object}  query     The query object.
   * @param  {Object}  [sort]    The sort object.
   * @param  {Number}  [limit]   The limit number.
   * @param  {String}  [select]  The select statement.
   * @return {Promise}
   */
  read(query, sort, limit, select) {
    query = query || {};

    return new Promise((resolve, reject) => {
      const exp = this.model.find(query);

      if(sort) {
        exp.sort(sort);
      }

      if(limit) {
        exp.limit(limit);
      }

      if(select) {
        exp.select(select);
      }

      return exp.exec((error, docs) => error ?
        reject(new DatabaseError(error)) :
        resolve(docs));
    });
  }

  /**
   * Finds one document using the given query.
   * @param  {Object}  query     The query object.
   * @param  {Object}  [sort]    The sort object.
   * @param  {String}  [select]  The select statement.
   * @return {Promise}
   */
  readOne(query, sort, select) {
    query = query || {};

    return new Promise((resolve, reject) => {
      const exp = this.model.findOne(query);

      if(sort) {
        exp.sort(sort);
      }

      if(select) {
        exp.select(select);
      }

      return exp.exec((error, doc) => error ?
        reject(new DatabaseError(error)) :
        resolve(doc));
    });
  }

  /**
   * Finds a document with the given ID.
   * @param  {String}  id        The ID to find.
   * @param  {String}  [select]  The select statement.
   * @return {Promise}
   */
  readById(id, select) {
    return new Promise((resolve, reject) => {
      const exp = this.model.findById(id);

      if(select) {
        exp.select(select);
      }

      return exp.exec((error, doc) => error ?
        reject(new DatabaseError(error)) :
        resolve(doc));
    });
  }

  /**
   * Finds all documents.
   * @param  {Object}  [sort]    The sort object.
   * @param  {Number}  [limit]   The limit number.
   * @param  {String}  [select]  The select statement.
   * @return {Promise}
   */
  readAll(sort, limit, select) {
    return this.read({}, sort, limit, select);
  }

  /**
   * Creates a new document.
   * @param  {Mixed}  data  The document data.
   * @return {Promise}
   */
  create(data) {
    return new Promise((resolve, reject) => {
      return this.model.create(data, (error, docs) => {
        if(error) {
          return reject(new DatabaseError(error));
        }

        if(!Array.isArray(docs)) {
          return resolve(docs);
        }

        if(!docs.length) {
          return resolve(null);
        }

        if(docs.length === 1) {
          return resolve(docs[0]);
        }

        return resolve(docs);
      });
    });
  }

  /**
   * Updates a document using the given query.
   * @param  {Object}  query  The query object.
   * @param  {Object}  data   The updated document data.
   * @return {Promise}
   */
  update(query, data) {
    return new Promise((resolve, reject) => {
      return this.model.update(
        query,
        data,
        { multi: true, runValidators: true },
        (error, response) => error ? reject(new DatabaseError(error)) : resolve(response));
    });
  }

  /**
   * Updates a document with the given ID.
   * @param  {String}  id    The ID to find.
   * @param  {Object}  data  The updarted document data.
   * @return {Promise}
   */
  updateById(id, data) {
    return new Promise((resolve, reject) => {
      return this.model.findByIdAndUpdate(
        id,
        data,
        { new: true },
        (error, doc) => error ? reject(new DatabaseError(error)) : resolve(doc));
    });
  }

  /**
   * Updates a document if it exists, otherwise creates a new one.
   * @param  {Object}  query  The query object.
   * @param  {Object}  data   The updarted document data.
   * @return {Promise}
   */
  updateCreate(query, data) {
    if(!data.is_deleted) {
      data.is_deleted = false;
    }

    if(!data.created_at) {
      data.created_at = new Date();
    }

    if(!data.updated_at) {
      data.updated_at = new Date();
    }

    // Use as update upsert so it will reenable anything previously deleted or just add it if new
    return new Promise((resolve, reject) => {
      return this.model.update(
        query,
        data,
        { upsert: true, new: true },
        (error, doc) => error ? reject(new DatabaseError(error)) : resolve(doc));
    });
  }

  /**
   * Removes a document using the given query.
   * @param  {Object}  query  The query object.
   * @return {Promise}
   */
  delete(query) {
    return new Promise((resolve, reject) => this.model.remove(query, error =>
      error ? reject(new DatabaseError(error)) : resolve()));
  }

  /**
   * Removes a document using the given ID.
   * @param  {String}  id    The ID to find.
   * @return {Promise}
   */
  deleteById(id) {
    return new Promise((resolve, reject) => this.model.findByIdAndRemove(id, error =>
      error ? reject(new DatabaseError(error)) : resolve()));
  }

  /**
   * Counts the number of documents matching the given query.
   * @param  {Object}  query  The query object.
   * @return {Promise}
   */
  count(query) {
    return new Promise((resolve, reject) => this.model.count(query).exec((error, count) =>
      error ? reject(new DatabaseError(error)) : resolve(count)));
  }

  /**
   * Saves the given document.
   * @param  {Object}  doc  The document object to save.
   * @return {Promise}
   */
  saveDoc(doc) {
    return new Promise((resolve, reject) => doc.save(error =>
      error ? reject(new DatabaseError(error)) : resolve(doc)));
  }
}

/**
 * Gets the BaseRepository class.
 * @module
 */
module.exports = BaseRepository;
