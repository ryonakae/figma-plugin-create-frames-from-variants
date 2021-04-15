import React, { useEffect, useRef } from 'react'

type InputProps = JSX.IntrinsicElements['input']
type Props = InputProps & {
  title: string
}

const OptionTextInput: React.FC<Props> = props => {
  return (
    <div className="options-item">
      <div>{props.title}</div>
      <input type="text" value={props.value} onChange={props.onChange} />
    </div>
  )
}

export default OptionTextInput
