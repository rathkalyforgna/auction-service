import { dynamoDBClient } from "../models";
import { AuctionsService } from "./auctions.service";

const auctionsService = new AuctionsService(dynamoDBClient());
// authService
// usersService

export { auctionsService };
