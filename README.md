# dependencaches -- Dependencies Caches for npm

[![Greenkeeper badge](https://badges.greenkeeper.io/hax/dependencaches.svg)](https://greenkeeper.io/)

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

- Not support Win32
- Currently only support npm, no bower/jspm/composer...
- Currently only implement symlink
- No compression

## TODO

- Recheck symlink for native (node-gyp) packages
- Implement copy (rsync)
- Add more commands: hash, save, restore, etc.
