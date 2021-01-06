# vue-roller-picker
[![npm](https://img.shields.io/npm/v/vue-roller-picker.svg)](https://www.npmjs.com/package/vue-roller-picker)
[![npm](https://img.shields.io/npm/dt/vue-roller-picker.svg)](https://www.npmjs.com/package/vue-roller-picker)

Roll-designed selector

[Live demo here](https://keiwen.github.io/vue-roller-picker/)

//// This component fits as spinbutton, allowing keyboard functionalities (`up`/`down` arrows or `page up/down` to increment/decrement, `home`/`end` to min/max)

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


| Prop | Type | Note
| :--- | :--- | ---: |
| `min` | `number` | minimum possible value. Cannot decrement lower. Default is 0 |


Events:
- 'input' on value change

## Contribution
- Fork the repository
- Run `npm install`
- You can run `npm run dev`, site is at http://localhost:8081.
- Do your stuff
- When you're done, run `npm run build` command and commit your work for a pull request.
