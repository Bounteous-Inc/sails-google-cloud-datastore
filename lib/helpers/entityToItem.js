const { Datastore } = require('@google-cloud/datastore');
const KEY_SYMBOL = Datastore.KEY;

/**
 * Converts Google Cloud Datastore Entities into POJOs based on a Waterline Model
 *
 * @param {Object} config
 * @param {Entity} config.entity
 * @param {Object} config.model
 *
 * @returns {Object}
 */
function entityToItem(config) {

  const {
    attributes,
    primaryKey
  } = config.model;
  const entity = config.entity;
  const item = {};

  for (let key in attributes) {

    let {
      type,
      columnName
    } = attributes[key];
    let prop = columnName || key;
    let val = entity[prop];

    if (key === primaryKey) { val = entity[KEY_SYMBOL].path[1]; }

    if (val === '__NULL__') { val = null; }
    if (val === '"__NULL__"') { val = '__NULL__'; }

    if (typeof val === type || val === null) {
      item[prop] = val;
      continue;
    }

    if (typeof val === 'undefined') { continue; }

    switch (type) {
      case 'number':
        item[prop] = Number(val);
        break;
      case 'string':
        item[prop] = String(val);
        break;
      case 'boolean':
        item[prop] = Boolean(val);
        break;
      default:
        item[prop] = val;
    }

  }

  return item;

}

module.exports = entityToItem;
