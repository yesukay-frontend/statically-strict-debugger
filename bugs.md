1. Converted codebase to TypeScript and utitized TypeScript error checking to resolve all reference, null and obvious Type checking errors by strictly typing variables/functions/methods/parameters.

2. Created method to parse time value to Int.

3. Refactored capFirstLetter() into a modular one

4. Error fixed by using backticks for getComponent()

5. Refactored formatTextToClassName() method

6. Set light intensity to 0 when slider value is 0

7. In Basic class, getSelectedComponent method wrongly accessed the room[0]

8.In Advanced settings, customizeAutomaticOnPreset method wrongly checked the negated "value" with double !!

9. The keys for some elements in the rooms object had [] or [[]] wrapped around it hence accessing suck keys was problematic with the code structure

10. # for marking private was maintained instead of switching to "private" keyword because i want to maintain the private state during runtime as well. Using private keyword will make the compiled code ignore the private keyword.

11. Refactored formatTime() to handle hour & min as parsed values

12. In main.ts mainRoomsContainer being hooked up with the change event listener, handleLightIntensitySlider() expected an integer but got a string which had to be parsed
