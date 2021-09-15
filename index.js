const { ECSClient, UpdateServiceCommand } = require("@aws-sdk/client-ecs");
const client = new ECSClient({ region: process.env.REGION });

const serviceRegex = new RegExp(process.env.ECR_SERVICE_REGEX);
const clustreRegex = new RegExp(process.env.ECR_CLUSTER_REGEX);

exports.handler = async (event) => {
    try {
        const service = event.detail.resources[0].ARN.match(serviceRegex)
            ? event.detail.resources[0].ARN.match(serviceRegex)[1]
            : undefined;
        const cluster = event.detail.resources[0].ARN.match(clustreRegex)
            ? event.detail.resources[0].ARN.match(clustreRegex)[1]
            : undefined;

        if (!service && !cluster) {
            console.log("not match regex", event.detail.resources[0].ARN)
            return { result: "Not match regex." }
        }

        const input = {
            service, // service: service の ES6省略形
            cluster, // cluster: cluster の ES6省略形
            forceNewDeployment: true
        }
        console.log("input", input);

        const command = new UpdateServiceCommand(input);
        const response = await client.send(command);

        console.log("status", response.$metadata.httpStatusCode);
        console.log("serviceArn", response.service.serviceArn);

        return { result: "", response }
    } catch (error) {
        errorHandler(error);
    }
}

const errorHandler = (error) => {
    const obj = {};
    obj["status"] = 500;
    obj["message"] = error.message;
    obj["stack"] = error.stack;
    obj["result"] = "ng";
    if (error.$metadata) {
        obj["status"] = error.$metadata.httpStatusCode;
    }

    console.log("errorHandler", obj);
    return obj;
}