# vue-roller-picker
[![npm](https://img.shields.io/npm/v/vue-roller-picker.svg)](https://www.npmjs.com/package/vue-roller-picker)
[![npm](https://img.shields.io/npm/dt/vue-roller-picker.svg)](https://www.npmjs.com/package/vue-roller-picker)

Roll-designed selector

[Live demo here](https://keiwen.github.io/vue-roller-picker/)

Roller can be moved:
- if focused, with `up`/`down` arrows or `page up/down` to move up and down,
`home`/`end` to jump top and bottom
(cannot be focused by direct click on it, but with tab)
- with mouse wheel
- with mouse grab or touch move

CSS can be overloaded to personnalize the roller, for example:
- middle overlay: around the picked value, class 'overlay overlay-middle'
- top and bottom overlays: above or under picked value, class 'overlay overlay-top' or 'overlay overlay-bottom'
- selected option: corresponding div element have class 'pick-option-active' 
- rolling end class: set another classname with prop and defined it with desired animation

Roller picker provide a 'option' slot which can be used to display option as needed.
Slot props are 'index' and 'option' (see sample in component section)

Note on 'infinite' spin: animation may not be always smooth

Sample use of rolling (slot machine style):
- start rolling (rolling property true)
- set value (random among options list)
- stop rolling (rolling property false)

## Global use
- npm install
```
npm install --save vue-roller-picker
```
- import components
```
import { RollerPicker } from 'vue-roller-picker'
```
- declare use or imported components in your vue script
```
export default {
    components: { RollerPicker },
    methods: ...
}
```
- Use components as described below

## Components
### Roller picker
```
<roller-picker :options=['a', 'b']></roller-picker>
```
```
<roller-picker :options="['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Kiwi', 'Lemon', 'Orange', 'Peach', 'Pear', 'Pineapple', 'Raspberry', 'Strawberry']"
           :line-height-px="rp_line_height"
           :font-size="rp_fontsize"
           :disabled="rp_disabled"
           :big-roller="rp_big"
           :jump-top-bottom="rp_jump"
           :infinite="rp_infinite"
           :rolling="rp_rolling"
           :rolling-end-class="rp_rolling_end_class"
           :animated="rp_animated"
           v-model="rp_value">
    <template v-slot:option="slotProps">
        <div style="background-color: darkcyan;">
            Index {{slotProps.index}}
        </div>
    </template>
</roller-picker>
```

| Prop | Type | Note
| :--- | :--- | ---: |
| `options` | `array` | REQUIRED. Array of available options. Each options is expected as string or object  |
| `disabled` | `Boolean` | Disabled roller move and other option selection. Default is false |
| `animated` | `Boolean` | Add CSS transition when moving in roller. Default is true |
| `infinite` | `Boolean` | Allow 'infinite' roll: first options are displayed after last ones and last ones also displayed before first ones. Default is false |
| `rolling` | `Boolean` | Only if infinite is on. True will start rolling animation, false will switch to rolling end animation. Default is false (if no change, no animation set) |
| `rollingEndClass` | `String` | Css class given to selector when rolling ends. Default is 'rollend' |
| `bigRoller` | `Boolean` | Switch to bigger roller with 5 visible options. Default is false (3 visible options) |
| `jumpTopBottom` | `Boolean` | Allow to jump bottom when moving above top, and vice-versa. Default is false |
| `lineHeightPx` | `Number` | Height of each option (integer, in px). Default is 40 |
| `fontSize` | `String` | Font-size of options labels. Default is '28px' |
| `formName` | `string` | Set the 'name' attribute of the form input. Default is 'rollerPicker' |

Notes about options:
- Options property must be an filled array
- Component display a label for each options (if slot not overloaded). Label equal option value (if option is string) or `label` field (if option is object and field exist).
- Component use an input hidden tag. Value attribute is filled with option value (if option is string) or `formValue` field (if option is object and field exist).

Events:
- 'input' on value change, returning picked option

## Contribution
- Fork the repository
- Run `npm install`
- You can run `npm run dev`, site is at http://localhost:8081.
- Do your stuff
- When you're done, run `npm run build` command and commit your work for a pull request.
