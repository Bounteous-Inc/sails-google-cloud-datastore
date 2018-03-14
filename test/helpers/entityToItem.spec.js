/*eslint camelcase: ["error", {properties: "never"}]*/
const assert = require('assert');
const GoogleCloudDatastore = require('@google-cloud/datastore');
const ds = new GoogleCloudDatastore({projectId: 'foo'});
const KEY_SYMBOL = ds.KEY;
const entityToItem = require('../../lib/helpers/entityToItem.js');

describe('entityToItem()', () => {

  let entity;
  let model;
  let key;

  beforeEach(() => {

    model = {
      primaryKey: 'fname',
      attributes: {
        fname: {
          type: 'string',
          columnName: 'first_name'
        },
        lname: {
          type: 'string',
          columnName: 'last_name'
        }
      }
    };

    entity = {
      last_name: 'Bar'
    };

    key = ds.key(['first_name', 'Foo']);
    entity[KEY_SYMBOL] = key;

  });

  it('should convert an entity to an item', () => {

    const expected = {
      first_name: 'Foo',
      last_name: 'Bar'
    };

    const outcome = entityToItem({entity, model});

    assert.deepEqual(outcome, expected);

  });

  it ('should convert a stored string to a numeric item', () => {

    model.attributes.fname.type = 'number';

    key = ds.key(['first_name', '1']);
    entity[KEY_SYMBOL] = key;

    const outcome = entityToItem({entity, model});

    assert.equal(outcome.first_name, 1);

  });

  it('should convert __NULL__ to null', () => {

    entity.last_name = '__NULL__';

    const expected = {
      last_name: null
    };

    const outcome = entityToItem({entity, model});

    assert.equal(outcome.last_name, expected.last_name);

  });

  it('should convert "__NULL__" to __NULL__', () => {

    entity.last_name = '"__NULL__"';

    const expected = {
      last_name: '__NULL__'
    };

    const outcome = entityToItem({entity, model});

    assert.equal(outcome.last_name, expected.last_name);

  });

  it ('should not set undefined values', () => {

    entity.last_name = undefined;

    const outcome = entityToItem({entity, model});

    assert.deepEqual(Object.keys(outcome), ['first_name']);

  });

});
