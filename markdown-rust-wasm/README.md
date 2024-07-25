# markdown-rust-wasm

This is a Markdown parser implemented in Rust and compiled for WASM so it can be run in a web browser.

## Usage

Install the [Rust toolchain](https://rustwasm.github.io/docs/book/game-of-life/setup.html)

```shell
# build the WASM binary
wasm-pack build
```

```shell
# open the web app folder
cd www

# install deps
yarn
```

```shell
# run the dev server
yarn dev
```

```shell
# build and serve production
yarn build
yarn serve
```

## Testing different Markdown files

There are two Markdown files:

1. `lorem.md` -- A large text
2. `lorem-sm.md` -- A small text

Append the `file` query parameter to the URL to pick one or the other.

Ex: `http://localhost:8080/?file=lorem-sm.md`

