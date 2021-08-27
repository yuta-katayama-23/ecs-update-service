const { ECSClient, UpdateServiceCommand } = require("@aws-sdk/client-ecs");
const client = new ECSClient({ region: process.env.REGION });

const regex = new RegExp(process.env.ECR_REPO_REGEX);

exports.handler = async (event) => {
    const repository = event.detail.resources[0].ARN.match(regex)
        ? event.detail.resources[0].ARN.match(regex)[1]
        : "not match regex";

    if (repository === "not match regex") {
        console.log("not match regex", event.detail.resources[0].ARN)
        return { result: "Not match regex." }
    }

    // ECSのservice名がECRのrepository名と一致する想定
    console.log("repository", repository)
    const input = {
        service: repository,
        forceNewDeployment: true
    }
    const command = new UpdateServiceCommand(input);
    const response = await client.send(command);

    console.log("status", response.$metadata.httpStatusCode);
    console.log("serviceArn", response.service.serviceArn);

    return { result: "", response }
}