# sails-google-cloud-datastore

A Sails Waterline adapter for Google Cloud Datastore.

## Usage

Install the adapter from npm:

    npm install sails-google-cloud-datastore

Then, configure the adapter in [https://github.com/balderdashy/sails](SailsJS) by modifying your datastore config:

```javascript
...
models: {
  datastore: 'production'
},
datastores: {
  production: {
    adapter: 'sails-google-cloud-datastore',
    projectId: 'foo',
    keyFilename: '/path/to/keyfile.json'
  }
},
...
```

> Note: the `keyFilename` configuration is only required if you're [not using Application Default Credentials](https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application). For more information on setting up explicit service credentials, [see here](https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually).

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

## Development

To test, install the [Google Cloud Datastore Emulator](https://cloud.google.com/datastore/docs/tools/datastore-emulator), then run `npm run test`.

Occasionally the tests will stall, missing when the emulator boots up. I'm guessing my test command is the culprit; improvements welcome!

Licensed under the MIT license.
