import React, { useEffect, useRef } from 'react'
import Store from '@/app/Store'
import OptionNumberInput from '@/app/components/OptionNumberInput'
import OptionTextInput from '@/app/components/OptionTextInput'

const Options: React.FC = () => {
  const {
    framesColumnGap,
    setFramesColumnGap,
    framesRowGap,
    setFramesRowGap,
    includeVariants,
    setIncludeVariants,
    excludeVariants,
    setExcludeVariants
  } = Store.useContainer()

  function setCurrentOptions(): void {
    console.log('setCurrentOptions')
    parent.postMessage(
      {
        pluginMessage: {
          type: 'setoptions',
          data: {
            framesColumnGap,
            framesRowGap,
            includeVariants,
            excludeVariants
          }
        }
      } as Message,
      '*'
    )
  }

  function onFramesColumnGapChange(event: React.FormEvent<HTMLInputElement>): void {
    console.log('onFramesColumnGapChange')
    event.persist()
    setFramesColumnGap(Number(event.currentTarget.value))
  }

  function onFramesRowGapChange(event: React.FormEvent<HTMLInputElement>): void {
    console.log('onFramesRowGapChange')
    event.persist()
    setFramesRowGap(Number(event.currentTarget.value))
  }

  useEffect(() => {
    console.log('optios mounted')
    console.log('getoptions')
    parent.postMessage(
      {
        pluginMessage: {
          type: 'getoptions'
        }
      } as Message,
      '*'
    )
  }, [])

  useEffect(setCurrentOptions, [framesColumnGap, framesRowGap, includeVariants, excludeVariants])

  return (
    <div className="options">
      <OptionNumberInput
        title="Column Gap"
        value={framesColumnGap}
        onChange={onFramesColumnGapChange}
      />
      <OptionNumberInput title="Row Gap" value={framesRowGap} onChange={onFramesRowGapChange} />
      {/* <div className="options-item" onClick={onEditRealtimeClick}>
        <div>Display Frame Name</div>
        <div className={`segmentedControl is-${String(isEditRealtime)}`}>
          <div className="segmentedControl-segment">
            <img src={require('@/app/assets/img/icon_hyphen.svg').default} alt="" />
          </div>
          <div className="segmentedControl-segment">
            <img src={require('@/app/assets/img/icon_check.svg').default} alt="" />
          </div>
        </div>
      </div>
      <div className="options-item" onClick={onEditRealtimeClick}>
        <div>Frame Name Text Size</div>
        <div>24</div>
      </div>
      <div className="options-item" onClick={onEditRealtimeClick}>
        <div>Hoge</div>
        <div className={`segmentedControl is-${String(isEditRealtime)}`}>
          <div className="segmentedControl-segment">
            <img src={require('@/app/assets/img/icon_hyphen.svg').default} alt="" />
          </div>
          <div className="segmentedControl-segment">
            <img src={require('@/app/assets/img/icon_check.svg').default} alt="" />
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default Options
