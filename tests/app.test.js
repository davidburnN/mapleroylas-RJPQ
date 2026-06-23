import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const projectRoot = process.cwd();

function read(fileName) {
  return fs.readFileSync(path.join(projectRoot, fileName), "utf8");
}

function setupApp() {
  const html = read("index.html").replace(/<script[\s\S]*?<\/script>/g, "");
  const dom = new JSDOM(html, {
    url: "https://example.com/",
    runScripts: "outside-only",
  });
  const { window } = dom;

  window.alert = () => {};
  window.confirm = () => true;
  window.navigator.clipboard = { writeText: async () => {} };

  const appScript = read("app.js");
  const context = dom.getInternalVMContext();
  vm.runInContext(appScript, context);

  return window;
}

describe("RJ PQ tracker", () => {
  it("renders 4 room tabs", () => {
    const window = setupApp();
    const tabs = window.document.querySelectorAll(".room-tab");
    expect(tabs.length).toBe(4);
  });

  it("left click marks success and toggles off", () => {
    const window = setupApp();
    const successCount = window.document.getElementById("successCount");

    window.document
      .querySelector(".platform-cell")
      .dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(window.document.querySelector(".platform-cell").classList.contains("platform-cell--success")).toBe(true);
    expect(successCount.textContent).toContain("1");

    window.document
      .querySelector(".platform-cell")
      .dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(window.document.querySelector(".platform-cell").classList.contains("platform-cell--success")).toBe(false);
    expect(successCount.textContent).toContain("0");
  });

  it("right click marks fail", () => {
    const window = setupApp();
    const failCount = window.document.getElementById("failCount");

    window.document
      .querySelector(".platform-cell")
      .dispatchEvent(new window.MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
    expect(window.document.querySelector(".platform-cell").classList.contains("platform-cell--fail")).toBe(true);
    expect(failCount.textContent).toContain("1");
  });

  it("switches language on toggle click", () => {
    const window = setupApp();
    const toggle = window.document.getElementById("langToggle");
    const title = window.document.getElementById("pageTitle");
    const initialTitle = title.textContent;

    toggle.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(title.textContent).not.toBe(initialTitle);
  });

  it("keeps exactly one success per row", () => {
    const window = setupApp();
    const successCount = window.document.getElementById("successCount");
    const failCount = window.document.getElementById("failCount");

    let cells = window.document.querySelectorAll(".platform-cell");
    cells[0].dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));

    cells = window.document.querySelectorAll(".platform-cell");
    cells[1].dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));

    const updatedCells = window.document.querySelectorAll(".platform-cell");
    expect(updatedCells[1].classList.contains("platform-cell--success")).toBe(true);
    expect(updatedCells[0].classList.contains("platform-cell--fail")).toBe(true);
    expect(successCount.textContent).toContain("1");
    expect(failCount.textContent).toContain("3");
  });
});
