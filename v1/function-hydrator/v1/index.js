const { v5: { createCloudeventStream } } = require('@1mill/cloudevents')

// * For each single cloudevent we only want to invoke a function once.
// * So we remove any duplicate function maps.
const functionMaps = [
	...new Set(
		JSON.parse(
			process.env.FUNCTION_MAPS || JSON.stringify([])
		).map(m => JSON.stringify(m))
	)
].map(m => JSON.parse(m))

// * For reach cloudevent type we only want to create one subscription
// * per type. So this returns a list of unique cloudevent types we
// * can subscribe to.
const types = [...new Set(functionMaps.map(m => m.type))]

console.log(functionMaps)
console.log(types)
