import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import TextField from '@mui/material/TextField';
import s from './EditableSpan.module.css'

export type EditableSpanPropsType = {
    globalTitle: string
    callback: (title: string) => void
    disabled?: boolean
}

export const EditableSpan = React.memo(({globalTitle, callback, disabled}: EditableSpanPropsType) => {

    console.log('Span render')

    const [isActivate, setIsActivate] = useState<boolean>(false)
    const [localTitle, setLocalTitle] = useState<string>(globalTitle)

    const onChangeLocalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setLocalTitle(e.currentTarget.value)
    }

    const changeActivateMode = () => {
        setIsActivate(!isActivate)
        if (isActivate){
            callback(localTitle)
        }
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLDivElement>) => {
        if(e.key === 'Enter'){
            changeActivateMode()
        }
    }

    return (
        isActivate && !disabled
            ? <TextField variant="outlined" value={localTitle} onChange={onChangeLocalTitle} onBlur={changeActivateMode} autoFocus className={s.input} onKeyUp={onKeyPressHandler}/>
            : <span onDoubleClick={changeActivateMode}>{globalTitle}</span>
    )
})