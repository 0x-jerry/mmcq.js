import React, { useState } from 'react'
import { getPalette } from './lib'
import { Color } from './lib/Color'
import { getImageData } from './utils'
import { getImagePalette } from './assembly/rust'

interface MMCQResult {
  time: number
  colors: Color[]
}

function App() {
  const len = 8

  const [configs, setConfigs] = useState({
    len,
    image: 0.1,
    algorithm: 5,
  })

  const defaultResult: Record<string, MMCQResult> = {
    native: {
      time: 0,
      colors: Array(len)
        .fill(0)
        .map(() => new Color(255, 255, 255)),
    },
    webAssembly: {
      time: 0,
      colors: Array(len)
        .fill(0)
        .map(() => new Color(255, 255, 255)),
    },
  }

  const [result, setResult] = useState(defaultResult)

  const images = Array(6)
    .fill(0)
    .map((_, i) => `./images/${i + 1}.jpg`)

  async function handleImageClick(e: React.MouseEvent<HTMLImageElement>) {
    const target = e.target as HTMLImageElement
    const data = getImageData(target, configs.image)

    useNative(data)

    console.log('---------')

    await useWebAssembly(data)
  }

  function useNative(data: Uint8ClampedArray) {
    const time = Date.now()

    const colors = getPalette(data, configs.len, configs.algorithm)

    const endTime = Date.now()

    setResult((result) => ({
      ...result,
      native: {
        colors,
        time: endTime - time,
      },
    }))
  }

  async function useWebAssembly(data: Uint8ClampedArray) {
    const time = Date.now()

    const colors = await getImagePalette(data, configs.len, configs.algorithm)

    const endTime = Date.now()

    setResult((result) => ({
      ...result,
      webAssembly: {
        colors: colors.map((n) => Color.formHex(n)),
        time: endTime - time,
      },
    }))
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
        <span className="setting">
          algorithm complexity:
          <input
            type="range"
            style={{ width: '200px' }}
            value={configs.algorithm}
            min="3"
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
      </div>

      <div className="divider" />
      {Object.entries(result).map(([name, result]) => (
        <div className="colors" key={name}>
          {result.colors.map((color, i) => (
            <div className="color-box" key={`color${i}`}>
              <div className="color" style={{ backgroundColor: color.hex }} />
              <div className="desc title">{color.hex.toUpperCase()}</div>
            </div>
          ))}
          <div style={{ width: 100, flex: 1 }}>
            {name}: {result.time}
          </div>
        </div>
      ))}

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
