<script setup>
import { ref, computed } from 'vue'
import { RollerPicker } from '../src/index'

const optionsList = ref(['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Kiwi', 'Lemon', 'Orange', 'Peach', 'Pear', 'Pineapple', 'Raspberry', 'Strawberry'])
const optionsShort = ref(['Cat', 'Dog', 'Mouse'])
const optionsObjects = ref([{ label: 'Red', formValue: 'r' }, { label: 'Blue', formValue: 'b' }, { label: 'Yellow', formValue: 'y' }])
const rpValue = ref('Kiwi')
const rpLineHeight = ref(40)
const rpFontsize = ref('28px')
const rpDisabled = ref(false)
const rpBig = ref(false)
const rpJump = ref(false)
const rpInfinite = ref(false)
const rpAnimated = ref(true)
const rpRolling = ref(false)
const rpList = ref('long')
const rpRollAnimation = ref(0)

const rpOptionList = computed(() => {
  switch (rpList.value) {
    case 'long': return optionsList.value
    case 'short': return optionsShort.value
    case 'object': return optionsObjects.value
    default: return []
  }
})

const randomize = () => {
  rpValue.value = rpOptionList.value[Math.floor(Math.random() * rpOptionList.value.length)]
}

</script>

<template>
  <div class="container">

    <fieldset>
      <h1>Roller picker</h1>

      <div class="playWith">
        <h2>Play with it</h2>

        <roller-picker :options="rpOptionList"
                       :line-height-px="rpLineHeight"
                       :font-size="rpFontsize"
                       :disabled="rpDisabled"
                       :big-roller="rpBig"
                       :jump-top-bottom="rpJump"
                       :infinite="rpInfinite"
                       :animated="rpAnimated"
                       :rolling="rpRolling"
                       :roll-animation-on-update="rpRollAnimation"
                       v-model="rpValue">
          <template v-slot:optionNotFound="slotProps">
            <div style="background-color: darkcyan;">
              Index {{slotProps.index}} {{slotProps.option.label}}
            </div>
          </template>
        </roller-picker>

        <hr/>

        <label for="rpValue">Value:</label>
        <input type="text" v-model="rpValue" id="rpValue"/>

        <br/>

        <label for="rpLineHeight">Line height (px):</label>
        <input type="number" v-model="rpLineHeight" id="rpLineHeight"/>

        <label for="rpFontsize">Font size:</label>
        <input type="text" v-model="rpFontsize" id="rpFontsize" size="7"/>

        <br/>

        <label for="rpBig">Big roller:</label>
        <input type="checkbox" v-model="rpBig" id="rpBig"/>

        <label for="rpDisabled">Disabled:</label>
        <input type="checkbox" v-model="rpDisabled" id="rpDisabled"/>

        <label for="rpAnimated">Animated:</label>
        <input type="checkbox" v-model="rpAnimated" id="rpAnimated"/>

        <br/>

        <label for="rpJump">Allow jump top-bottom:</label>
        <input type="checkbox" v-model="rpJump" id="rpJump"/>

        <label for="rpInfinite">Infinite scroll:</label>
        <input type="checkbox" v-model="rpInfinite" id="rpInfinite"/>

        <br/>

        If infinite:
        <br/>

        <label for="rpRolling">Rolling:</label>
        <input type="checkbox" v-model="rpRolling" id="rpRolling"/>

        <label for="rpRollAnimation">Animation time when changing model (ms):</label>
        <input type="number" v-model="rpRollAnimation" id="rpRollAnimation" size="7"/>

        <br/>
        <hr/>

        <label for="rpList">Sample list:</label>
        <select v-model="rpList" id="rpList">
          <option value="long">Long</option>
          <option value="short">Short</option>
          <option value="object">Objects</option>
        </select>

        <br/><br/>
        <button @click="randomize()">Random pick</button>

      </div>

      <div class="gallery">
        <h2>Gallery</h2>

        <div class="date-picker">
          <roller-picker :options="['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']">
          </roller-picker>
          <roller-picker :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]">
          </roller-picker>
        </div>

        <br/>

        <roller-picker :options="['Africa', 'America', 'Asia', 'Europe', 'Oceania']"
                       class="demo-continent"
                       :big-roller="true" :infinite="true">
        </roller-picker>

        <roller-picker :options="['Arthur', 'Bruce', 'Chris', 'Gary', 'Jack', 'John', 'Mark', 'Michael', 'Paul', 'Peter', 'Simon', 'Vincent']"
                       class="demo-firstname"
                       :infinite="true" :rolling="true">
        </roller-picker>

      </div>

    </fieldset>

  </div>
</template>

<style lang="scss">
h1 {
  margin-top: 0;
  margin-bottom: 0;
}

.container {
  margin-top: 20px;
}

.playWith {
  width: 60%;
  float: left;
}

.gallery {
  float: right;
  width: 30%;
}

.date-picker {
  > div {
    display: inline-block;
    width: 45%;
    &:last-child {
      float: right;
    }
  }
}

.demo-continent {
  .pick-option {
    background-color: darkred;
    font-weight: bold;
    font-size: x-large;
  }
  .overlay-global {
    border: 10px solid gold;
    height: calc(100% - 20px);
    width: calc(100% - 20px);
  }
  .overlay-middle {
    border: 3px solid gold !important;
  }
}

.demo-firstname {
  background-color: darkcyan;
  font-size: large;
}

</style>
