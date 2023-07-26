import type { AWS } from "@serverless/typescript";
import {
  getAuctions,
  createAuction,
  getAuction,
  placeBid,
  deleteAuction,
} from "@functions/auctions";
import hello from "@functions/hello";

const serverlessConfiguration: AWS = {
  service: "auction-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    stage: "dev",
    region: "ap-southeast-2",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      AUCTIONS_TABLE_NAME: "AuctionsTable",
    },
    iam: {
      role: {
        statements: [
          {
            // Allow functions to read/write objects in dynamoDB
            Effect: "Allow",
            Action: [
              "dynamodb:DescribeTable",
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Resource: [
              "arn:aws:dynamodb:ap-southeast-2:051750570000:table/AuctionsTable",
              "arn:aws:dynamodb:ap-southeast-2:051750570000:table/AuctionsTable/index/statusAndEndDate",
            ],
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: {
    hello,
    getAuctions,
    createAuction,
    getAuction,
    placeBid,
    deleteAuction,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      AuctionsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "AuctionsTable",
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
            {
              AttributeName: "status",
              AttributeType: "S",
            },
            {
              AttributeName: "endingAt",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: "statusAndEndDate",
              KeySchema: [
                {
                  AttributeName: "status",
                  KeyType: "HASH",
                },
                {
                  AttributeName: "endingAt",
                  KeyType: "RANGE",
                },
              ],
              Projection: {
                ProjectionType: "ALL",
              },
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
