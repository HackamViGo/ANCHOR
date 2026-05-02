import { describe, it, expect } from "vitest";
import { cn } from "../lib/utils/cn";

describe("cn utility", () => {
  it("should merge basic class names", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
  });

  it("should handle conditional classes", () => {
    const isTrue = true;
    const isFalse = false;
    expect(cn("bg-red-500", isTrue && "text-white", isFalse && "text-black")).toBe("bg-red-500 text-white");
  });

  it("should resolve tailwind conflicts using tailwind-merge", () => {
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    expect(cn("p-4", "p-8")).toBe("p-8");
  });

  it("should handle arrays and objects", () => {
    expect(cn(["bg-red-500", "text-white"], { "opacity-50": true, "hidden": false })).toBe("bg-red-500 text-white opacity-50");
  });
});
