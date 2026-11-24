import { describe, expect, it } from "vitest";
import { can } from "@/lib/rbac";
import { formatBytes, initials, percent, safeNext, sizeLabel } from "@/lib/format";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("rbac", () => {
  it("grants least privilege", () => {
    expect(can("STUDENT", "learn")).toBe(true);
    expect(can("STUDENT", "edit_content")).toBe(false);
    expect(can("MENTOR", "review_submissions")).toBe(true);
    expect(can("EDITOR", "publish_content")).toBe(false);
    expect(can("ADMIN", "manage_users")).toBe(true);
    expect(can(null, "learn")).toBe(false);
  });
});

describe("format", () => {
  it("formats sizes", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1536)).toBe("2 KB");
    expect(formatBytes(3 * 1024 * 1024)).toBe("3.0 MB");
    expect(formatBytes(null)).toBe("Size unknown");
    expect(sizeLabel(900_000)).toBe("Small file");
    expect(sizeLabel(5 * 1024 * 1024)).toBe("Medium file");
  });
  it("initials and percent", () => {
    expect(initials("Expert Name")).toBe("EN");
    expect(percent(3, 9)).toBe(33);
    expect(percent(0, 0)).toBe(0);
  });
  it("only allows relative redirects", () => {
    expect(safeNext("/courses")).toBe("/courses");
    expect(safeNext("//evil.com")).toBe("/dashboard");
    expect(safeNext("https://evil.com")).toBe("/dashboard");
  });
});

describe("password", () => {
  it("hashes and verifies", async () => {
    const h = await hashPassword("correct horse");
    expect(await verifyPassword("correct horse", h)).toBe(true);
    expect(await verifyPassword("wrong", h)).toBe(false);
  });
});
