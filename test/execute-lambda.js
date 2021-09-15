const lambdaLocal = require('lambda-local');
const path = require("path");
const dotenv = require('dotenv')
dotenv.config();

const regex = /test/;

const jsonPayload = {
    "detail-type": "AWS API Call via CloudTrail",
    resources: [],
    detail: {
        eventName: "ReplicateImage",
        eventSource: "ecr.amazonaws.com",
        responseElements: null,
        resources: [
            {
                accountId: "111122223333",
                ARN: "arn:aws:ecr:ap-northeast-1:111122223333:repository/repo-name"
            }
        ]
    }
}

const main = async () => {
    try {
        const response = await lambdaLocal.execute({
            event: jsonPayload,
            lambdaPath: path.join(__dirname.replace(regex, ""), 'index.js'),
            timeoutMs: 3000
        })
        console.log("response", response);
    } catch (error) {
        console.log("error", error);
    }
}

main();