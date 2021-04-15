import React, { useEffect, useRef } from 'react'
import Store from '@/app/Store'

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
  const isMounted = useRef(false)

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
    if (!isMounted.current) {
      isMounted.current = true
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
    }
  }, [])

  useEffect(setCurrentOptions, [framesColumnGap, framesRowGap, includeVariants, excludeVariants])

  return (
    <div className="options">
      <div className="options-item">
        <div>Column Gap</div>
        <input type="number" value={framesColumnGap} onChange={onFramesColumnGapChange} />
      </div>
      <div className="options-item">
        <div>Row Gap</div>
        <input type="number" value={framesRowGap} onChange={onFramesRowGapChange} />
      </div>
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
