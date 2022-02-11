import React from 'react'
import {Input as AntInput} from 'antd'
import { IInput } from '../../models'

const Input = ({type}: IInput)=> {
  return (
    <AntInput type={type}/>
  )
}

export default Input
