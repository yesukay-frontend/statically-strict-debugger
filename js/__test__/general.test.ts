import { JSDOM } from "jsdom";
import General from "../general";

const general = new General();

describe("General Class", () => {
  // Initializing a General class instance with default values
  test("should initialize with default isLightOn and lightIntensity values", () => {
    // Arrange & Act
    const general = new General();
    // Assert
    expect(general.componentsData.hall.isLightOn).toBe(false);
    expect(general.componentsData.hall.lightIntensity).toBe(5);
  });

  test("should toggle general light switch", () => {
    // Arrange & Act
    general.toggleGeneralLightSwitch();
    // Assert
    expect(general.componentsData.hall.isLightOn).toBe(true);
  });

  test("Format text to class name", () => {
    // Arrange & Act
    const result = general.formatTextToClassName("Walkway & Corridor");
    // Assert
    expect(result).toBe("walkway_&_corridor");
  });

  test("Set Component Element", () => {
    document.body.innerHTML = `<div class="light-switch"></div>`;
    // Arrange & Act
    const result = general.setComponentElement(general.componentsData.hall);
    // Assert
    expect(result).toBeInstanceOf(HTMLElement);
  });

  test("Toggle Hidden Property", () => {
    // Arrange & Act
    const div: HTMLElement = document.createElement("div");
    general.addHidden(div);

    //   Assert
    expect(div.classList.contains("hidden")).toBe(true);

    //   Act
    general.removeHidden(div);
    expect(div.classList.contains("hidden")).toBe(false);
  });

  test("Update Markup Value", () => {
    const div: HTMLElement = document.createElement("div");
    general.updateMarkupValue(div, "hello");
    expect(div.innerHTML).toBe("hello");
  });

  test("Set Light Intensity", () => {
    let element: HTMLElement;
    const lightIntensity = 0.75;
    element = document.createElement("div");
    document.body.appendChild(element);
    general.handleLightIntensity(element, lightIntensity);

    expect(element.style.filter).toBe(`brightness(${lightIntensity})`);
  });

  describe("closestSelector", () => {
    let container: HTMLElement;
    let selectedElement: Element;

    beforeEach(() => {
      // Setup DOM structure
      container = document.createElement("div");
      container.className = "ancestor";
      container.innerHTML = `
      <div class="ancestor">
        <div class="wrapper">
          <button class="target">Click</button>
          <span class="result">Expected</span>
        </div>
      </div>
    `;
      document.body.appendChild(container);
      selectedElement = container.querySelector(".target") as Element;
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    test("should return the child element of the closest ancestor", () => {
      const result = general.closestSelector(
        selectedElement,
        ".ancestor",
        ".result"
      );
      expect(result).not.toBeNull();
      expect(result?.textContent).toBe("Expected");
    });

    test("should return null if no ancestor matches", () => {
      const result = general.closestSelector(
        selectedElement,
        ".non-existent",
        ".result"
      );
      expect(result).toBeNull();
    });

    test("should return null if no childSelector matches inside the closest ancestor", () => {
      const result = general.closestSelector(
        selectedElement,
        ".ancestor",
        ".not-there"
      );
      expect(result).toBeNull();
    });
  });

  describe("selector", () => {
    let testElement: HTMLElement;

    beforeEach(() => {
      // Setup a dummy DOM element
      testElement = document.createElement("div");
      testElement.className = "test-element";
      testElement.textContent = "Hello";
      document.body.appendChild(testElement);
    });

    afterEach(() => {
      // Cleanup after each test
      document.body.removeChild(testElement);
    });

    test("should return the element when it exists", () => {
      const result = general.selector(".test-element");
      expect(result).not.toBeNull();
      expect(result?.textContent).toBe("Hello");
    });

    test("should return null when the element does not exist", () => {
      const result = general.selector(".non-existent");
      expect(result).toBeNull();
    });
  });

  describe("Notification Methods", () => {
    let container: HTMLElement;

    beforeEach(() => {
      // Setup DOM container
      container = document.createElement("div");
      document.body.appendChild(container);
    });

    afterEach(() => {
      // Cleanup DOM
      document.body.removeChild(container);
    });

    test("should render HTML inside the container", () => {
      const html = "<span class='test'>Test</span>";
      general.renderHTML(html, "beforeend", container);
      expect(container.querySelector(".test")).not.toBeNull();
    });

    test("should return a formatted notification HTML string", () => {
      const message = "Hello!";
      const html = general.notification(message);
      expect(html).toContain(message);
      expect(html).toContain('class="notification"');
    });

    test("should display notification in container", () => {
      general.displayNotification("New Message", "beforeend", container);
      const notification = container.querySelector(".notification");
      expect(notification).not.toBeNull();
      expect(notification?.textContent).toContain("New Message");
    });

    test("should remove notification after 2 seconds", () => {
      jest.useFakeTimers();
      const notification = document.createElement("div");
      notification.className = "notification";
      container.appendChild(notification);

      general.removeNotification(notification);

      expect(container.contains(notification)).toBe(true);

      jest.advanceTimersByTime(2000);

      expect(container.contains(notification)).toBe(false);
      jest.useRealTimers();
    });
  });
  describe("Component Utilities", () => {
    beforeEach(() => {
      // Setup mock data
      general.componentsData = {
        hall: {
          name: "hall",
          lightIntensity: 5,
          numOfLights: 6,
          isLightOn: false,
          autoOn: "06:30",
          autoOff: "22:00",
          usage: [22, 11, 12, 10, 12, 17, 22],
        },
        bedroom: {
          name: "bedroom",
          lightIntensity: 5,
          numOfLights: 3,
          isLightOn: false,
          autoOn: "06:30",
          autoOff: "22:00",
          usage: [18, 5, 7, 5, 6, 6, 18],
        },
      };

      general.wifiConnections = [
        { id: 0, wifiName: "Inet service", signal: "excellent" },
        { id: 1, wifiName: "Kojo_kwame121", signal: "poor" },
        { id: 2, wifiName: "spicyalice", signal: "good" },
        { id: 3, wifiName: "virus", signal: "good" },
      ];
    });

    it("should return component data by name", () => {
      const data = general.getComponent("hall");
      expect(data).toEqual({ ...general.componentsData.hall });
    });

    it("should return undefined for unknown component", () => {
      const data = general.getComponent("kitchen");
      expect(data).toBeUndefined();
    });

    it("should return list of wifi connections", () => {
      const wifi = general.getWifi();
      expect(wifi.length).toBe(4);
      expect(wifi[0].wifiName).toBe("Inet service");
    });

    it("should return selected component name from DOM", () => {
      // Setup DOM
      const rooms = document.createElement("div");
      rooms.className = "rooms";
      rooms.innerHTML = `<div><p>Hall</p></div>`;
      document.body.appendChild(rooms);

      const element = rooms.querySelector("p") as Element;
      const name = general.getSelectedComponentName(element);
      expect(name).toBe("hall");

      document.body.removeChild(rooms);
    });

    it("should return component data from DOM selection", () => {
      // Setup mock data
      general.componentsData = {
        kitchen: {
          name: "kitchen",
          lightIntensity: 5,
          numOfLights: 3,
          isLightOn: false,
          autoOn: "06:30",
          autoOff: "22:00",
          usage: [12, 19, 13, 11, 12, 13, 18],
        },
      };

      // Setup DOM
      const rooms = document.createElement("div");
      rooms.className = "rooms";
      rooms.innerHTML = `<div><p>kitchen</p></div>`;
      document.body.appendChild(rooms);

      const element = rooms.querySelector("p") as Element;
      const component = general.getComponentData(element, ".rooms", "p");

      expect(component).toEqual({
        name: "kitchen",
        lightIntensity: 5,
        numOfLights: 3,
        isLightOn: false,
        autoOn: "06:30",
        autoOff: "22:00",
        usage: [12, 19, 13, 11, 12, 13, 18],
      });

      document.body.removeChild(rooms);
    });

    it("should return undefined if component is not found in DOM", () => {
      const element = document.createElement("div");
      const component = general.getComponentData(element, ".rooms", "p");
      expect(component).toBeUndefined();
    });
  });
});
