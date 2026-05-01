import { describe, it, expect } from "vitest";
import { stableSortObject, stableJsonStringify } from "../lib/utils/deterministic";

describe("Deterministic Sorting (MVP-1)", () => {
  it("should sort object keys alphabetically", () => {
    const input = { z: 1, a: 2, m: 3 };
    const sorted = stableSortObject(input);
    const keys = Object.keys(sorted as object);
    expect(keys).toEqual(["a", "m", "z"]);
  });

  it("should handle nested objects deterministically", () => {
    const input = {
      b: { y: 1, x: 2 },
      a: 10
    };
    const sorted = stableSortObject(input);
    const json = JSON.stringify(sorted);
    expect(json).toBe('{"a":10,"b":{"x":2,"y":1}}');
  });

  it("should handle arrays of objects", () => {
    const input = {
      list: [
        { id: 2, val: "b" },
        { id: 1, val: "a" }
      ]
    };
    const sorted = stableSortObject(input) as { list: Array<{ id: number, val: string }> };
    // Note: stableSortObject sorts keys, but usually keeps array order unless specified.
    // Our implementation should at least ensure keys within objects in arrays are sorted.
    expect(JSON.stringify(sorted.list[0])).toBe('{"id":2,"val":"b"}');
  });

  it("stableJsonStringify should produce identical output for same data", () => {
    const obj1 = { a: 1, b: { c: 3, d: 4 } };
    const obj2 = { b: { d: 4, c: 3 }, a: 1 };
    
    expect(stableJsonStringify(obj1)).toBe(stableJsonStringify(obj2));
  });
});
