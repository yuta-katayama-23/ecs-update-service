const { ECSClient, UpdateServiceCommand } = require("@aws-sdk/client-ecs");
const client = new ECSClient({ region: process.env.REGION });

exports.handler = async (event) => {
    if (event.detail.result === "SUCCESS") {
        const input = {
            service: event.detail["repository-name"],
            forceNewDeployment: true
        }
        const command = new UpdateServiceCommand(input);
        const response = await client.send(command);

        console.log("status", response.$metadata.httpStatusCode);
        console.log("serviceArn", response.service.serviceArn);

        return { result: "", response }
    }

    return { result: "Not update service because ECR Image Push is Failed." }
}