<template>
    <div class="container">

        <fieldset>
            <h1>Roller picker</h1>

            <div class="playWith">
                <h2>Play with it</h2>

                <roller-picker :options="['Apple', 'Banana', 'Kiwi', 'Orange', 'Pear', 'Pineapple', 'Strawberry']"
                           :disabled="rp_disabled"
                           v-model="rp_value">
                    <template v-slot:optionNotExist="slotProps">
                        <div style="background-color: darkcyan;">
                            Index {{slotProps.index}}
                        </div>
                    </template>
                </roller-picker>

                <hr/>

                <label for="rp_value">Value:</label>
                <input type="text" v-model="rp_value" id="rp_value"/>

                <label for="rp_disabled">Disabled:</label>
                <input type="checkbox" v-model="rp_disabled" id="rp_disabled"/>

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
        rp_value: 'Kiwi',
        rp_disabled: false
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
