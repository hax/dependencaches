import {docopt} from 'docopt'
import {readFileSync} from 'fs'
import pack from '../package'
import command from '.'

const options = normalizeOptions(docopt(`
Dependencies Cache

Usage:
  dependencaches [--cacheDirectory=<dir>] (install | update)
  dependencaches -h | --help
  dependencaches -v | --version

Options:
  -h --help                          Show this screen
  -v --version                       Show version
  -c <dir> --cacheDirectory=<dir>    Cache directory
`))

if (options.version) {
	console.log(pack.name, pack.version)
} else {
	// console.log(options)
	command(options)
}

function normalizeOptions(docopt) {
	const opt = {}
	for (const [key, value] of Object.entries(docopt)) {
		if (value == null) continue
		const k = key.startsWith('--') ? key.slice(2) : key
		opt[k] = value
	}
	return opt
}
