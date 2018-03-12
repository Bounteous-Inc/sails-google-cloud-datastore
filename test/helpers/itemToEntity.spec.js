const assert = require('assert');
const GoogleCloudDatastore = require('@google-cloud/datastore');
const gcDatastoreInstance = new GoogleCloudDatastore({projectId: 'foo'});
const KEY_SYMBOL = gcDatastoreInstance.KEY;
const itemToEntity = require('../../lib/helpers/itemToEntity.js');

describe('itemToEntity()', () => {

  const tableName = 'users';
  const model = {
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
  let item;

  beforeEach(() => {
    item = {
      last_name: 'Bar',
      first_name: 'Foo'
    };
  });

  it('should convert an item to an entity', () => {

    const expected = {
      last_name: 'Bar'
    };
    const key = gcDatastoreInstance.key(['first_name', 'Foo']);
    expected[KEY_SYMBOL] = key;

    const outcome = itemToEntity({item, model, tableName, gcDatastoreInstance});

    assert(outcome[KEY_SYMBOL]);
    assert.equal(outcome[KEY_SYMBOL].path[0], tableName);
    assert.equal(outcome[KEY_SYMBOL].path[1], item.first_name);
    assert.equal(outcome.last_name, expected.last_name);

  });

  it('should ignore null primary keys', () => {

    item.first_name = null;

    const expected = {};
    const key = gcDatastoreInstance.key(['first_name', 'Foo']);
    expected[KEY_SYMBOL] = key;

    const outcome = itemToEntity({item, model, tableName, gcDatastoreInstance});

    assert(outcome[KEY_SYMBOL]);
    assert.equal(outcome[KEY_SYMBOL].path[0], tableName);
    assert.equal(outcome[KEY_SYMBOL].path[1], undefined);

  });

  it('should not set undefined values', () => {

    item.last_name = undefined;

    const outcome = itemToEntity({item, model, tableName, gcDatastoreInstance});

    assert.deepEqual(Object.keys(outcome), []);

  });

  it('should set null to \'__NULL__\'', () => {

    item.last_name = null;

    const expected = {
      last_name: '__NULL__'
    };
    const key = gcDatastoreInstance.key(['first_name', 'Foo']);
    expected[KEY_SYMBOL] = key;

    const outcome = itemToEntity({item, model, tableName, gcDatastoreInstance});

    assert.equal(outcome.last_name, expected.last_name);

  });

  it ('should escape "__NULL__" when it is a real property', () => {

    item.last_name = '__NULL__';

    const expected = {
      last_name: '"__NULL__"'
    };
    const key = gcDatastoreInstance.key(['first_name', 'Foo']);
    expected[KEY_SYMBOL] = key;

    const outcome = itemToEntity({item, model, tableName, gcDatastoreInstance});

    assert.equal(outcome.last_name, expected.last_name);

  });

});
