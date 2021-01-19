<template>
    <div class="roller-picker-container" ref="rollerPicker" tabindex="0" role="spinbutton"
         :style="{
                '--lineHeight': lineHeightPx + 'px',
                '--rollerHeight': lineHeightPx * (bigRoller ? 5 : 3) + 'px',
                '--overlayHeight': lineHeightPx * (bigRoller ? 2 : 1) + 'px',
                '--fontSize': fontSize,
                '--pickedIndex': pickedIndex,
                '--offsetY': offsetY + 'px',
                'cursor': startScrollY > 0 ? 'grabbing' : 'grab'
        }">
        <div class="pick-selector">
            <div v-for="(option, i) in options" :key="'option-' + i" class="pick-option" :class="(i === pickedIndex) ? 'pick-option-active' : ''">
                <slot name="option" :option="option" :index="i">
                    <div>{{getOptionLabel(i)}}</div>
                </slot>
            </div>
        </div>
        <div class="overlay overlay-top"></div>
        <div class="overlay overlay-middle"></div>
        <div class="overlay overlay-bottom"></div>
        <div class="overlay-global"></div>
        <input type="hidden" :name="formName" :value="getOptionFormValue(pickedIndex)" />
    </div>
</template>

<script>
  export default {

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
      jumpTopBottom: {
        default: false,
        type: Boolean
      },
      lineHeightPx: {
        default: 40,
        type: Number
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
        pickedIndex: 0,
        transitionActive: true,
        startScrollY: 0, //when scrolling, Y initial position on client (if > 0, scrolling ongoing)
        startScrollOffsetY: 0, //when scrolling, Y initial offset
        offsetY: 0 //current offset from top
      }
    },
    mounted () {
      window.addEventListener('keyup', this.onKeyUp)
      window.addEventListener('wheel', this.onScroll)
      //touch events
      window.addEventListener('touchstart', this.onRollStart)
      window.addEventListener('touchmove', this.onRollMove)
      window.addEventListener('touchend', this.onRollEnd)
      window.addEventListener('touchcancel', this.onRollCancel)
      // mouse events
      window.addEventListener('mousedown', this.onRollStart)
      window.addEventListener('mousemove', this.onRollMove)
      window.addEventListener('mouseup', this.onRollEnd)
      window.addEventListener('mouseout', this.onRollCancel)
    },
    methods: {
      onKeyUp (event) {
        if (this.isSelectorFocused()) {
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
      onScroll (event) {
        //only if element is under roller picker
        if (event.srcElement.parentElement === this.$refs.rollerPicker) {
          if (event.deltaY > 0) {
            this.selectDown()
          } else {
            this.selectUp()
          }
        }
      },
      onRollStart (event) {
        if (this.disabled) return
        //only if element is under roller picker
        if (event.srcElement.parentElement === this.$refs.rollerPicker) {
          //store Y initial position when starting scroll
          //scroll position: clientY for mouse event, [changedTouches[0].clientY for touch event
          this.startScrollY = event.clientY ? event.clientY : event.changedTouches[0].clientY
          //store Y initial offset when starting scroll
          this.startScrollOffsetY = this.offsetY
          event.preventDefault()
        }
      },
      onRollMove (event) {
        if (this.disabled) return
        //only if element is under roller picker & if we start scrolling
        if (event.srcElement.parentElement === this.$refs.rollerPicker && this.startScrollY) {
          const newScrollY = event.clientY ? event.clientY : event.changedTouches[0].clientY
          //diff between initial scroll position and current scroll position
          const diffY = newScrollY - this.startScrollY
          //update global offset with initial offset + current diff
          this.offsetY = this.startScrollOffsetY + diffY
          event.preventDefault()
        }
      },
      onRollEnd (event) {
        if (this.disabled) return
        if (event.srcElement.parentElement === this.$refs.rollerPicker && this.startScrollY) {
          //scroll position stored on move, now just need to re-init initial scroll position
          this.startScrollY = 0
          let nearestIndex = Math.round(this.offsetY / this.lineHeightPx) * -1
          if(this.jumpTopBottom) {
            if(nearestIndex < 0) nearestIndex = -1
            if(nearestIndex >= this.options.length) nearestIndex = 0
          } else {
            if(nearestIndex < 0) nearestIndex = 0
            if(nearestIndex >= this.options.length) nearestIndex = -1
          }
          this.selectIndex(nearestIndex)
          event.preventDefault()
        }
      },
      onRollCancel (event) {
        if (event.srcElement.parentElement === this.$refs.rollerPicker && this.startScrollY) {
          this.startScrollY = 0
          //cancel generated offset
          this.offsetY = this.startScrollOffsetY
          event.preventDefault()
        }
      },
      isSelectorFocused() {
        return document.activeElement === this.$refs.rollerPicker
      },
      selectIndex(index) {
        if (this.disabled) return
        if(index === -1) index = this.options.length - 1
        // if not found, go back to first
//        console.log('select index', index)
        if(typeof this.options[index] === 'undefined') index = 0
        this.pickedIndex = index
        this.pickedValue = this.options[index]
        this.pickedLabel = this.getOptionLabel(index)
        this.offsetY = this.lineHeightPx * index * -1
        this.$emit('input', this.pickedValue)
      },
      selectDown(iteration) {
        if(typeof iteration === 'undefined') iteration = 1
        // go down is next in the list
        let newIndex = this.pickedIndex + iteration
        if (newIndex >= this.options.length) {
          if(this.jumpTopBottom) {
            while(newIndex >= this.options.length) {
              newIndex -= this.options.length
            }
          } else {
            newIndex = -1
          }
        }
        this.selectIndex(newIndex)
      },
      selectUp(iteration) {
        if(typeof iteration === 'undefined') iteration = 1
        // go up is previous in the list
        let newIndex = this.pickedIndex - iteration
        if (newIndex < 0) {
          if(this.jumpTopBottom) {
            while(newIndex < 0) {
              newIndex += this.options.length
            }
          } else {
            newIndex = 0
          }
        }
        this.selectIndex(newIndex)
      },
      reloadValue() {
        this.pickedValue = this.value
        this.pickedIndex = this.options.indexOf(this.pickedValue)
        this.pickedLabel = this.getOptionLabel(this.pickedIndex)
        //picked index is -1 if not found, force to 0
        if(this.pickedIndex < 0) this.pickedIndex = 0
      },
      getOptionFormValue(index) {
        const optionType = typeof this.options[index]
        if(optionType === 'string') {
          return this.options[index]
        } else if (optionType === 'object' && typeof this.options[index]['formValue'] !== 'undefined') {
          return this.options[index]['formValue']
        } else {
          return ''
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
          return ''
        }
      }
    },
    watch: {
      value: {
        handler: function (newVal, oldVal) {
          this.reloadValue()
        }
      }
    },
    created () {
      this.reloadValue()
    }
  }
</script>

<style lang="scss" scoped>

    .roller-picker-container {
        position: relative;
        display: flex;
        flex-wrap: nowrap;
        height: var(--rollerHeight);
        max-height: var(--rollerHeight);
        text-align: center;
        overflow: hidden;
        user-select: none;
    }
    .pick-selector {
        width: 100%;
        margin-top: calc(var(--overlayHeight) + var(--offsetY));
        transition: margin-top 0.3s;
        /*
        &.rolling {
            animation: rolling 2s linear infinite;
        }
        */
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
        height: var(--overlayHeight);
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
            top: var(--overlayHeight);
            height: var(--lineHeight);
            border-style: solid;
            border-width: 1px 0;
            border-color: lightgray;
        }
    }

    /*this overlay is used above everything else to detect mouse/touch events*/
    .overlay-global {
        position: absolute;
        width: 100%;
        z-index: 2;
        height: 100%;
        top: 0;
    }

/*
    @keyframes rolling {
        99% {
            transform: translateY(-100%);
        }
        100% {
            transform: translateY(0);
        }
    }
    */
</style>
