import {join as joinPath} from 'path'
import {readFileSync, existsSync, realpathSync} from 'fs'
import {homedir} from 'os'

export default function command({
	install,
	update,
	cacheDirectory = joinPath(homedir(), '.dependencaches'),
}) {

	const deps = readDeps()
	if (deps === null) {
		console.warn('no package.json')
		return
	}

	console.info('package.json found')
	const s = JSON.stringify(toEntries(deps))
	// console.log('deps:', s)
	const hash = sha1(s)
	console.info('hash of deps:', hash)
	const target = joinPath(cacheDirectory, 'npm', hash)
	const targetPath = joinPath(target, 'node_modules')
	const storePath = currentStorePath()
	if (storePath === null) {
		console.warn('not linked')
	}	else if (storePath === targetPath) {
		console.info('deps unchanged')
		if (install) return
	} else {
		console.info('deps changed')
	}

	sys('rm -rf node_modules')

	if (!existsSync(targetPath)) {
		console.info('installing...')
		sys(
			'npm install',
			'chmod -R g+w node_modules',
			`mkdir -p "${target}"`,
			`mv node_modules "${target}"`,
			`ln -s "${targetPath}" node_modules`,
		)
	} else if (update) {
		console.info('updating...')
		sys(
			`cp -R "${targetPath}" .`,
			'npm update',
			'chmod -R g+w node_modules',
			`rm -rf "${targetPath}"`,
			`mv node_modules "${target}"`,
			`ln -s "${targetPath}" node_modules`,
		)
	} else {
		sys(`ln -s "${targetPath}" node_modules`)
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
	if (!existsSync('package.json')) return null
	const metadata = JSON.parse(readFileSync('package.json', 'utf-8'))
	return {
		dependencies: metadata.dependencies,
		devDependencies: metadata.devDependencies,
		optionalDependencies: metadata.optionalDependencies,
		// do not need consider peerDependencies and bundledDependencies
	}
}

function toEntries(record) {
	if (record == null || typeof record !== 'object') return record
	return Object.keys(record)
		.filter(key => record[key] != null)
		.sort()
		.map(key => [key, toEntries(record[key])])
}

import {createHash} from 'crypto'
function sha1(data) {
	return createHash('sha1').update(data).digest('hex')
}

import {execSync} from 'child_process'
function sys(...cmd) {
	execSync(cmd.join(' && '), {stdio: 'inherit'})
}
