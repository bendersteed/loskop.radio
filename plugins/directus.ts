import { createDirectus, graphql } from "@directus/sdk";
import type { Schema } from "~/schema";

const directus = createDirectus<Schema>("https://locms.stinpriza.eu").with(
  graphql(),
);

export default defineNuxtPlugin(() => {
  return {
    provide: { directus },
  };
});
