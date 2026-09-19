import { Client, type ClientOptions } from "@elastic/elasticsearch";
import { config } from "./config";

/** Ported from config/elasticsearch.js — same env-driven auth options. */
const options: ClientOptions = { node: config.esNode, requestTimeout: 5000, maxRetries: 2 };
if (config.esApiKey) {
  options.auth = { apiKey: config.esApiKey };
} else if (config.esUsername && config.esPassword) {
  options.auth = { username: config.esUsername, password: config.esPassword };
}

export const esClient = new Client(options);
export const PRODUCT_INDEX = "products";
