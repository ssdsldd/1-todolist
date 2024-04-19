import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import Button from '@mui/material/Button';
import s from './AddForm.module.css';
import TextField from '@mui/material/TextField';

export type AddFormPropsType = {
    callback: (title: string) => void
    disabled?: boolean
}

export const AddForm = React.memo(({ callback, disabled}: AddFormPropsType) => {
    console.log('AddForm render')

    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState<boolean>(false)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)
    const onInputClickHandler = () => {
        if (inputValue.trim() !== '') {
            callback(inputValue.trim());
            setInputValue('')
            setError(false)
        } else {
            setError(true)
        }
    }
    const onKeyUpHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onInputClickHandler()
        }
    }

    return (
        <div className={s.addForm}>
            <TextField  label={error ? 'Title is required...' : 'Title'}
                        variant="standard" 
                        value={inputValue}
                        onChange={onChangeHandler}
                        onKeyUp={onKeyUpHandler}
                        error = {!!error}
                        />
            <Button variant="text" onClick={onInputClickHandler} disabled = {disabled}>+</Button>
        </div>
    )
})
