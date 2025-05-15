import General from "../general";
const general = new General();
describe("General Class", () => {
    // Initializing a General class instance with default values
    test("should initialize with default isLightOn and lightIntensity values", () => {
        // Arrange & Act
        const general = new General();
        // Assert
        expect(general.isLightOn).toBe(false);
        expect(general.lightIntensity).toBe(5);
    });
    test("should toggle general light switch", () => {
        // Arrange & Act
        general.toggleGeneralLightSwitch();
        // Assert
        expect(general.isLightOn).toBe(true);
    });
});
