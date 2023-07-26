import { handlerPath } from "@libs/handler-resolver";

export const getAuctions = {
  handler: `${handlerPath(__dirname)}/handler.getAuctions`,
  events: [
    {
      http: {
        method: "get",
        path: "/auctions",
      },
    },
  ],
};

export const createAuction = {
  handler: `${handlerPath(__dirname)}/handler.createAuction`,
  events: [
    {
      http: {
        method: "post",
        path: "/auctions",
      },
    },
  ],
};

export const getAuction = {
  handler: `${handlerPath(__dirname)}/handler.getAuction`,
  events: [
    {
      http: {
        method: "get",
        path: "/auctions/{id}",
      },
    },
  ],
};

export const placeBid = {
  handler: `${handlerPath(__dirname)}/handler.placeBid`,
  events: [
    {
      http: {
        method: "patch",
        path: "/auctions/{id}",
      },
    },
  ],
};

export const deleteAuction = {
  handler: `${handlerPath(__dirname)}/handler.deleteAuction`,
  events: [
    {
      http: {
        method: "delete",
        path: "/auctions/{id}",
      },
    },
  ],
};
