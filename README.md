# dependencaches -- Dependencies Caches for npm

## Why this project

This project have the same goal of [npm-cache](https://github.com/swarajban/npm-cache).
npm-cache is a great tool, but it need keep the compatibility with the old
versions which become a burden for introducing new features, and the author
do not have enough time to maintain and merge new PRs, so I just write new
one from the ground.

## Install

```sh
npm install -g dependencaches
```

## Usage

```sh
dependencaches install  # try to install
dependencaches --cacheDirectory=/home/cache install  # install using /home/cache as cache directory
```

## Limitations

- Currently only support npm, no bower/jspm/composer...
- No compression (achieving)

## TODO

- Recheck symlink for native (node-gyp) packages
- Implement copy (rsync)
- Add more commands: hash, save, restore, etc.
