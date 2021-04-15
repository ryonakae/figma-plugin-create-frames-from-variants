import { useState, useEffect } from 'react'
import { createContainer } from 'unstated-next'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function Store() {
  const [framesColumnGap, setFramesColumnGap] = useState<number>(0)
  const [framesRowGap, setFramesRowGap] = useState<number>(0)
  const [isInclude, setIsInclude] = useState<boolean>(false)
  const [includeVariants, setIncludeVariants] = useState<string>('')
  const [isExclude, setIsExclude] = useState<boolean>(false)
  const [excludeVariants, setExcludeVariants] = useState<string>('')

  function updateOptions(options: Options): void {
    console.log('updateOptions', options)
    setFramesColumnGap(options.framesColumnGap)
    setFramesRowGap(options.framesRowGap)
    setIncludeVariants(options.includeVariants)
    setExcludeVariants(options.excludeVariants)
  }

  function listenPluginMessage(): void {
    onmessage = (msg): void => {
      const messageType: MessageType = msg.data.pluginMessage.type
      const pluginData: PluginMessage['data'] = msg.data.pluginMessage.data

      console.log('listenPluginMessage on Store', messageType, pluginData)

      switch (messageType) {
        case 'getoptionssuccess':
          updateOptions(pluginData)
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
    framesColumnGap,
    setFramesColumnGap,
    framesRowGap,
    setFramesRowGap,
    isInclude,
    setIsInclude,
    includeVariants,
    setIncludeVariants,
    isExclude,
    setIsExclude,
    excludeVariants,
    setExcludeVariants
  }
}

export default createContainer(Store)
