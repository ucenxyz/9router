import { describe, expect, it } from "vitest";
import { cleanJSONSchemaForAntigravity } from "../../open-sse/translator/formats/gemini.js";

describe("cleanJSONSchemaForAntigravity", () => {
  it("normalizes shorthand and invalid properties values", () => {
    const schema = {
      properties: {
        name: "string",
        retries: 3,
        enabled: { type: "boolean" },
      },
    };

    const out = cleanJSONSchemaForAntigravity(JSON.parse(JSON.stringify(schema)));

    expect(out.type).toBe("object");
    expect(out.properties.name).toEqual({ type: "string" });
    expect(out.properties.retries).toEqual({ type: "string" });
    expect(out.properties.enabled).toEqual({ type: "boolean" });
  });

  it("normalizes properties arrays into key-schema maps", () => {
    const schema = {
      type: "object",
      properties: [
        "query",
        { name: "limit", type: "integer" },
      ],
    };

    const out = cleanJSONSchemaForAntigravity(JSON.parse(JSON.stringify(schema)));

    expect(out.properties.query).toEqual({ type: "string" });
    expect(out.properties.limit).toMatchObject({ type: "integer" });
  });

  it("normalizes nested properties before object/array inference", () => {
    const schema = {
      type: "array",
      items: {
        properties: {
          deep: "boolean",
        },
      },
    };

    const out = cleanJSONSchemaForAntigravity(JSON.parse(JSON.stringify(schema)));

    expect(out.items.type).toBe("object");
    expect(out.items.properties.deep).toEqual({ type: "boolean" });
  });
});
