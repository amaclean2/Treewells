# SundayPeak Treewells

This library is supposed to abstract out all of the hooks and serverside calls from the SundayPeak UI

To set it up first set the following object in app.js of `mountains`:

```Javascript
Connections.setConnections({ restUrl, websocketUrl}, storageApi)
```

Providers should be able to be accesses through `<SundayPeakProviders />` which takes `{children}` as a parameter
All the hooks should be exposed through whatever hook you need.

## Running Development SundayPeak/mountains with `npm link`

Inside the Treewells app

```shell
npm link --only=production ../BackyardFriends/mountains/node_modules/react
npm link --only=production ../BackyardFriends/mountains/node_modules/react-dom

npm i -s ../BackyardFriends/mountains/node_modules/react
npm i -s ../BackyardFriends/mountains/node_modules/react-dom
```

Inside `BackyardFriends/mountains`

```shell
npm link --only=production ../../Treewells
npm i -s ../../Treewells
```

## Releasing to npm

- Verify that the version in `package.json` is higher than in the npm directory of the [Github Repository](https://github.com/amaclean2/Treewells/pkgs/npm/sundaypeak-treewells).
- Push code to github and merge to main
- [Create](https://github.com/amaclean2/Treewells/releases/new) a new release
  - Tag it with the current version in `package.json`
  - Add the release nots
  - Starting the release will trigger Github Actions to publish to npm
- Pull the new version into `BackyardFriends/mountains`
