exports.load = function (m) {
	if (/[/\\]node_modules[/\\]dependencaches$/.test(__dirname)) {
		require('babel-polyfill')
		return require('./lib/' + m)
	} else { // dev env
		console.info('dependencaches development version\n')
		require('source-map-support').install()
		require('babel-register')
		return require('./src/' + m)
	}
}
