import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import { middyfy } from "@libs/lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { auctionsService } from "../../services";
import {
  createAuctionSchema,
  getAuctionsSchema,
  placeBidSchema,
} from "./schema";

export const getAuctions = middyfy(
  async (event): Promise<APIGatewayProxyResult> => {
    const auctions = await auctionsService.getAuctions(
      event.queryStringParameters
    );
    return formatJSONResponse({
      response: { message: "success", data: auctions },
    });
  }
).use(validator({ eventSchema: transpileSchema(getAuctionsSchema) }));

export const createAuction = middyfy(
  async (event): Promise<APIGatewayProxyResult> => {
    const id = uuidv4();
    const now = new Date();
    const endDate = new Date();
    endDate.setHours(now.getHours() + 1);

    try {
      const auction = await auctionsService.createAuction({
        id,
        title: event.body.title,
        status: "OPEN",
        createdAt: now.toISOString(),
        endtingAt: endDate.toISOString(),
        highestBid: {
          amount: 0,
        },
      });
      return formatJSONResponse({
        statusCode: 201,
        response: { message: "success", data: auction },
      });
    } catch (error) {
      return formatJSONResponse({
        statusCode: 500,
        response: { error },
      });
    }
  }
).use(validator({ eventSchema: transpileSchema(createAuctionSchema) }));

export const getAuction = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
    try {
      const auction = await auctionsService.getAuction(id);
      return formatJSONResponse({
        response: { message: "success", data: auction },
      });
    } catch (error) {
      return formatJSONResponse({
        statusCode: 500,
        response: { error },
      });
    }
  }
);

export const placeBid = middyfy(
  async (event): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
    const amount = event.body.amount;
    try {
      const auction = await auctionsService.placeBid({ id, amount });
      return formatJSONResponse({
        response: { message: "success", data: auction },
      });
    } catch (error) {
      return formatJSONResponse({
        statusCode: 500,
        response: { error },
      });
    }
  }
).use(validator({ eventSchema: transpileSchema(placeBidSchema) }));

export const deleteAuction = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
    try {
      const auction = await auctionsService.deleteAuction(id);
      return formatJSONResponse({
        response: { message: "success", data: auction },
      });
    } catch (error) {
      return formatJSONResponse({
        statusCode: 500,
        response: { error },
      });
    }
  }
);
