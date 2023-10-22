import './style.css'
import { createRoot } from 'react-dom/client'
import { app } from './App'

const container = document.getElementById('app')
const root = createRoot(container!)

root.render(app())
