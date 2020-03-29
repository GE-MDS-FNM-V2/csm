# GE-FNM Communication Selector Module (@ge-fnm/csm)

## I would like to use the library in my app
To get started with the repository in your project install it like this
```
yarn add @ge-fnm/csm
```

TODO: The rest of this documentation

### Documentation
Documentation can be found here - https://ge-mds-fnm-v2.github.io/csm/

## Debugging
We've added in optional logging to this module. You can enable it by setting the environment variable DEBUG:
```sh
DEBUG=ge-fnm:csm* yarn #to enable logging for only the csm module
-or-
DEBUG=ge-fnm:csm:pam-singleton yarn #to enable just logging for the singleton housing the PAM Executor
-or-
DEBUG=ge-fnm:csm:remote-csm yarn #to enable just logging for the remote CSM->CSM integration point
-or-
DEBUG=ge-fnm:* yarn # for all logging related to ge-fnm
-or-
DEBUG=* yarn # enable logging for all installed node_modules that look for the env var DEBUG - please note, this is a lot. You probably dont want this

```
## I want to work on this project
Please see [CONTRIBUTING.md](CONTRIBUTING.md)


### Excluding peerDependencies

On library development, one might want to set some peer dependencies, and thus remove those from the final bundle. You can see in [Rollup docs](https://rollupjs.org/#peer-dependencies) how to do that.

Good news: the setup is here for you, you must only include the dependency name in `external` property within `rollup.config.js`. For example, if you want to exclude `lodash`, just write there `external: ['lodash']`.
