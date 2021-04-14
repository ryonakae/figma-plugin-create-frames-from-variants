import React, { useEffect, useRef } from 'react'
import Store from '@/app/Store'

const Options: React.FC = () => {
  const { isEditRealtime, setIsEditRealtime } = Store.useContainer()
  const isMounted = useRef(false)

  function setCurrentOptions(): void {
    console.log('setCurrentOptions')
    parent.postMessage(
      {
        pluginMessage: {
          type: 'setoptions',
          data: {
            isEditRealtime
          }
        }
      } as Message,
      '*'
    )
  }

  function onEditRealtimeClick(): void {
    console.log('onEditRealtimeClick')
    setIsEditRealtime(!isEditRealtime)
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

  useEffect(setCurrentOptions, [isEditRealtime])

  return (
    <div className="options">
      <div className="options-item" onClick={onEditRealtimeClick}>
        <div>Column Gap</div>
        <div>100</div>
      </div>
      <div className="options-item" onClick={onEditRealtimeClick}>
        <div>Row Gap</div>
        <div>100</div>
      </div>
      <div className="options-item" onClick={onEditRealtimeClick}>
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
      </div>
    </div>
  )
}

export default Options
