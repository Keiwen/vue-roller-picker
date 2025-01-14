<script setup>
import { ref, computed, watch, onMounted, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {},
  options: { type: Array, required: true, default: () => [] },
  bigRoller: { type: Boolean, default: false },
  infinite: { type: Boolean, default: false },
  jumpTopBottom: { type: Boolean, default: false },
  lineHeightPx: { type: Number, default: 40 },
  fontSize: { type: String, default: 'inherit' },
  animated: { type: Boolean, default: true },
  rolling: { type: Boolean, default: false },
  rollingEndClass: { type: String, default: 'rollend' },
  formName: { type: String, default: 'rollerPicker' },
  rollAnimationOnUpdate: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false }
})

const pickedValue = ref({})
const rollerPicker = ref(null)
const pickedLabel = ref('')
const pickedIndex = ref(0)
const startScrollY = ref(0) // when scrolling, Y initial position on client (if > 0, scrolling ongoing)
const startScrollOffsetY = ref(0) // when scrolling, Y initial offset
const offsetY = ref(0) // current offset from top
const rollerOptions = ref([])
const fakeIndexOffset = ref(0)
const fakeOptionMoving = ref(0)
const rollingClass = ref('')
const ignoreNextValueChange = ref(false)

const emit = defineEmits(['update:modelValue'])

// computed
const linkTopBottom = computed(() => { return props.jumpTopBottom || props.infinite })
const optionFormValue = computed(() => { return getOptionFormValue(pickedValue.value) })
const pickSelectorCssClasses = computed(() => {
  const cssClasses = [rollingClass.value]
  if (fakeOptionMoving.value === 0 && props.animated) cssClasses.push('animated')
  return cssClasses
})

onMounted(() => {
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('wheel', onScroll)
  // touch events
  window.addEventListener('touchstart', onRollStart)
  window.addEventListener('touchmove', onRollMove)
  window.addEventListener('touchend', onRollEnd)
  window.addEventListener('touchcancel', onRollCancel)
  // mouse events
  window.addEventListener('mousedown', onRollStart)
  window.addEventListener('mousemove', onRollMove)
  window.addEventListener('mouseup', onRollEnd)
  window.addEventListener('mouseout', onRollCancel)

  pickedValue.value = props.modelValue
  reloadValue()
  reloadOptions()
})

watch(() => props.modelValue, (newValue, oldValue) => {
  if (ignoreNextValueChange.value) {
    // does not update if selectIndex method is causing this change
    ignoreNextValueChange.value = false
  } else {
    if (props.infinite && props.rollAnimationOnUpdate > 0) {
      startRoll()
    }
    reloadValue()
    reloadOptions()
    if (props.infinite && props.rollAnimationOnUpdate > 0) {
      setTimeout(() => { endRoll() }, props.rollAnimationOnUpdate)
    }
  }
})
watch(() => props.options, (newValue, oldValue) => {
  reloadOptions()
})
watch(() => props.infinite, (newValue, oldValue) => {
  reloadValue()
  reloadOptions()
})
watch(() => props.rolling, (newValue, oldValue) => {
  if (!props.infinite) return
  if (newValue) {
    startRoll()
  } else {
    endRoll()
  }
})

// methods
const isSelectorFocused = (event) => {
  return document.activeElement === rollerPicker.value
}
const startRoll = () => {
  rollingClass.value = 'rolling'
}
const endRoll = () => {
  rollingClass.value = props.rollingEndClass
}
const onKeyUp = (event) => {
  if (props.disabled) return
  if (isSelectorFocused()) {
    if (event.keyCode === 33 || event.keyCode === 38) { // page up || up arrow
      selectUp()
      event.preventDefault()
    }

    if (event.keyCode === 34 || event.keyCode === 40) { // page down || down arrow
      selectDown()
      event.preventDefault()
    }

    if (event.keyCode === 36) { // home button
      selectIndex(0)
      event.preventDefault()
    }

    if (event.keyCode === 35) { // end button
      selectIndex(-1)
      event.preventDefault()
    }
  }
}
const onScroll = (event) => {
  if (props.disabled) return
  // only if element is under roller picker
  if (event.srcElement.parentElement === rollerPicker.value) {
    if (event.deltaY > 0) {
      selectDown()
    } else {
      selectUp()
    }
  }
}
const onRollStart = (event) => {
  if (props.disabled) return
  // only if element is under roller picker
  if (event.srcElement.parentElement === rollerPicker.value) {
    // store Y initial position when starting scroll
    // scroll position: clientY for mouse event, changedTouches[0].clientY for touch event
    startScrollY.value = event.clientY ? event.clientY : event.changedTouches[0].clientY
    // store Y initial offset when starting scroll
    startScrollOffsetY.value = offsetY.value
    event.preventDefault()
  }
}
const onRollMove = (event) => {
  if (props.disabled) return
  // only if element is under roller picker & if we start scrolling
  if (event.srcElement.parentElement === rollerPicker.value && startScrollY.value) {
    const newScrollY = event.clientY ? event.clientY : event.changedTouches[0].clientY
    // diff between initial scroll position and current scroll position
    const diffY = newScrollY - startScrollY.value
    // update global offset with initial offset + current diff
    offsetY.value = startScrollOffsetY.value + diffY
    event.preventDefault()
  }
}
const onRollEnd = (event) => {
  if (props.disabled) return
  // only if element is under roller picker & if we start scrolling
  if (event.srcElement.parentElement === rollerPicker.value && startScrollY.value) {
    // scroll position stored on move, now just need to re-init initial scroll position
    startScrollY.value = 0
    let nearestIndex = Math.round(offsetY.value / props.lineHeightPx) * -1
    if (props.infinite) {
      nearestIndex -= fakeIndexOffset.value
    }
    if (nearestIndex >= props.options.length && !linkTopBottom.value) {
      nearestIndex = props.options.length - 1
    }
    if (nearestIndex < 0 && !linkTopBottom.value) {
      nearestIndex = 0
    }
    selectIndex(nearestIndex)
    event.preventDefault()
  }
}
const onRollCancel = (event) => {
  if (props.disabled) return
  if (event.srcElement.parentElement === rollerPicker.value && startScrollY.value) {
    startScrollY.value = 0
    // cancel generated offset
    offsetY.value = startScrollOffsetY.value
    event.preventDefault()
  }
}
const selectDown = (iteration) => {
  if (props.disabled) return
  if (typeof iteration === 'undefined') iteration = 1
  // go down is next in the list
  let newIndex = pickedIndex.value + iteration
  if (newIndex >= props.options.length && !linkTopBottom.value) {
    newIndex = props.options.length - 1
  }
  selectIndex(newIndex)
}
const selectUp = (iteration) => {
  if (props.disabled) return
  if (typeof iteration === 'undefined') iteration = 1
  // go up is previous in the list
  let newIndex = pickedIndex.value - iteration
  if (newIndex < 0 && !linkTopBottom.value) {
    newIndex = 0
  }
  selectIndex(newIndex)
}
const selectIndex = (index) => {
  if (props.disabled || !props.options.length) return
  if (props.infinite) {
    offsetY.value = props.lineHeightPx * (index + fakeIndexOffset.value) * -1
    // roll first, then reload options
    setTimeout(() => {
      fakeOptionMoving.value++
      // reload only if move done
      if (fakeOptionMoving.value === 1) reloadOptions()
      setTimeout(() => {
        // wait a bit before ending the move
        fakeOptionMoving.value--
      }, 100)
    }, 500)
  } else {
    index = recenterIndex(index)
    offsetY.value = props.lineHeightPx * index * -1
  }

  pickedIndex.value = index
  index = recenterIndex(index)
  // be sure to get real index option
  pickedValue.value = props.options[index]
  pickedLabel.value = getOptionLabel(pickedValue.value)
  ignoreNextValueChange.value = true
  emit('update:modelValue', pickedValue.value)
}
const reloadValue = () => {
  pickedValue.value = props.modelValue
  pickedIndex.value = props.options.indexOf(pickedValue.value)
  pickedLabel.value = getOptionLabel(pickedValue.value)
  // picked index is -1 if not found, force to 0
  if (pickedIndex.value < 0) pickedIndex.value = 0
  offsetY.value = props.lineHeightPx * pickedIndex.value * -1
}
const reloadOptions = () => {
  if (!props.options.length) throw new Error('Roller-picker: no option defined. Prop \'options\' is missing or empty')
  if (props.infinite) {
    // generate fake options around the picked value
    const fakeElementCount = 15
    pickedIndex.value = recenterIndex(pickedIndex.value)
    const fakeOptions = [props.options[pickedIndex.value]]
    for (let i = 1; i <= fakeElementCount; i++) {
      // fake elements before and after to scroll quietly
      // starting for picked index, get option up and down and concat to fake list
      let topIndex = pickedIndex.value + i
      let bottomIndex = pickedIndex.value - i
      topIndex = recenterIndex(topIndex)
      bottomIndex = recenterIndex(bottomIndex)
      fakeOptions.push(props.options[topIndex])
      fakeOptions.unshift(props.options[bottomIndex])
    }
    rollerOptions.value = fakeOptions
    fakeIndexOffset.value = fakeElementCount - pickedIndex.value
    offsetY.value = props.lineHeightPx * fakeElementCount * -1
  } else {
    rollerOptions.value = props.options
    fakeIndexOffset.value = 0
  }
}
const getOptionFormValue = (option) => {
  const optionType = typeof option
  if (optionType === 'string') {
    return option
  } else if (optionType === 'object' && typeof option.formValue !== 'undefined') {
    return option.formValue
  } else {
    return ''
  }
}
const getOptionLabel = (option) => {
  const optionType = typeof option
  if (optionType === 'string') {
    return option
  } else if (optionType === 'object' && typeof option.label !== 'undefined') {
    return option.label
  } else {
    return ''
  }
}
const recenterIndex = (index) => {
  while (index < 0) {
    index += props.options.length
  }
  while (index >= props.options.length) {
    index -= props.options.length
  }
  return index
}
</script>

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
    <div class="pick-selector" :class="pickSelectorCssClasses" v-if="rollerOptions.length">
      <div v-for="(option, i) in rollerOptions" :key="'option-' + i" class="pick-option" :class="(option === pickedValue) ? 'pick-option-active' : ''">
        <slot name="option" :option="option" :index="recenterIndex(i - fakeIndexOffset)">
          <div>{{ getOptionLabel(option) }}</div>
        </slot>
      </div>
    </div>
    <div class="overlay overlay-top"></div>
    <div class="overlay overlay-middle"></div>
    <div class="overlay overlay-bottom"></div>
    <div class="overlay-global"></div>
    <input type="hidden" :name="formName" :value="optionFormValue" />
  </div>
</template>

<style lang="scss">

</style>
