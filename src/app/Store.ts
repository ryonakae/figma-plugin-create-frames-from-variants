import { useState, useEffect } from 'react'
import { createContainer } from 'unstated-next'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function Store() {
  const [isTextAreaDisabled, setIsTextAreaDisabled] = useState<boolean>(true)
  const [isEditRealtime, setIsEditRealtime] = useState<boolean>(true)

  function updateOptions(options: Options): void {
    console.log('updateOptions', options)
    setIsEditRealtime(options.isEditRealtime)
  }

  function listenPluginMessage(): void {
    onmessage = (msg): void => {
      const messageType: MessageType = msg.data.pluginMessage.type
      const pluginData: PluginMessage['data'] = msg.data.pluginMessage.data

      switch (messageType) {
        case 'getoptionssuccess':
          updateOptions({
            isEditRealtime: pluginData.isEditRealtime
          })
          break
        default:
          break
      }
    }
  }

  useEffect(() => {
    listenPluginMessage()
  }, [])

  return {
    isTextAreaDisabled,
    isEditRealtime,
    setIsTextAreaDisabled,
    setIsEditRealtime
  }
}

export default createContainer(Store)
