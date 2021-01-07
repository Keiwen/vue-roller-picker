# vue-roller-picker
[![npm](https://img.shields.io/npm/v/vue-roller-picker.svg)](https://www.npmjs.com/package/vue-roller-picker)
[![npm](https://img.shields.io/npm/dt/vue-roller-picker.svg)](https://www.npmjs.com/package/vue-roller-picker)

Roll-designed selector

[Live demo here](https://keiwen.github.io/vue-roller-picker/)

Roller can be moved:
- if focused, with `up`/`down` arrows or `page up/down` to move up and down, `home`/`end` to jump top and bottom
- with mouse wheel
- with mouse grab or touch move

In progress: allow 'infinite' spin

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
<roller-picker></roller-picker>
```
```
<roller-picker :options="['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Kiwi', 'Lemon', 'Orange', 'Peach', 'Pear', 'Pineapple', 'Raspberry', 'Strawberry']"
           :line-height-px="rp_line_height"
           :font-size="rp_fontsize"
           :disabled="rp_disabled"
           :big-roller="rp_big"
           :jump-top-bottom="rp_jump"
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
| `options` | `array` | array of available options. Each options is expected as string or object (then attribute `formValue` is used for input value)  |
| `disabled` | `Boolean` | Disabled roller move and other option selection. Default is false |
| `bigRoller` | `Boolean` | Switch to bigger roller with 5 visible options. Default is false (3 visible options) |
| `jumpTopBottom` | `Boolean` | Allow to jump bottom when moving above top, and vice-versa. Default is false |
| `lineHeightPx` | `Number` | Height of each option (integer, in px). Default is 40 |
| `fontSize` | `String` | Font-size of options labels. Default is '28px' |
| `formName` | `string` | Set the 'name' attribute of the form input. Default is 'rollerPicker' |


Events:
- 'input' on value change, returning picked option

## Contribution
- Fork the repository
- Run `npm install`
- You can run `npm run dev`, site is at http://localhost:8081.
- Do your stuff
- When you're done, run `npm run build` command and commit your work for a pull request.
