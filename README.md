<<<<<<< HEAD
=======
# GE-FNM Communication Selector Module (@ge-fnm/data-model)

## I would like to use the library in my app
To get started with the repository in your project install it like this
```
yarn add @ge-fnm/communication-selector-module
```

TODO: The rest of this documentation

### Documentation
Documentation can be found here - https://ge-mds-fnm-v2.github.io/communication-selector-module/

## I want to work on this project
Please see [CONTRIBUTING.md](CONTRIBUTING.md)


### Excluding peerDependencies

On library development, one might want to set some peer dependencies, and thus remove those from the final bundle. You can see in [Rollup docs](https://rollupjs.org/#peer-dependencies) how to do that.

Good news: the setup is here for you, you must only include the dependency name in `external` property within `rollup.config.js`. For example, if you want to exclude `lodash`, just write there `external: ['lodash']`.
>>>>>>> improvement: WIP on v1 of the CSM
