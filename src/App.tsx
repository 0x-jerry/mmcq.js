import React, { useState } from 'react'
import getPalette from './lib/core'
import { Color } from './lib/Color'
import './as/as.ts'
import { getImageData } from './lib/utils'
import { getImagePalette } from './as/as'

function App() {
  const len = 8

  const [colors, setColors] = useState(
    Array(len)
      .fill(0)
      .map(() => new Color(255, 255, 255)),
  )

  const [configs, setConfigs] = useState({
    len,
    algorithm: 1,
    image: 0.1,
    webAssembly: false,
  })

  const [spendTime, setSpendTime] = useState(0)

  const images = Array(6)
    .fill(0)
    .map((_, i) => `./images/${i + 1}.jpg`)

  function handleImageClick(e: React.MouseEvent<HTMLImageElement>) {
    const target = e.target as HTMLImageElement
    if (configs.webAssembly) {
      useWebAssembly(target)
    } else {
      getImagePalette1(target)
    }
  }

  function getImagePalette1(target: HTMLImageElement) {
    const time = new Date()

    const colors = getPalette(target, configs.len, {
      algorithm: configs.algorithm,
      image: configs.image,
    })

    const endTime = new Date()

    setColors(colors)
    setSpendTime(endTime.getTime() - time.getTime())
  }

  async function useWebAssembly(target: HTMLImageElement) {
    const time = new Date()

    const data = getImageData(target, configs.image)

    const colors =
      (await getImagePalette(data, configs.len, configs.algorithm)) || []

    const endTime = new Date()

    setColors(colors.map((n) => Color.formHex(n)))
    setSpendTime(endTime.getTime() - time.getTime())
  }

  function handleInputChanged(
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'image' | 'algorithm',
  ) {
    setConfigs({ ...configs, [type]: +e.target.value })
  }

  return (
    <div className="app">
      <h1 className="title">Img Color Palette Demo</h1>

      <div className="settings">
        <label className="setting">
          <input
            type="checkbox"
            onChange={() =>
              setConfigs({ ...configs, webAssembly: !configs.webAssembly })
            }
          ></input>
          web assembly
        </label>
        <span className="setting">
          algorithm complexity:
          <input
            type="range"
            style={{ width: '200px' }}
            value={configs.algorithm}
            min="1"
            max="8"
            onChange={(e) => handleInputChanged(e, 'algorithm')}
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
            onChange={(e) => handleInputChanged(e, 'image')}
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
        {images.map((p) => (
          <div className="img" key={p}>
            <img src={p} onClick={handleImageClick} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function app() {
  return <App />
}
