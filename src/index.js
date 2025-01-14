// Component imports
import RollerPicker from './components/RollerPicker.vue'
import './styles/common.scss'

// Default export for global usage
const install = (app) => {
  app.component('roller-picker', RollerPicker)
}
export default install

// Named export for specific usage
export { install, RollerPicker }
