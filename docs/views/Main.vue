<template>
    <div class="container">

        <fieldset>
            <h1>Roller picker</h1>

            <div class="playWith">
                <h2>Play with it</h2>

                <roller-picker :options="rp_option_list"
                           :line-height-px="parseInt(rp_line_height)"
                           :font-size="rp_fontsize"
                           :disabled="rp_disabled"
                           :big-roller="rp_big"
                           :jump-top-bottom="rp_jump"
                           :infinite="rp_infinite"
                           :animated="rp_animated"
                           v-model="rp_value">
                    <template v-slot:optionNotFound="slotProps">
                        <div style="background-color: darkcyan;">
                            Index {{slotProps.index}} {{slotProps.option.name}}
                        </div>
                    </template>
                </roller-picker>

                <hr/>

                <label for="rp_value">Value:</label>
                <input type="text" v-model="rp_value" id="rp_value"/>

                <br/>

                <label for="rp_line_height">Line height (px):</label>
                <input type="number" v-model="rp_line_height" id="rp_line_height"/>

                <label for="rp_fontsize">Font size:</label>
                <input type="text" v-model="rp_fontsize" id="rp_fontsize" size="7"/>

                <br/>

                <label for="rp_big">Big roller:</label>
                <input type="checkbox" v-model="rp_big" id="rp_big"/>

                <label for="rp_disabled">Disabled:</label>
                <input type="checkbox" v-model="rp_disabled" id="rp_disabled"/>

                <label for="rp_animated">Animated:</label>
                <input type="checkbox" v-model="rp_animated" id="rp_animated"/>

                <br/>

                <label for="rp_jump">Allow jump top-bottom:</label>
                <input type="checkbox" v-model="rp_jump" id="rp_jump"/>

                <label for="rp_infinite">Infinite scroll:</label>
                <input type="checkbox" v-model="rp_infinite" id="rp_infinite"/>

                <br/>
                <hr/>

                <label for="rp_list">Sample list:</label>
                <select v-model="rp_list" id="rp_list">
                    <option value="long">Long</option>
                    <option value="short">Short</option>
                </select>

            </div>

            <div class="gallery">
              <h2>Gallery</h2>


            </div>

        </fieldset>

    </div>
</template>


<script>
  import { RollerPicker } from '../../src/main'

  export default {
    components: { RollerPicker },
    data () {
      return {
        options_list: ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Kiwi', 'Lemon', 'Orange', 'Peach', 'Pear', 'Pineapple', 'Raspberry', 'Strawberry'],
        options_short: ['Cat', 'Dog', 'Mouse'],
        options_objects: [{'name': 'Apple', 'formValue': 'ap'}, {'name': 'Kiwi', 'formValue': 'ki'}, {'name': 'Peach', 'formValue': 'pe'}],
        rp_value: 'Kiwi',
        rp_line_height: '40',
        rp_fontsize: '28px',
        rp_disabled: false,
        rp_big: false,
        rp_jump: false,
        rp_infinite: false,
        rp_animated: true,
        rp_list: 'long'
      }
    },
    computed: {
      rp_option_list () {
        switch (this.rp_list) {
          case 'long': return this.options_list
          case 'short': return this.options_short
          default: return []
        }
      }
    }
  }
</script>


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


</style>
