# GE-FNM Communication Selector Module (@ge-fnm/csm)

## I would like to use the library in my app
### Installation
To get started with the repository in your project install it like this
```sh
yarn add @ge-fnm/csm
```
Or
```sh
npm install @ge-fnm/csm
```
### Usage
This module uses the [@ge-fnm/action-object](https://github.com/GE-MDS-FNM-V2/action-object) 
as an input parameter, so be warned that you are going to need to adhere to the latest standards
for that object in order to use this module. For those specfications, visit that repository.

This is an example of how this module may be used in a frontend environment
```js
import { executeCommunication } from '@ge-fnm/csm';
import { v1, /* any other required classes, functions, or enums for creation. Check action-object repo. */ } from '@ge-fnm/action-object';

const actionObject = v1.create({ /* This will house the required schema and information to create an Action Obejct*/ });
const serializedActionObject = actionObject.serialize(); 
const forwardingAddress = 'http://localhost:3001/remoteExecute'  // This is the address of the reverse proxy which can complete communications over serial, ssh, or http, should the frontend be unable to complete the given communication.

executeCommunication(serializedActionObject, forwardingAddress)
    .then(serializedActionResponse => {
        /* Do something with your response object after radio communications */
    })
    .catch(error => {
        /* This should be rare, but do something with your non-action-obejct Error */
    })
```

### Documentation
Documentation for this project is not currently being generated and published. A good way to get
some documentation is through a the [TypeDocs](https://typedoc.org/) plugin we have included.

First clone this project:
```sh
git clone https://github.com/GE-MDS-FNM-V2/csm.git
```

Next go into the new directory and install all the dependencies
```sh
yarn
```

If there is already a `docs/` folder, run a quick
```
rm -rf docs/
```

Then run the following yarn script to generate a `docs/` folder with dynamic `.html` documenation generated
from the code comments
```sh
yarn docs
```

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
