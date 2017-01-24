import {join as joinPath} from 'path'
import {readFileSync, statSync, realpathSync} from 'fs'
import {homedir} from 'os'

export default function command({
	install, update,
	cacheDirectory = joinPath(homedir(), '.dependencaches'),
}) {
	const deps = readDeps()
	if (deps == null) return
	console.info('package.json found')
	const s = JSON.stringify(toArray(deps))
	// console.log('deps:', s)
	const hash = sha1(s)
	console.info('hash of deps:', hash)
	const target = joinPath(cacheDirectory, 'npm', hash)
	const targetPath = joinPath(target, 'node_modules')
	const storePath = currentStorePath()
	if (storePath === targetPath) {
		console.info('no change')
		return
	}

	console.info('deps changed')
	sys('rm -rf node_modules')

	if (mkdirp(targetPath)) {
		let cmd
		if (install) cmd = 'install'
		else if (update) cmd = 'update'
		console.info('installing...')
		try {
			sys(`npm ${cmd} && chmod -R g+w node_modules && mv node_modules "${target}" && ln -s "${targetPath}" node_modules`)
		} catch (e) {
			console.error(e)
			sys('rm -rf "' + targetPath + '"')
			process.exit(1)
		}
	} else if (update) {
		console.info('updating...')
		try {
			sys(`ln -s "${targetPath}" node_modules && npm update`)
		} catch (e) {
			console.error(e)
			sys('rm -rf "' + targetPath + '"')
			process.exit(1)
		}
	} else {
		sys(`ln -s "${targetPath}" node_modules`)
	}
}

function mkdirp(dir) {
	try {
		const stats = statSync(dir)
		return false
	} catch (e) {
		sys('mkdir -p "' + dir + '"')
		return true
	}
}

function currentStorePath() {
	try {
		return realpathSync('node_modules')
	} catch (e) {
		// console.warn(e)
		return null
	}
}

function readDeps(dir) {
	let metadata
	try {
		metadata = readFileSync('package.json', 'utf-8')
	} catch (e) {
		console.info('no package.json')
		return null
	}
	metadata = JSON.parse(metadata)
	return {
		dependencies: metadata.dependencies,
		devDependencies: metadata.devDependencies,
		optionalDependencies: metadata.optionalDependencies,
		// do not need consider peerDependencies and bundledDependencies
	}
}

function toArray(record) {
	if (record == null || typeof record !== 'object') return record
	return Object.keys(record).filter(key => record[key] != null).sort().map(key => [key, toArray(record[key])])
}

import {createHash} from 'crypto'
function sha1(data) {
	return createHash('sha1').update(data).digest('hex')
}

import {execSync} from 'child_process'
function sys(cmd) {
	execSync(cmd, {stdio: 'inherit'})
}
