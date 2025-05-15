import AdvanceSettings from "../advanceSettings";
import { ComponentData } from "../general";

jest.mock("./basicSettings.js"); // If Light has methods we need to mock

describe("AdvanceSettings Class", () => {
  let advanceSettings: AdvanceSettings;

  const mockComponent: ComponentData = {
    name: "kitchen",
    lightIntensity: 5,
    numOfLights: 3,
    isLightOn: false,
    autoOn: "06:30",
    autoOff: "22:00",
    usage: [12, 19, 13, 11, 12, 13, 18],
  };

  beforeEach(() => {
    advanceSettings = new AdvanceSettings();
    document.body.innerHTML = `
      <div class="advanced_features_container"></div>
      <canvas id="myChart"></canvas>
    `;
  });

  test("capFirstLetter capitalizes the first letter of a word", () => {
    expect(advanceSettings.capFirstLetter("hello")).toBe("Hello");
    expect(advanceSettings.capFirstLetter("")).toBe("");
  });

  test("getSelectedComponent returns correct component from data", () => {
    (advanceSettings as any).componentsData = { kitchen: mockComponent };
    expect(advanceSettings.getSelectedComponent("Kitchen")).toBe(mockComponent);
  });

  test("getSelectedSettings returns correct HTML markup", () => {
    (advanceSettings as any).componentsData = { kitchen: mockComponent };
    const html = advanceSettings.getSelectedSettings("Kitchen");
    expect(typeof html).toBe("string");
    expect(html).toContain("Advanced features");
    expect(html).toContain("kitchen");
  });

  test("setNewData updates the correct component key", () => {
    (advanceSettings as any).componentsData = { kitchen: { ...mockComponent } };
    advanceSettings.setNewData("Kitchen", "autoOn", "08:00");
    expect((advanceSettings as any).componentsData.kitchen.autoOn).toBe(
      "08:00"
    );
  });

  test("parseTime returns correct integer from string", () => {
    expect(advanceSettings.parseTime("08")).toBe(8);
  });

  test("formatTime returns a valid Date object", () => {
    const result = advanceSettings.formatTime("08:30");
    expect(result).toBeInstanceOf(Date);
    expect(result.getHours()).toBe(8);
    expect(result.getMinutes()).toBe(30);
  });

  test("timeDifference returns the correct ms diff", () => {
    const now = new Date();
    const future = `${now.getHours()}:${now.getMinutes() + 1}`;
    const diff = advanceSettings.timeDifference(future);
    expect(diff).toBeGreaterThan(0);
  });

  test("timer resolves when time matches", async () => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + 2); // set time to 2 seconds ahead

    const mockToggle = jest
      .spyOn(advanceSettings as any, "toggleLightSwitch")
      .mockImplementation(() => Promise.resolve());

    const promise = advanceSettings.timer(date, mockComponent);
    await expect(promise).resolves.not.toThrow();
  });

  test("automateLight calls timer with formatted time", async () => {
    const spy = jest
      .spyOn(advanceSettings, "timer")
      .mockResolvedValue(undefined);
    await advanceSettings.automateLight("09:00", mockComponent);
    expect(spy).toHaveBeenCalled();
  });

  test("customizationCancelled resets input field", () => {
    const parent = document.createElement("div");
    parent.className = "customization";
    const input = document.createElement("input");
    input.value = "12:00";
    parent.appendChild(input);
    document.body.appendChild(parent);

    const mockElement = input;
    const spy = jest
      .spyOn(advanceSettings as any, "closestSelector")
      .mockReturnValue(input);

    advanceSettings.customizationCancelled(mockElement, ".customization");
    expect(input.value).toBe("");
    spy.mockRestore();
  });

  test("getObjectDetails returns instance", () => {
    expect(advanceSettings.getObjectDetails()).toBe(advanceSettings);
  });
});
