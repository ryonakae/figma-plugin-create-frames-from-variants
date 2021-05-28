import React, { useEffect, useRef, useState } from 'react'
import Store from '@/app/Store'
import NumberInput from '@/app/components/NumberInput'
import TextInput from '@/app/components/TextInput'
import { RadioGroup, Radio } from 'react-radio-group'

type IncludeOrExclude = 'include' | 'exclude' | 'notSelected'

const Main: React.FC = () => {
  const [includeOrExclude, setIsIncludeOrExclude] = useState<IncludeOrExclude>('notSelected')

  const {
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

  function onGenerateClick(): void {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'generate'
        }
      } as Message,
      '*'
    )
  }

  function onRadioChange(value: IncludeOrExclude): void {
    setIsIncludeOrExclude(() => value)
    if (value === 'include') {
      setIsInclude(true)
      setIsExclude(false)
    } else if (value === 'exclude') {
      setIsInclude(false)
      setIsExclude(true)
    }
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

  useEffect(setCurrentOptions, [
    framesColumnGap,
    framesRowGap,
    isInclude,
    isExclude,
    includeVariants,
    excludeVariants
  ])

  return (
    <>
      <NumberInput title="Column Gap" value={framesColumnGap} onChange={onFramesColumnGapChange} />
      <NumberInput title="Row Gap" value={framesRowGap} onChange={onFramesRowGapChange} />

      <RadioGroup name="fruit" selectedValue={includeOrExclude} onChange={onRadioChange}>
        <Radio value="include" />
        Include
        <Radio value="exclude" />
        Exclude
      </RadioGroup>

      <div className="button is-active" style={{ marginTop: '20px' }} onClick={onGenerateClick}>
        Generate Frames
      </div>
    </>
  )
}

export default Main
