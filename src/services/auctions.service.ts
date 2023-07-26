import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { BidAuctionDto } from "src/common/dto/bid-auction.dto";
import { FilterAuctionDto } from "src/common/dto/filter-auction.dto";
import { Auction } from "src/models/auction.entity";

export class AuctionsService {
  private Tablename: string = process.env.AUCTIONS_TABLE_NAME;

  constructor(private documentClient: DocumentClient) {}

  async getAuctions({ status }: FilterAuctionDto): Promise<Auction[]> {
    try {
      const auctions = await this.documentClient
        .query({
          TableName: this.Tablename,
          IndexName: "statusAndEndDate",
          KeyConditionExpression: "#status = :status",
          ExpressionAttributeValues: {
            ":status": status,
          },
          ExpressionAttributeNames: {
            "#status": "status",
          },
        })
        .promise();

      return auctions.Items as Auction[];
    } catch (error) {
      console.log(error);
      throw new Error("Error getting auctions");
    }
  }

  async createAuction(auction: Auction): Promise<Auction> {
    try {
      await this.documentClient
        .put({
          TableName: this.Tablename,
          Item: auction,
        })
        .promise();

      return auction as Auction;
    } catch (error) {
      console.error(error);
      throw new Error("Error creating auction");
    }
  }

  async getAuction(id: string): Promise<Auction> {
    try {
      const auction = await this.documentClient
        .get({
          TableName: this.Tablename,
          Key: { id },
        })
        .promise();

      if (!auction.Item) {
        throw new Error("Auction not found");
      }

      return auction.Item as Auction;
    } catch (error) {
      console.error(error);
      throw new Error("Error getting auction");
    }
  }

  async placeBid({ id, amount }: BidAuctionDto): Promise<Auction> {
    const auction = await this.getAuction(id);

    if (auction.status !== "OPEN") {
      throw new Error("Auction is not open");
    }

    if (amount <= auction.highestBid.amount) {
      throw new Error("Bid amount must be higher than current highest bid");
    }

    const updatedBid = await this.documentClient
      .update({
        TableName: this.Tablename,
        Key: { id },
        UpdateExpression: "set highestBid.amount = :amount",
        ExpressionAttributeValues: {
          ":amount": amount,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return updatedBid.Attributes as Auction;
  }

  async deleteAuction(id: string): Promise<Auction> {
    const auction = await this.documentClient
      .delete({
        TableName: this.Tablename,
        Key: { id },
      })
      .promise();

    return auction.Attributes as Auction;
  }
}
