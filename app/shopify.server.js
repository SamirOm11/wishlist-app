import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { MongoDBSessionStorage } from "@shopify/shopify-app-session-storage-mongodb";
import dbconnection from "./db.server";
import dotenv from "dotenv";
dotenv.config();

dbconnection();
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks/app/uninstalled",
    },
  },
  sessionStorage:
    process.env.NODE_ENV === "production"
      ? new MongoDBSessionStorage(process.env.MONGODB_URI)
      : new MongoDBSessionStorage("mongodb://127.0.0.1:27017", "Wishlist-DB"),
  distribution: AppDistribution.AppStore,

  hooks: {
    beforeAuth: async ({ session }) => {
      console.log("Before auth - session:", session); 
    },
    afterAuth: async ({ session }) => {
      console.log("After auth - session:", session);
      try {
        const registration = await shopify.registerWebhooks({ session });
        console.log("Webhook registration result:", registration);
      } catch (error) {
        console.error("Webhook registration error:", error);
      }
    },
  },

  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
