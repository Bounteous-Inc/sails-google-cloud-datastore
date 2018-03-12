const assert = require('assert');
const parseWhereClause = require('../../lib/helpers/parseWhereClause.js');

describe('parseWhereClause', () => {

  it('should parse a normal clause', () => {

    const outcome = parseWhereClause({
      name: 'foo'
    });
    const expected = [[['name', 'foo']]];

    assert.deepEqual(outcome, expected);

  });

  it('should parse an AND clause', () => {

    const outcome = parseWhereClause({
      and: [{
        name: 'foo'
      },{
        last_name: 'bar'
      }]
    });
    const expected = [[['name', 'foo'], ['last_name', 'bar']]];

    assert.deepEqual(outcome, expected);

  });

  it('should parse an OR clause', () => {

    const outcome = parseWhereClause({
      or: [{
        name: 'foo'
      },{
        last_name: 'bar'
      }]
    });
    const expected = [[['name', 'foo']],[['last_name', 'bar']]];

    assert.deepEqual(outcome, expected);

  });

  it('should parse a complex clause with a nested OR', () => {

    const outcome = parseWhereClause({
      and: [{
        name: 'foo'
      },{
        last_name: 'bar'
      },{
        or: [{
          age: {
            '>=': 30
          }
        },{
          age: {
            '<=': 20
          }
        }]
      }]
    });
    const expected = [
      [['name', 'foo'], ['last_name', 'bar'], ['age', '>=', 30]],
      [['name', 'foo'], ['last_name', 'bar'], ['age', '<=', 20]]
    ];

    assert.deepEqual(outcome, expected);

  });

  it('should parse a complex clause with a nested AND', () => {

    const outcome = parseWhereClause({
      or: [{
        name: 'foo'
      }, {
        and: [{
          age: {
            '>=': 30
          }
        },{
          age: {
            '<=': 20
          }
        }]
      }]
    });
    const expected = [
      [['name', 'foo']],
      [['age', '>=', 30], ['age', '<=', 20]]
    ];

    assert.deepEqual(outcome, expected);

  });

  it('should parse a complex clause with a nested AND', () => {

    const outcome = parseWhereClause({
      // [['name', 'foo']]
      or: [{
        color: 'red'
      },{
        and: [{
          name: 'foo'
        }, {
          // [[['last_name', 'bar']], [[age], [age]]]
          or: [
            {
              last_name: 'bar',
            },{
              and: [
                {
                  age: {
                    '>=': 30
                  }
                },{
                  age: {
                    '<=': 20
                  }
                }
              ]
            }
          ]
        }]
      }]
    });
    // color is red OR name is foo and (last_name is bar OR age >= 30 OR age <= 20)
    const expected = [
      [['color', 'red']],
      [['name', 'foo'], ['last_name', 'bar']],
      [['name', 'foo'], ['age', '>=', 30], ['age', '<=', 20]]
    ];

    assert.deepEqual(outcome, expected);

  });

  it('should parse a clause with IN', () => {

    const outcome = parseWhereClause({
      id: {
        in: [1, 2, 3, 4]
      }
    });
    const expected = [
      [['id', 1]],
      [['id', 2]],
      [['id', 3]],
      [['id', 4]],
    ];

    assert.deepEqual(outcome, expected);

  });

});
