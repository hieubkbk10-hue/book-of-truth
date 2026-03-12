import { docs } from "@/source.config";
import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

const search = createFromSource(source, {
  language: "english",
});

export const GET = search.GET;
