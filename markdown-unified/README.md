# markdown-unified

This is a Markdown parser implemented with Unified JS. The same parser runs on both the main thread and in a Web Worker

## Usage

```shell
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
yarn preview
```

## Testing different Markdown files

There are two Markdown files:

1. `lorem.md` -- A large text
2. `lorem-sm.md` -- A small text

Append the `file` query parameter to the URL to pick one or the other.

Ex: `http://localhost:8080/?file=lorem-sm.md`