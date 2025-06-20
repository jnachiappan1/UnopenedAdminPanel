// ** CleaveJS Imports
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'

export function CleaveNumberInput(props) {
  const { inputRef, prefix, ...rest } = props

  return (
    <Cleave
      ref={inputRef}
      options={{
        ...(prefix && { prefix: prefix }),
        numeral: true,
        numeralThousandsGroupStyle: 'thousand',
        numeralDecimalScale: 4,
        numeralPositiveOnly: true
      }}
      {...rest}
      onChange={e => rest.onChange(e, (e.target.rawValue || '').replace(prefix || '', '').replace(',', ''))}
    />
  )
}

export function CleaveNoDecimalNumberInput(props) {
  const { inputRef, prefix, ...rest } = props

  return (
    <Cleave
      ref={inputRef}
      options={{
        ...(prefix && { prefix: prefix }),
        numeral: true,
        numeralDecimalScale: 0,
        numeralPositiveOnly: true
      }}
      {...rest}
      onChange={e => rest.onChange(e, (e.target.rawValue || '').replace(prefix || '', '').replace(',', ''))}
    />
  )
}
