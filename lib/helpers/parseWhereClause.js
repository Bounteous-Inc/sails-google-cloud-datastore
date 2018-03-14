const detectedInStatement = 'IN statement detected';

/**
 * @param {Stage3Query.where} where
 *
 * @returns {String[][][]}
 */
function parseWhereClause(where) {

  if (where.and) {

    // returns [[[key, val, *]],[[key, val, *]]] we want [[[key, val], [key, val]]]
    let queries = where.and.map(parseWhereClause).reduce((filters, filter) => {

      if (filter.length > 1) {

        return filter.map(filterPart => {

          return filters.concat(filterPart);

        });

      } else {

        return filters.concat(filter[0]);

      }
    }, []);

    return Array.isArray(queries[0][0]) ? queries : [queries];

  } else if(where.or) {

    return where.or.map(parseWhereClause).reduce((filters, filter) => {

      return filters.concat(filter);

    }, []);

  } else {

    try {

      return [[parseCondition(where)]];

    } catch (e) {

      if (e.message === detectedInStatement) {

        let k = Object.keys(where)[0];

        return parseWhereClause({
          or: where[k].in.map(v => { const obj = {}; obj[k] = v; return obj;})
        });

      }

      throw e;

    }

  }

}


/**
 * @param {Object} obj
 *
 * @returns {String[]}
 */
function parseCondition(obj) {

  const comparisonOperators = ['>', '>=', '<', '<='];
  const key = Object.keys(obj)[0];

  let value = obj[key];
  let operator;

  if (value === '__NULL__') { value = '"__NULL__"'; }
  if (value === null) { value = '__NULL__'; }

  if (typeof value !== 'object') { return [key, value]; }

  operator = Object.keys(value)[0];
  value = value[operator];

  if (comparisonOperators.indexOf(operator) > -1) { return [key, operator, value]; }

  switch (operator) {
    case 'in':
      throw new Error(detectedInStatement);
      break;
    default:
      throw new Error(`Unsupported operator '${operator}' found in condition.`);
  }

}

module.exports = parseWhereClause;
