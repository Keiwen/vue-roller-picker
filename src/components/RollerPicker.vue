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
        <div class="pick-selector" :class="{'animated': fakeOptionMoving === 0 && animated}">
            <div v-for="(option, i) in rollerOptions" :key="'option-' + i" class="pick-option" :class="(option === pickedValue) ? 'pick-option-active' : ''">
                <slot name="option" :option="option" :index="recenterIndex(i - fakeIndexOffset)">
                    <div>{{getOptionLabel(option)}}</div>
                </slot>
            </div>
        </div>
        <div class="overlay overlay-top"></div>
        <div class="overlay overlay-middle"></div>
        <div class="overlay overlay-bottom"></div>
        <div class="overlay-global"></div>
        <input type="hidden" :name="formName" :value="getOptionFormValue(pickedValue)" />
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
      infinite: {
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
      animated: {
        default: true,
        type: Boolean
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
        offsetY: 0, //current offset from top
        rollerOptions: [],
        fakeIndexOffset: 0,
        fakeOptionMoving: 0,
        ignoreNextValueChange: false
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
    computed: {
      linkTopBottom () {
        return this.jumpTopBottom || this.infinite
      }
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
          if (this.infinite) {
            nearestIndex -= this.fakeIndexOffset
          }
          if (nearestIndex >= this.options.length && !this.linkTopBottom) {
            nearestIndex = this.options.length - 1
          }
          if (nearestIndex < 0 && !this.linkTopBottom) {
            nearestIndex = 0
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
        if (this.infinite) {
          this.offsetY = this.lineHeightPx * (index + this.fakeIndexOffset) * -1
          //roll first, then reload options
          setTimeout(() => {
            this.fakeOptionMoving++
            //reload only if move done
            if (this.fakeOptionMoving === 1) this.reloadOptions()
            setTimeout(() => {
              //wait a bit before ending the move
              this.fakeOptionMoving--
            }, 100)
          }, 500)
        } else {
          index = this.recenterIndex(index)
          this.offsetY = this.lineHeightPx * index * -1
        }

        this.pickedIndex = index
        index = this.recenterIndex(index)
        //be sure to get real index option
        this.pickedValue = this.options[index]
        this.pickedLabel = this.getOptionLabel(this.pickedValue)
        this.ignoreNextValueChange = true
        this.$emit('input', this.pickedValue)
      },
      selectDown(iteration) {
        if(typeof iteration === 'undefined') iteration = 1
        // go down is next in the list
        let newIndex = this.pickedIndex + iteration
        if (newIndex >= this.options.length && !this.linkTopBottom) {
          newIndex = this.options.length - 1
        }
        this.selectIndex(newIndex)
      },
      selectUp(iteration) {
        if(typeof iteration === 'undefined') iteration = 1
        // go up is previous in the list
        let newIndex = this.pickedIndex - iteration
        if (newIndex < 0 && !this.linkTopBottom) {
          newIndex = 0
        }
        this.selectIndex(newIndex)
      },
      reloadValue() {
        this.pickedValue = this.value
        this.pickedIndex = this.options.indexOf(this.pickedValue)
        this.pickedLabel = this.getOptionLabel(this.pickedValue)
        //picked index is -1 if not found, force to 0
        if(this.pickedIndex < 0) this.pickedIndex = 0
        this.offsetY = this.lineHeightPx * this.pickedIndex * -1
      },
      reloadOptions() {
        if (this.infinite) {
          // generate fake options around the picked value
          const fakeElementCount = 15
          this.pickedIndex = this.recenterIndex(this.pickedIndex)
          let fakeOptions = [this.options[this.pickedIndex]]
          for (let i = 1; i <= fakeElementCount; i++) {
            // fake elements before and after to scroll quietly
            // starting for picked index, get option up and down and concat to fake list
            let topIndex = this.pickedIndex + i
            let bottomIndex = this.pickedIndex - i
            topIndex = this.recenterIndex(topIndex)
            bottomIndex = this.recenterIndex(bottomIndex)
            fakeOptions.push(this.options[topIndex])
            fakeOptions.unshift(this.options[bottomIndex])
          }
          this.rollerOptions = fakeOptions
          this.fakeIndexOffset = fakeElementCount - this.pickedIndex
          this.offsetY = this.lineHeightPx * fakeElementCount * -1
        } else {
          this.rollerOptions = this.options
          this.fakeIndexOffset = 0
        }
      },
      getOptionFormValue(option) {
        const optionType = typeof option
        if(optionType === 'string') {
          return option
        } else if (optionType === 'object' && typeof option['formValue'] !== 'undefined') {
          return option['formValue']
        } else {
          return ''
        }
      },
      getOptionLabel(option) {
        const optionType = typeof option
        if(optionType === 'string') {
          return option
        } else if (optionType === 'object' && typeof option['label'] !== 'undefined') {
          return option['label']
        } else {
          return ''
        }
      },
      recenterIndex(index) {
        while (index < 0) {
          index += this.options.length
        }
        while (index >= this.options.length) {
          index -= this.options.length
        }
        return index
      },
    },
    watch: {
      value: {
        handler: function (newVal, oldVal) {
          if (this.ignoreNextValueChange) {
            // does not update if selectIndex method is causing this change
            this.ignoreNextValueChange = false
          } else {
            this.reloadValue()
            this.reloadOptions()
          }
        }
      },
      options: {
        handler: function (newVal, oldVal) {
          this.reloadOptions()
        }
      },
      infinite: {
        handler: function (newVal, oldVal) {
          this.reloadValue()
          this.reloadOptions()
        }
      }
    },
    created () {
      this.reloadValue()
      this.reloadOptions()
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
        /*
        &.rolling {
            animation: rolling 2s linear infinite;
        }
        */
        &.animated {
            transition: margin-top 0.3s;
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
