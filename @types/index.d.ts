type MessageType =
  | 'resize'
  | 'getoptions'
  | 'getoptionssuccess'
  | 'setoptions'
  | 'setoptionssuccess'
  | 'closeplugin'
  | 'generate'

type PluginMessage = {
  type: MessageType
  data?: any
}

type Message = {
  pluginMessage: PluginMessage
}

type Options = {
  framesColumnGap: number
  framesRowGap: number
  isInclude: boolean
  includeVariants: string
  isExclude: boolean
  excludeVariants: string
}

type Variant = {
  index: number
  component: ComponentNode
  variantsName: string
}

type VariantsData = Variant[][]

type FrameData = {
  key: string
  // row: number
  variants: Variant[]
  firstVariantsIndex: number
}

type GroupedFramesData = {
  [row: string]: FrameData[]
}
