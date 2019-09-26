# Wasmer-JS [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![Travis](https://img.shields.io/travis/wasmerio/wasmer-js.svg)](https://travis-ci.org/wasmerio/wasmer-js) [![Coveralls](https://img.shields.io/coveralls/wasmerio/wasmer-js.svg)](https://coveralls.io/github/wasmerio/wasmer-js) [![Dev Dependencies](https://david-dm.org/wasmerio/wasmer-js/dev-status.svg)](https://david-dm.org/wasmerio/wasmer-js?type=dev)

<!-- [![Greenkeeper badge](https://badges.greenkeeper.io/wasmerio/wasmer-js.svg)](https://greenkeeper.io/) -->

Monorepo of multiple JavaScript packages enabling easy use of [WebAssembly](https://webassembly.org) Modules in Node and the Browser.

- [`@wasmer/wasi`](./packages/wasi) - WASI Implementation for Node and Browsers.

- [`@wasmer/wasmfs`](./packages/wasmfs) - WASI/Wasm FileSystem to be used in browsers, or for sandboxing in Node.

- [`@wasmer/wasm_transformer`](./packages/wasm_transformer) - the Javascript interface for the [`wasm_transformer` crate](./crates/wasm_transformer)

- [`@wasmer/wasm-terminal`](./packages/wasm-terminal) - A terminal/shell for interacting with WASI/Wasm Modules that runs in the browser.

**Wasm Terminal Example**

![Wasm Terminal Demo Gif](./packages/wasm-terminal/assets/wasm-terminal-demo.gif)

## Contributing

For additional contribution guidelines, please see our [CONTRIBUTING.md](./CONTRIBUTING.md) and our [Code of Conduct](./code-of-conduct.md).

### Quick Start

To get started contributing to wasmer-js, create your own fork of the [wasmer-js repository](https://github.com/wasmerio/wasmer-js) by clicking "Fork" in the Web UI.

#### Javascript Packages

1. Install the latest LTS version of [Node.js](https://nodejs.org/) (which includes npm). An easy way to do so is with `nvm`. (Mac and Linux: [here](https://github.com/creationix/nvm), Windows: [here](https://github.com/coreybutler/nvm-windows))

2. Download / Clone your fork to a local repository. Navigate into the project directory.

3. Install the dependencies with `npm install`. **NOTE:** This will run `lerna bootstrap`, and build the neccessary JS Packages.

4. Run `npm run dev`, which will serve the `examples/wasm-shell` example, which can be accessed with: http://localhost:8000/examples/wasm-shell/index.html

To make changes to any of the sub projects, they can be tested by either: Running their local tests with `npm run test` in their respective package directory, or by running their watch for changes developement command with `npm run dev`.

#### Rust Crates

1. Install the latest Nightly version of [Rust](https://www.rust-lang.org/tools/install) (which includes cargo).

2. Install the latest version of [wasm-pack](https://github.com/rustwasm/wasm-pack).

3. Download / Clone your fork to a local repository. Navigate into the `wasmer-js/crates/you_package_here` directory.

4. Run the respecitve build / tests commands. For example, for `wasm_transformer` you would run `./wasm_transformer_build.sh` to execute the bash script, which handles:

- Running Clippy

- Running tests

- Building the project, moving output into the correct directories.

### Using Lerna

Please see the website for [lerna](https://lerna.js.org/) for a quick introduction into what it is. Here are some general notes about using lerna in this project:

- Packages can be added by simply creating a new directory within the `packages/` directory, and running `npm init` in this new package directory. Then, the new package must be botstraped using learna. For this project, this can be done running `npm run lerna:bootstrap` in the base project directory.

- To add new dependencies and keep build times low, `devDependencies` ([not CLI dependencies](https://github.com/lerna/lerna/issues/1079#issuecomment-337660289)) must be added to the root [package.json](./package.json) file. Project installation / runtime dependencies are managed for each package individually.

- Sibling JS packages can depend on one another. You can do this by using [@lerna/add](https://github.com/lerna/lerna/pull/1069). For example, `lerna add @wasmer/package-1 --scope=@wasmer/package-2` will add @wasmer/package-1@^1.0.0 to @wasmer/package-2
