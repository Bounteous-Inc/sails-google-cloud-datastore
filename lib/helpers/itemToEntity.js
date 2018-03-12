/**
 * Converts POJOs into Google Cloud Datastore Entities based on a Waterline Model
 *
 * @param {Object} config
 * @param {Entity} config.item
 * @param {Object} config.model
 * @param {Datastore} config.gcDatastoreInstance
 * @param {String} config.tableName
 *
 * @returns {Object}
 */
function itemToEntity(config) {

  const {
    attributes,
    primaryKey
  } = config.model;
  const {
    item,
    gcDatastoreInstance,
    tableName
  } = config;
  const KEY_SYMBOL = gcDatastoreInstance.KEY;
  const entity = {};

  for (let key in attributes) {

    let columnName = attributes[key].columnName || key;
    let val = item[columnName];

    if (key === primaryKey) {

      let dsKey = gcDatastoreInstance.key([tableName, val]);
      entity[KEY_SYMBOL] = dsKey;

    } else {

      if (val === '__NULL__') { val = '"__NULL__"'; }
      if (val === null) { val = '__NULL__'; }

      if (typeof val !== 'undefined') entity[columnName] = val;

    }

  }

  return entity;

}

module.exports = itemToEntity;
