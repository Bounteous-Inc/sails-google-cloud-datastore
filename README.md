# sails-google-cloud-datastore

A Sails Waterline adapter for Google Cloud Datastore.

## Notes

Datastore doesn't have a concept of `null`, so null values will be transformed to '__NULL__' on the fly, and on the off-hand chance you're setting something to '__NULL__', that will be transformed to '"__NULL__"'.

Currently failing ~26 tests or so, mostly because the adapter doesn't support:
- `avg()`, `count()`, `sum()`, or `setSequence()`.
- `!=`, `nin`, or `like` in queries

The [Google-provided NodeJS library](https://github.com/googleapis/nodejs-datastore) used under the hood doesn't support `OR`, so queries requiring OR are split into multiple queries instead, e.g.:

```sql
SELECT * WHERE first_name='DAN' OR last_name='WILKERSON'
```

becomes

```sql
SELECT * WHERE first_name='DAN'
UNION
SELECT * WHERE last_name='WILKERSON'
```

Licensed under the MIT license.
