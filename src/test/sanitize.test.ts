import { describe, it, expect } from "vitest";
import {
  sanitizeProjectName,
  sanitizeFileName,
  buildZipFileName,
  validateSnippetLength,
  validateGeminiKey,
} from "../lib/utils/sanitize";

describe("Sanitize Utility Functions", () => {
  describe("sanitizeProjectName", () => {
    it("should replace invalid characters with dashes", () => {
      expect(sanitizeProjectName("My Awesome Project!")).toBe("My-Awesome-Project");
    });

    it("should collapse multiple dashes", () => {
      expect(sanitizeProjectName("My---Awesome---Project")).toBe("My-Awesome-Project");
    });

    it("should truncate to 50 characters", () => {
      const longName = "A".repeat(60);
      expect(sanitizeProjectName(longName).length).toBe(50);
    });
  });

  describe("sanitizeFileName", () => {
    it("should lowercase the sanitized project name", () => {
      expect(sanitizeFileName("My Awesome Project")).toBe("my-awesome-project");
    });
  });

  describe("buildZipFileName", () => {
    it("should include anchor, the sanitized name, and the current date", () => {
      const fileName = buildZipFileName("Test Project");
      const date = new Date().toISOString().slice(0, 10);
      expect(fileName).toBe(`anchor-test-project-${date}.zip`);
    });

    it("should default to 'project' if the name is empty after sanitization", () => {
      const fileName = buildZipFileName("!!!@#$");
      const date = new Date().toISOString().slice(0, 10);
      // "!!!@#$" becomes "------" which gets trimmed to empty string
      expect(fileName).toBe(`anchor-project-${date}.zip`);
    });
  });

  describe("validateSnippetLength", () => {
    it("should return true for snippets with 25 or fewer words", () => {
      const shortSnippet = "This is a short snippet.";
      expect(validateSnippetLength(shortSnippet)).toBe(true);
    });

    it("should return false for snippets with more than 25 words", () => {
      const longSnippet = Array(26).fill("word").join(" ");
      expect(validateSnippetLength(longSnippet)).toBe(false);
    });
  });

  describe("validateGeminiKey", () => {
    it("should return true for a valid Gemini key", () => {
      const validKey = "AIzaSyB_thisIsAFakeGeminiKey1234567890z";
      expect(validateGeminiKey(validKey)).toBe(true);
    });

    it("should return false for an invalid Gemini key", () => {
      expect(validateGeminiKey("invalid-key")).toBe(false);
      expect(validateGeminiKey("AIzaShortKey")).toBe(false); // too short
    });
  });
});
