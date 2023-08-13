import TextField from '@mui/material/TextField'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { Autocomplete, CircularProgress } from '@mui/material'
import { apiGet } from '../../util/api-fetch'
import throttle from 'lodash.throttle'

interface IProps {
  url: string
  apiFieldKey: string
  onChange: (value: any) => any
  labelFieldKey: string
  valueFieldKey: string
  defaultValue: any
  disabled?: boolean
  limit?: number
}

export default function CustomAutocomplete(props: IProps) {
  const { url, onChange, apiFieldKey, valueFieldKey, labelFieldKey, defaultValue, disabled, limit = 10 } = props

  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [options, setOptions] = useState<Array<Record<string, any>>>([])
  const [value, setValue] = useState<string>(defaultValue || '')
  const [inputValue, setInputValue] = useState<string>('')

  console.log({ options, value })

  const fetch = useMemo(
    () =>
      throttle(async (req: Record<string, any>) => {
        if (!disabled) {
          setLoading(true)
          const res = await apiGet(url, { [apiFieldKey]: req.input, limit })

          setOptions(res?.data?.data)
          setLoading(false)
        }
      }, 1000),
    []
  )

  useEffect(() => {
    fetch({ input: inputValue })
  }, [value, inputValue, fetch])

  return (
    <Autocomplete
      open={open}
      options={options}
      loading={loading}
      value={(value as any) || null}
      defaultValue={(value as any) || null}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionLabel={option => option[labelFieldKey] || ''}
      disabled={disabled}
      isOptionEqualToValue={(option, value) => {
        if (typeof value === 'string') return option[valueFieldKey] === value

        return option[valueFieldKey] === value[valueFieldKey]
      }}
      onChange={(event, newValue) => {
        setValue(newValue)
        onChange(newValue?.[valueFieldKey])
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      renderInput={params => (
        <TextField
          {...params}
          variant={'standard'}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </Fragment>
            )
          }}
        />
      )}
    />
  )
}
