# vue-roller-picker
[![npm](https://img.shields.io/npm/v/vue-roller-picker.svg)](https://www.npmjs.com/package/vue-roller-picker)
[![npm](https://img.shields.io/npm/dt/vue-roller-picker.svg)](https://www.npmjs.com/package/vue-roller-picker)

Roll-designed selector component for vue3. See versions 2.X for vue2 component.
RollerPicker can be moved:
- if focused, with `up`/`down` arrows or `page up/down` to move up and down,
  `home`/`end` to jump top and bottom
- with mouse wheel
- with mouse grab or touch move

Note on 'infinite' spin: animation may not be always smooth

[Live demo here](https://keiwen.github.io/vue-roller-picker/)

## Global use
- npm install in console
```
npm install --save vue-roller-picker
```
- import components in your code
```
import { RollerPicker } from 'vue-roller-picker'
```
you may also import it globally in your app
```
import { createApp } from "vue";
import vueRollerPicker from "vue-roller-picker";
createApp(App).use(vueRollerPicker);
```
- Use components as described below

## Component usage
### In code
```
<roller-picker :options=['a', 'b']></roller-picker>
```
```
<roller-picker :options="['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Kiwi', 'Lemon', 'Orange', 'Peach', 'Pear', 'Pineapple', 'Raspberry', 'Strawberry']"
           :line-height-px="rpLineHeight"
           :font-size="rpFontsize"
           :disabled="rpDisabled"
           :big-roller="rpBig"
           :jump-top-bottom="rpJump"
           :infinite="rpInfinite"
           :rolling="rpRolling"
           :rolling-end-class="rpRollingEndClass"
           :animated="rpAnimated"
           :roll-animation-on-update="rpRollAnimation"
           v-model="rpValue">
    <template v-slot:option="slotProps">
        <div style="background-color: darkcyan;">
            Index {{slotProps.index}} - Label {{ slotProps.option }}
        </div>
    </template>
</roller-picker>
```

| Prop | Type      |                                                                                                                                                     Note |
| :--- |:----------|---------------------------------------------------------------------------------------------------------------------------------------------------------:|
| `options` | `array`   |                                                                       REQUIRED. Array of available options. Each options is expected as string or object |
| `disabled` | `Boolean` |                                                                                        Disabled roller move and other option selection. Default is false |
| `animated` | `Boolean` |                                                                                                Add CSS transition when moving in roller. Default is true |
| `infinite` | `Boolean` |                      Allow 'infinite' roll: first options are displayed after last ones and last ones also displayed before first ones. Default is false |
| `rolling` | `Boolean` | Only if infinite is on. True will start rolling animation, false will switch to rolling end animation. Default is false (if no change, no animation set) |
| `rollingEndClass` | `String`  |                                                                                      Css class given to selector when rolling ends. Default is 'rollend' |
| `bigRoller` | `Boolean` |                                                                     Switch to bigger roller with 5 visible options. Default is false (3 visible options) |
| `jumpTopBottom` | `Boolean` |                                                                             Allow to jump bottom when moving above top, and vice-versa. Default is false |
| `lineHeightPx` | `Number`  |                                                                                                    Height of each option (integer, in px). Default is 40 |
| `fontSize` | `String`  |                                                                                                        Font-size of options labels. Default is 'inherit' |
| `formName` | `string`  |                                                                                    Set the 'name' attribute of the form input. Default is 'rollerPicker' |
| `rollAnimationOnUpdate` | `number`  |                                (ms) If > 0, changing the value from parent will trigger a rolling animation for this duration. Default is 0, no rolling. |

Notes about options:
- Options property must be a filled array
- RollerPicker display a label for each option (if slot not overloaded). Label equal option value (if option is string) or `label` field (if option is object and field exist).
- RollerPicker use an input hidden tag for forms. Value attribute is filled with option value (if option is string) or `formValue` field (if option is object and field exist).

Notes about disabling: a disabled RollerPicker can still have its model changed.
If set accordingly, changing the model from a parent component
could still trigger rolling animations, while user cannot interact in RollerPicker.

### Slot
Roller picker provide a 'option' slot which can be used to display option as needed.
Slot props are 'index' and 'option' (= value or full object provided in initial array).

### Spinbutton
Spinbutton pattern (from WAI-ARIA specifications) is implemented.
By focusing the component, you can use keyboard to:
- move up (arrow up or page up keys),
- move down (arrow down or page down keys),
- move to first (home key)
- move to last (end key).
The RollerPicker cannot be focused by just clicking, you can focus it with tab key.

### Style
The whole component is included in a div with class `roller-picker-container`.

CSS can be overloaded to personalize the roller, for example:
- middle overlay: around the picked value, class `overlay overlay-middle`
- top and bottom overlays: above or under picked value, class `overlay overlay-top` or `overlay overlay-bottom`
- selected option: corresponding div element have class `pick-option-active`
- rolling end class: set another classname with prop and defined it with desired animation

### Slot machine usecase sample
Sample use of rolling (slot machine style). You need an infinite roller.

Option 1:
- define `rollAnimationOnUpdate` property > 0
- set value (a random one among given options)

Beware that in this case, if new value = old value, no change is detected
and therefore no animation is triggered

Option 2:
- manually start rolling (rolling property to true)
- set value (a random one among given options)
- manually stop rolling (rolling property to false)

## Contribution
- Fork the repository
- Run `npm install`
- You can run `npm run dev`, site is at http://localhost:8081.
- Do your stuff
- When you're done, run `npm run build` command and commit your work for a pull request.
