const AWS = require('aws-sdk')

const lambda = new AWS.Lambda({
	// * required
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	apiVersion: process.env.AWS_API_VERSION,
	region: process.env.AWS_REGION,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

	// * optional
	endpoint: process.env.AWS_ENDPOINT,
})

const invokeLambda = ({ cloudevent, functionId, functionType }) => {
	const params = {
		FunctionName: functionId,
		InvocationType: 'RequestResponse', // ! Using a different invocation may duplicate events
		Payload: JSON.stringify(cloudevent),
	}
	let status = null
	lambda.invoke(params).promise()
		.then(res => status = res.StatusCode)
		.catch(err => status = err.statusCode)
		.finally(() => {
			const log = {
				functionId,
				functionType,
				cloudevent: { ...cloudevent, data: '__hidden__' },
				datetime: new Date().toISOString(),
				status: `${status}`,
			}
			console.log(JSON.stringify(log))
		})
}

module.exports = { invokeLambda }
