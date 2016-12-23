exports.load = function (m) {
	// prod env
	if (/[/\\]node_modules[/\\]/.test(__dirname)) {
		require('babel-polyfill')
		return require('./lib/' + m)
	}
	
	// dev env
	console.info('dependencaches development version\n')
	require('source-map-support').install()
	require('babel-polyfill')
	require('babel-register')
	return require('./src/' + m)
}
