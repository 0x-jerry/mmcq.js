import { h, Component } from 'preact'
import getPalette, { Color } from './lib/core'

interface IAppState {
  colors: Color[]
  configs: {
    len: number
    algorithm: number
    image: number
  }
  spendTime: number
}

export default class App extends Component<{}, IAppState> {
  constructor () {
    super()
    const len = 8

    this.state = {
      colors: Array(len)
        .fill(0)
        .map(() => new Color(255, 255, 255)),
      configs: {
        len,
        algorithm: 1,
        image: 0.1
      },
      spendTime: 0
    }
  }

  handleImageClick = (e: Event) => {
    const { configs } = this.state
    const time = new Date()

    const colors = getPalette(e.target as HTMLImageElement, configs.len, {
      algorithm: configs.algorithm,
      image: configs.image
    })

    const endTime = new Date()

    this.setState({
      colors,
      spendTime: endTime.getTime() - time.getTime()
    })
  }

  handleInputChanged = (e: Event, type: 'algorithm' | 'image') => {
    const { configs } = this.state

    configs[type] = +(e.target as HTMLInputElement).value

    this.setState({
      configs
    })
  }

  render () {
    const { colors, configs, spendTime } = this.state
    const images = Array(6)
      .fill(0)
      .map((_, i) => `static/images/${i + 1}.jpg`)

    return (
      <div className="app">
        <h1 className="title">Img Color Palette Demo</h1>

        <div className="settings">
          <span className="setting">
            algorithm complexity:
            <input
              type="range"
              style={{ width: '200px' }}
              value={configs.algorithm}
              min="1"
              max="8"
              onChange={e => this.handleInputChanged(e, 'algorithm')}
            />
            {configs.algorithm}
          </span>
          <span className="setting">
            image quality:
            <input
              type="range"
              style={{ width: '200px' }}
              value={configs.image}
              min="0.1"
              step="0.1"
              max="1"
              onChange={e => this.handleInputChanged(e, 'image')}
            />
            {configs.image.toFixed(1)}
          </span>
          <span className="setting">spend time: {spendTime} ms</span>
        </div>

        <div className="divider" />
        <div className="colors">
          {colors.map((color, i) => (
            <div className="color-box" key={`color${i}`}>
              <div className="color" style={{ backgroundColor: color.hex }} />
              <div className="desc title">{color.hex.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <div className="divider" />
        <div className="imgs">
          {images.map(p => (
            <div className="img">
              <img src={p} onClick={this.handleImageClick} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export function app () {
  return <App />
}
