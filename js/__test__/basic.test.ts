import Light from "../basicSettings";

describe("Light Class", () => {
  let light: Light;
  let container: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    container = document.createElement("div");
    document.body.appendChild(container);
    light = new Light();
  });

  describe("Notification utilities", () => {
    it("should return HTML string for a notification message", () => {
      const message = "Test message";
      const result = light.notification(message);
      expect(result).toContain('<div class="notification">');
      expect(result).toContain(message);
    });

    it("should render a notification into the DOM", () => {
      light.displayNotification("Notification", "beforeend", container);
      expect(container.innerHTML).toContain("notification");
    });

    it("should remove notification after 5 seconds", () => {
      jest.useFakeTimers();
      const element = document.createElement("div");
      container.appendChild(element);
      light.removeNotification(element);
      jest.advanceTimersByTime(5000);
      expect(container.contains(element)).toBe(false);
    });
  });

  describe("Light switch state management", () => {
    it("should switch light on correctly", () => {
      const element = document.createElement("img");
      light.lightSwitchOn(element);
      expect(element.getAttribute("src")).toBe("./assets/svgs/light_bulb.svg");
      expect(element.getAttribute("data-lightOn")).toBe(
        "./assets/svgs/light_bulb_off.svg"
      );
    });

    it("should switch light off correctly", () => {
      const element = document.createElement("img");
      light.lightSwitchOff(element);
      expect(element.getAttribute("src")).toBe(
        "./assets/svgs/light_bulb_off.svg"
      );
      expect(element.getAttribute("data-lightOn")).toBe(
        "./assets/svgs/light_bulb.svg"
      );
    });
  });

  describe("Component selection and light interaction", () => {
    beforeEach(() => {
      light.componentsData = {
        kitchen: {
          name: "kitchen",
          lightIntensity: 0,
          numOfLights: 2,
          isLightOn: false,
          autoOn: "06:00",
          autoOff: "22:00",
          usage: [],
        },
      };
    });

    it("should return selectors and component data", () => {
      container.classList.add("rooms");
      container.innerHTML = `
        <div>
          <p>kitchen</p>
          <div class="light-switch"><img src="" /></div>
        </div>
      `;
      const lightButton = container.querySelector(".light-switch") as Element;
      const result = light.lightComponentSelectors(lightButton);
      expect(result.room).toBe("kitchen");
      expect(result.componentData?.name).toBe("kitchen");
    });

    it("should toggle light on and update intensity slider", () => {
      container.classList.add("rooms");
      container.innerHTML = `
        <div>
          <p>kitchen</p>
          <div class="light-switch"><img src="" /></div>
          <input id="light_intensity" value="0" />
        </div>
      `;
      const lightButton = container.querySelector(".light-switch") as Element;
      light.toggleLightSwitch(lightButton);
      expect(light.componentsData.kitchen.isLightOn).toBe(true);
      expect(
        (container.querySelector("#light_intensity") as HTMLInputElement).value
      ).toBe("5");
    });

    it("should handle light intensity slider correctly", () => {
      container.classList.add("rooms");
      container.innerHTML = `
        <div>
          <p>kitchen</p>
          <div class="light-switch"></div>
          <input id="light_intensity" value="0" />
        </div>
      `;
      const input = container.querySelector("#light_intensity") as Element;
      light.handleLightIntensitySlider(input, 8);
      expect(light.componentsData.kitchen.lightIntensity).toBe(8);
      expect(light.componentsData.kitchen.isLightOn).toBe(true);
    });

    it("should handle light off when slider intensity is 0", () => {
      container.classList.add("rooms");
      container.innerHTML = `
        <div>
          <p>kitchen</p>
          <div class="light-switch"></div>
          <input id="light_intensity" value="5" />
        </div>
      `;
      const input = container.querySelector("#light_intensity") as Element;
      light.handleLightIntensitySlider(input, 0);
      expect(light.componentsData.kitchen.isLightOn).toBe(false);
    });

    it("should update UI when sliderLight is called with true", () => {
      container.classList.add("rooms");
      container.innerHTML = `
        <div>
          <p>kitchen</p>
          <div class="light-switch"><img src="" /></div>
        </div>
      `;
      const lightButton = container.querySelector(".light-switch") as Element;
      light.componentsData.kitchen.lightIntensity = 10;
      light.sliderLight(true, lightButton);
      expect(light.componentsData.kitchen.isLightOn).toBe(false); // method does not toggle it, only affects UI
    });
  });
});
