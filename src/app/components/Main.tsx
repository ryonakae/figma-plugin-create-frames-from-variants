import React from 'react'
import Options from '@/app/components/Options'

const Main: React.FC = () => {
  const onGenerateClick = (): void => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'generate'
        }
      } as Message,
      '*'
    )
  }

  return (
    <>
      <Options />
      <div className="button is-active" style={{ marginTop: '20px' }} onClick={onGenerateClick}>
        Generate Frames
      </div>
    </>
  )
}

export default Main
