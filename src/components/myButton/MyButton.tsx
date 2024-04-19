import { Button } from '@mui/material'
import React, { MouseEvent } from 'react'

type MyButtonPropsType = {
    name: string
    variant: 'text' | 'outlined' | 'contained'
    dataFilter?: string
    callback: (e: MouseEvent<HTMLButtonElement>) => void
}

export const MyButton = React.memo((props: MyButtonPropsType) => {
    const {name, variant, dataFilter, callback} = props
    console.log('button render')
    return (
        <Button variant={variant} data-filter={dataFilter} onClick={callback}>{name}</Button>
    )
})
