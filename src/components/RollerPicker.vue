<template>
    <div class="roller-picker-container" ref="rollerPicker" tabindex="0"
         :style="{
                '--lineHeight': lineHeight,
                '--overlayHeightMult': bigRoller ? 2 : 1,
                '--fontSize': fontSize,
                '--pickedIndex': pickedIndex
        }">
        <div class="pick-selector rollLine">
            <div v-for="(option, i) in options" :key="'option-' + i" class="pick-option">
                <slot name="option" :option="option" :index="i">
                    <div>{{getOptionLabel(i)}}</div>
                </slot>
            </div>
        </div>
        <div class="overlay overlay-top"></div>
        <div class="overlay overlay-middle"></div>
        <div class="overlay overlay-bottom"></div>
    </div>
</template>

<script>
  export default {
    //TODO touch actions
    //TODO scroll actions
    //TODO active option
    //TODO "infinite" roll

    name: 'RollerPicker',
    props: {
      value: {
        default: '',
      },
      options: {
        default: [],
        type: Array
      },
      disabled: {
        default: false,
        type: Boolean
      },
      bigRoller: {
        default: false,
        type: Boolean
      },
      lineHeight: {
        default: '40px',
        type: String
      },
      fontSize: {
        default: '28px',
        type: String
      },
      formName: {
        default: 'rollerPicker',
        type: String
      }
    },
    data () {
      return {
        pickedValue: {},
        pickedLabel: '',
        pickedIndex: 0
      }
    },
    mounted () {
      window.addEventListener('keyup', this.onKeyUp)
    },
    computed: {
      singleLineHeight () {
        //TODO not needed
        return this.computeHeight(1)
      },
    },
    methods: {
      onKeyUp (event) {
        if (this.isSelectorFocused()) {
          console.log('key up', event.keyCode)
          if (event.keyCode === 33 || event.keyCode === 38) { // page up || up arrow
            this.selectUp()
            event.preventDefault()
          }

          if (event.keyCode === 34 || event.keyCode === 40) { // page down || down arrow
            this.selectDown()
            event.preventDefault()
          }

          if (event.keyCode === 36) { // home button
            this.selectIndex(0)
            event.preventDefault()
          }

          if (event.keyCode === 35) { // end button
            this.selectIndex(-1)
            event.preventDefault()
          }
        }
      },
      isSelectorFocused() {
        return document.activeElement === this.$refs.rollerPicker
      },
      selectIndex(index) {
        if (this.disabled) return
        if(index === -1) index = this.options.length - 1
        // if not found, go back to first
        console.log('select index', index)
        if(typeof this.options[index] === 'undefined') index = 0
        this.pickedIndex = index
        this.pickedValue = this.getOptionValue(index)
        this.pickedLabel = this.getOptionLabel(index)
        this.$emit('input', this.pickedValue)
      },
      selectDown(iteration) {
        if(typeof iteration === 'undefined') iteration = 1
        // go down is next in the list
        this.selectIndex(this.pickedIndex + iteration)
      },
      selectUp(iteration) {
        if(typeof iteration === 'undefined') iteration = 1
        // go up is previous in the list
        this.selectIndex(this.pickedIndex - iteration)
      },
      getOptionValue(index) {
        const optionType = typeof this.options[index]
        if(optionType === 'string') {
          return this.options[index]
        } else if (optionType === 'object' && typeof this.options[index]['value'] !== 'undefined') {
            return this.options[index]['value']
        } else {
          console.log('Value not found in option ' + index + ' (type ' + optionType + ')')
          return {}
        }
      },
      getOptionLabel(index) {
        const optionType = typeof this.options[index]
        if(optionType === 'string') {
          return this.options[index]
        } else if (optionType === 'object' && typeof this.options[index]['label'] !== 'undefined') {
          return this.options[index]['label']
        } else {
          console.log('Label not found in option ' + index + ' (type ' + optionType + ')')
          return {}
        }
      }
    },
    watch: {
      value: {
        handler: function (newVal, oldVal) {
          this.pickedValue = newVal
          this.pickedIndex = this.options.indexOf(newVal)
          this.pickedLabel = this.getOptionLabel(this.pickedIndex)
          //picked index is -1 if not found, force to 0
          if(this.pickedIndex < 0) this.pickedIndex = 0
        }
      },
      pickedIndex: {
        handler: function (newVal, oldVal) {
          console.log('picked index change', oldVal, newVal)
        }
      }
    },
    created () {
      this.pickedValue = this.value
      this.pickedIndex = this.options.indexOf(this.pickedValue)
      this.pickedLabel = this.getOptionLabel(this.pickedIndex)
      //picked index is -1 if not found, force to 0
      if(this.pickedIndex < 0) this.pickedIndex = 0
    }
  }
</script>

<style lang="scss" scoped>

    .roller-picker-container {
        position: relative;
        display: flex;
        flex-wrap: nowrap;
        /* number of lines: 1 for selector + X top + X bottom, X multiplier according to big or small roller*/
        height: calc(var(--lineHeight) * (var(--overlayHeightMult) * 2 + 1));
        max-height: calc(var(--lineHeight) * (var(--overlayHeightMult) * 2 + 1));
        text-align: center;
        overflow: hidden;
    }
    .pick-selector {
        width: 100%;
        cursor: grab;
        margin-top: calc(var(--lineHeight) * var(--overlayHeightMult));
        &.rolling {
            animation: rolling 2s linear infinite;
        }
        &.rollLine {
            transition: transform 0.2s;
            transform: translateY(calc(var(--lineHeight) * var(--pickedIndex) * -1));
        }
    }
    .pick-option {
        font-size: var(--fontSize);
        height: var(--lineHeight);
        line-height: var(--lineHeight);
    }
    .overlay {
        position: absolute;
        width: 100%;
        z-index: 1;
        height: calc(var(--lineHeight) * var(--overlayHeightMult));
        &.overlay-top {
            top: 0;
            background: linear-gradient(
                            to top,
                            rgba(255, 255, 255, 0),
                            rgba(255, 255, 255, 1)
            );
        }
        &.overlay-bottom {
            bottom: 0;
            background: linear-gradient(
                            to bottom,
                            rgba(255, 255, 255, 0),
                            rgba(255, 255, 255, 1)
            );
        }
        &.overlay-middle {
            top: calc(var(--lineHeight) * var(--overlayHeightMult));
            height: var(--lineHeight);
            border-style: solid;
            border-width: 1px 0;
            border-color: lightgray;
        }
    }

    @keyframes rolling {
        /*TODO to be reviewed*/
        99% {
            transform: translateY(-100%);
        }
        100% {
            transform: translateY(0);
        }
    }
</style>
