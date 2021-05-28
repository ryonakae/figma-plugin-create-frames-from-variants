import React, { useEffect, useRef } from 'react'

type InputProps = JSX.IntrinsicElements['input']
type Props = InputProps & {
  title: string
}

const OptionNumberInput: React.FC<Props> = props => {
  return (
    <div className="options-item">
      <div>{props.title}</div>
      <input type="number" value={props.value} onChange={props.onChange} />
    </div>
  )
}

export default OptionNumberInput
