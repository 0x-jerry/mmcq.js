import './style.css'
import { render } from 'react-dom'
import { app } from './App'
// preload wasm
import '../core/rust'

render(app(), document.getElementById('app')!)
