/**
 * Converts POJOs into Google Cloud Datastore Entities based on a Waterline Model
 *
 * @param {Object} config
 * @param {Entity} config.item
 * @param {Object} config.model
 * @param {Datastore} config.ds
 *
 * @returns {Object}
 */
function itemToEntity(config) {
  const {
    attributes,
    primaryKey,
    tableName
  } = config.model;
  const {
    item,
    ds
  } = config;
  const KEY_SYMBOL = ds.KEY;
  const entity = {};

  Object.keys(attributes).forEach(key => {

    const columnName = attributes[key].columnName || key;
    let val = item[columnName];
    const valDefined = typeof val !== 'undefined';
    const id = valDefined && (val + '').match(/^[0-9]+$/) ? ds.int(val) : val;

    if (key === primaryKey) {

      entity[KEY_SYMBOL] = ds.key([tableName, id]);

    } else {

      if (val === '__NULL__') { val = '"__NULL__"'; }
      if (val === null) { val = '__NULL__'; }

      if (valDefined) { entity[columnName] = val; }

    }

  });

  return entity;

}

module.exports = itemToEntity;
