import {NextPage} from 'next'
import { Button } from 'antd'
import 'antd/dist/antd.variable.min.css'


const index:NextPage = ()=> {

  return (
    <div>
      <Button type='primary' id={'button'}>Enter with me</Button>
      <Button type='default' id={'button'}>Enter with me</Button>
    </div>
    
  )
}

export default index
