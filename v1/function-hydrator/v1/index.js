const fs = require('fs')
const { invokeLambda } = require('./utils/invoke-lambda')
const { v5: { createCloudeventStream } } = require('@1mill/cloudevents');

const fileMaps = []
const functionsDir = process.env.FUNCTIONS_DIR
if (functionsDir) {
	try {
		fs
		.readdirSync(functionsDir)
		.filter(file => file.endsWith('.json'))
		.map(file => `${functionsDir}/${file}`)
		.map(path => fs.readFileSync(path, 'utf8'))
		.map(json => JSON.parse(json || '[]'))
		.forEach(array => {
			array.forEach(item => fileMaps.push(item))
		})
	} catch(err) {
		throw new Error(err)
	}
}

// * For each single cloudevent we only want to invoke a function once.
// * So we remove any duplicate function maps.
const functionMaps = [
	...new Set([
		...JSON.parse(process.env.FUNCTIONS || JSON.stringify([])),
		...fileMaps,
	].map(m => {
		const override = JSON.parse(process.env.FUNCTIONS_OVERRIDE || JSON.stringify({}))
		return JSON.stringify({
			...m,
			functionId: override.functionId || m.functionId,
			functionType: override.functionType || m.functionType,
			type: override.type || m.type,
		})
	}))
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
