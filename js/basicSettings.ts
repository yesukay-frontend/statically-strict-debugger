"use strict";

import General, { ComponentData } from "./general.ts";
interface LightComponentSelectors {
  room: string | undefined;
  componentData: ComponentData | undefined;
  childElement: Element | null;
  background: HTMLElement | null;
}

class Light extends General {
  constructor() {
    super();
  }

  notification(message: string): string {
    return `
            <div class="notification">
                <div>
                    <img src="./assets/svgs/checked.svg" alt="checked svg icon on notifications" >
                </div>
                <p>${message}</p>
            </div>
        `;
  }

  displayNotification(
    message: string,
    position: InsertPosition,
    container: Element
  ): void {
    const html = this.notification(message);
    this.renderHTML(html, position, container);
  }

  removeNotification(element: Element): void {
    setTimeout(() => {
      element.remove();
    }, 5000);
  }

  lightSwitchOn(lightButtonElement: Element): void {
    lightButtonElement.setAttribute("src", "./assets/svgs/light_bulb.svg");
    lightButtonElement.setAttribute(
      "data-lightOn",
      "./assets/svgs/light_bulb_off.svg"
    );
  }

  lightSwitchOff(lightButtonElement: Element): void {
    lightButtonElement.setAttribute("src", "./assets/svgs/light_bulb_off.svg");
    lightButtonElement.setAttribute(
      "data-lightOn",
      "./assets/svgs/light_bulb.svg"
    );
  }

  lightComponentSelectors(
    lightButtonElement: Element
  ): LightComponentSelectors {
    const room: string | undefined =
      this.getSelectedComponentName(lightButtonElement);
    const componentData: ComponentData | undefined = room
      ? this.getComponent(room)
      : undefined;
    const childElement: Element | null = lightButtonElement.firstElementChild;
    const background: HTMLElement | null = this.closestSelector(
      lightButtonElement,
      ".rooms",
      "img"
    ) as HTMLElement | null;
    return { room, componentData, childElement, background };
  }

  toggleLightSwitch(lightButtonElement: Element): void {
    const {
      componentData: component,
      childElement,
      background,
    } = this.lightComponentSelectors(
      lightButtonElement
    ) as LightComponentSelectors;
    const slider = this.closestSelector(
      lightButtonElement,
      ".rooms",
      "#light_intensity"
    );

    if (!(component && childElement && background)) return;

    component.isLightOn = !component.isLightOn;

    if (component.isLightOn) {
      this.lightSwitchOn(childElement);
      component.lightIntensity = 5;
      const lightIntensity = component.lightIntensity / 10;
      this.handleLightIntensity(background, lightIntensity);
      if (slider)
        (slider as HTMLInputElement).value =
          component.lightIntensity.toString();
    } else {
      this.lightSwitchOff(childElement);
      this.handleLightIntensity(background, 0);
      if (slider) (slider as HTMLInputElement).value = "0";
    }
  }

  handleLightIntensitySlider(element: Element, intensity: number) {
    const { componentData } = this.lightComponentSelectors(element);

    if (typeof intensity !== "number" || Number.isNaN(intensity)) return;

    componentData!.lightIntensity = intensity;

    const lightSwitch: Element | null = this.closestSelector(
      element,
      ".rooms",
      ".light-switch"
    );

    if (intensity === 0) {
      this.sliderLight(componentData!.isLightOn, lightSwitch as Element);
      return;
    }
    if (!componentData || !lightSwitch) return;

    componentData.isLightOn = intensity !== 0;
    this.sliderLight(componentData.isLightOn, lightSwitch);
  }

  sliderLight(isLightOn: boolean, lightButtonElement: Element): void {
    const {
      componentData: component,
      childElement,
      background,
    } = this.lightComponentSelectors(lightButtonElement);

    if (!(component && childElement && background)) return;
    if (isLightOn) {
      this.lightSwitchOn(childElement as Element);
      const lightIntensity = component.lightIntensity / 10;
      this.handleLightIntensity(background as HTMLElement, lightIntensity);
    } else {
      this.lightSwitchOff(childElement as Element);
      this.handleLightIntensity(background as HTMLElement, 0);
    }
  }
}

export default Light;
