import _ from 'lodash'
import Util from '@/app/Util'

const UI_WIDTH = 300
const UI_MIN_HEIGHT = 300
const UI_MAX_HEIGHT = 450

class Controller {
  resizeUI(height: number): void {
    let _height = height
    if (height < UI_MIN_HEIGHT) {
      _height = UI_MIN_HEIGHT
    }
    if (height > UI_MAX_HEIGHT) {
      _height = UI_MAX_HEIGHT
    }

    figma.ui.resize(UI_WIDTH, _height)
  }

  getOptions(): void {
    const data: Options = {
      framesColumnGap: Number(figma.root.getPluginData('framesColumnGap')),
      framesRowGap: Number(figma.root.getPluginData('framesRowGap')),
      isInclude: Util.toBoolean(figma.root.getPluginData('isInclude')),
      includeVariants: figma.root.getPluginData('includeVariants'),
      isExclude: Util.toBoolean(figma.root.getPluginData('isExclude')),
      excludeVariants: figma.root.getPluginData('excludeVariants')
    }

    figma.ui.postMessage({
      type: 'getoptionssuccess',
      data
    } as PluginMessage)

    console.log('getOptions success', data)
  }

  setOptions(options: Options): void {
    figma.root.setPluginData('framesColumnGap', String(options.framesColumnGap))
    figma.root.setPluginData('framesRowGap', String(options.framesRowGap))
    figma.root.setPluginData('isInclude', String(options.isInclude))
    figma.root.setPluginData('includeVariants', String(options.includeVariants))
    figma.root.setPluginData('isExclude', String(options.isExclude))
    figma.root.setPluginData('excludeVariants', String(options.excludeVariants))

    figma.ui.postMessage({
      type: 'setoptionssuccess'
    } as PluginMessage)

    console.log('setOptions success')
  }

  expand(arr: []): [] {
    const expandedArr = []
    const len = arr.length
    const ps = new Array(len).fill(0)
    let end = false
    while (!end) {
      const elem = []
      for (let i = 0; i < len; ++i) {
        elem.push(arr[i][ps[i]])
      }
      expandedArr.push(elem as never)
      for (let i = 0; i < len; ++i) {
        if (++ps[i] < (arr[i] as any).length) {
          break
        } else {
          if (i >= len - 1) {
            end = true
          }
          ps[i] = 0
        }
      }
    }
    return expandedArr as []
  }

  generate(): void {
    console.log('generate')

    // variables
    const variantsData: VariantsData = []
    const generatedFrames: FrameNode[] = []
    const FRAMES_COLUMN_GAP = 100
    const FRAMES_ROW_GAP = 100

    // get selections
    const selections = figma.currentPage.selection

    // error handling
    if (selections.length === 0) {
      figma.notify('No Selected Frame')
      return
    } else if (selections.length > 1) {
      figma.notify('Please Select Only One Frame')
      return
    } else if (selections[0].type !== 'FRAME') {
      figma.notify('Please Select Frame')
      return
    }

    // define frame
    const frame = selections[0] as FrameNode

    // get instance in frame
    const instances = frame.findChildren(node => node.type === 'INSTANCE') as InstanceNode[]

    // error handling
    if (!instances) {
      figma.notify('No Component Instance in This Frame')
      return
    }

    // generate variantsData from instances
    instances.map((instance, i) => {
      const masterComponent = instance.masterComponent
      const variants = masterComponent.parent

      if (variants && variants.type === ('COMPONENT_SET' as any)) {
        const variantsArray: Variant[] = []

        variants.children.map((variant, j) => {
          console.log(variant.name)
          variantsArray.push({
            index: j,
            component: variant as ComponentNode,
            variantsName: variants.name
          })
        })

        variantsData.push(variantsArray)
      }
    })

    console.log('set variantsData', variantsData)

    // error handling
    if (!variantsData.length) {
      figma.notify('No Variants in This Frame')
      return
    }

    // get expanded variantsData
    const expandedVariantsData: VariantsData = this.expand(variantsData as any)
    console.log('expandedVariantsData', expandedVariantsData)

    // get framesData from expandedVariantsData
    let framesData: FrameData[] = []
    const columns = expandedVariantsData.length / variantsData.length
    console.log('columns', columns)

    expandedVariantsData.map((variants, index) => {
      let key = ''

      variants.map(variant => {
        key += String(variant.index)
      })

      framesData.push({
        key,
        variants,
        firstVariantsIndex: variants[0].index
      })
    })

    // sort framesData by key
    framesData = _.orderBy(framesData, ['key'], ['asc'])
    console.log('set framesData', framesData)

    // grouping framesData by firstVariantsIndex
    const groupedFramesData = _.groupBy(framesData, 'firstVariantsIndex') as GroupedFramesData
    console.log('groupedFramesData', groupedFramesData)

    // generate frames by groupedFramesData
    _.forEach(groupedFramesData, (framesData, row) => {
      // set lastFramePosition
      const lastFramePosition = {
        x: 0,
        y: (frame.height + FRAMES_ROW_GAP) * Number(row)
      }

      framesData.map(frameData => {
        const copiedFrame = frame.clone()
        const variantsNameArray: string[] = []

        const instances = copiedFrame.findChildren(
          node => node.type === 'INSTANCE'
        ) as InstanceNode[]
        instances.map((instance, index) => {
          instance.masterComponent = frameData.variants[index].component
          variantsNameArray.push(frameData.variants[index].component.name)
        })

        // set copied frame properties
        copiedFrame.x = lastFramePosition.x + frame.width + FRAMES_COLUMN_GAP
        copiedFrame.y = lastFramePosition.y
        copiedFrame.name = `${frame.name} / ${variantsNameArray.join(',')}`

        // update lastFramePosition
        lastFramePosition.x = copiedFrame.x

        generatedFrames.push(copiedFrame)
      })
    })

    // group frames
    const group = figma.group(generatedFrames, frame.parent || figma.currentPage)
    group.name = 'Generated Frames'
    group.x = frame.x + frame.width + FRAMES_COLUMN_GAP * 3
    group.y = frame.y

    // select generated group
    figma.currentPage.selection = [group]

    // done
    figma.notify(`Generated ${generatedFrames.length} Frames from ${frame.name}`)
  }
}

function bootstrap(): void {
  const contoller = new Controller()

  figma.showUI(__html__, { width: UI_WIDTH, height: UI_MIN_HEIGHT })

  figma.ui.onmessage = (msg: PluginMessage): void => {
    console.log('figma.ui.onmessage', msg)

    switch (msg.type) {
      case 'resize':
        contoller.resizeUI(msg.data.height)
        break
      case 'getoptions':
        contoller.getOptions()
        break
      case 'setoptions':
        contoller.setOptions(msg.data)
        break
      case 'generate':
        contoller.generate()
        break
      case 'closeplugin':
        figma.closePlugin()
        break
      default:
        break
    }
  }
}

bootstrap()
