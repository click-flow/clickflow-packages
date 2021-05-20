const fs = require('fs')
const { invokeLambda } = require('./utils/invoke-lambda')
const { v5: { createCloudeventStream } } = require('@1mill/cloudevents')

let fileMaps
if (process.env.FUNCTION_MAPS_FILE) {
	try {
		fileMaps = fs.readFileSync(process.env.FUNCTION_MAPS_FILE, 'utf8')
	} catch (err) {
		console.error(err)
	}
}

// * For each single cloudevent we only want to invoke a function once.
// * So we remove any duplicate function maps.
const functionMaps = [
	...new Set([
		...JSON.parse(
			fileMaps || JSON.stringify([])
		).map(m => JSON.stringify(m)),
		...JSON.parse(
			process.env.FUNCTION_MAPS || JSON.stringify([])
		).map(m => JSON.stringify(m)),
	])
].map(m => JSON.parse(m))

// * For reach cloudevent type we only want to create one subscription
// * per type. So this returns a list of unique cloudevent types we
// * can subscribe to.
const types = [...new Set(functionMaps.map(m => m.type))]

const google = functionMaps.filter(m => m.functionType === 'google')
const imb = functionMaps.filter(m => m.functionType === 'imb')
const lambdas = functionMaps.filter(m => m.functionType === 'lambda')

createCloudeventStream({}).listen({
	handler: ({ cloudevent }) => {
		lambdas
			.filter(m => m.type === cloudevent.type)
			.forEach(m => invokeLambda({
				cloudevent,
				functionId: m.functionId,
				functionType: m.functionType,
			}))
	},
	types,
})
