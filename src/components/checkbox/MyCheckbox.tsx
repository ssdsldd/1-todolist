import { Checkbox } from '@mui/material'
import { ChangeEvent} from 'react'

type CheckboxPropsType = {
    checked: boolean,
    onChange: (value: boolean) => void
}

export default function MyCheckbox(props: CheckboxPropsType) {

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        props.onChange(e.currentTarget.checked)
    }

    return (
        <Checkbox checked={props.checked} onChange={onChangeHandler} size="small" />
    )
}
