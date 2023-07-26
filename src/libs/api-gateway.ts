import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type JSONResponseParams = {
  statusCode?: number;
  response: Record<string, unknown>;
};

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export const formatJSONResponse = ({
  statusCode = 200,
  response,
}: JSONResponseParams) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(response),
  };
};
