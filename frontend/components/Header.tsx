import React, { useState,useEffect } from "react"
import { List,Button, Modal, Input,Space, Statistic,Avatar,Divider } from 'antd'
import { FormOutlined } from '@ant-design/icons'
import {MessageType} from '../App'
const { TextArea } = Input

interface PropsType {
  name: string;
  rename: any;
}

const Header: React.FC<PropsType> = ({name, rename}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  
  const [thename, setThename] = useState<string>(name);


  const onChange = (e:any) =>{
      setThename(e.target.value)
  }

  useEffect(()=>{
    setThename(name);
  },[name]);

  const onOk = () =>{
    rename(thename)
    setIsOpen(false)
  }
  console.log('thename',thename,name)
  return (
    <>
     <Space size="small">
          <h1 style={{color:"white",textAlign:"center"}}>［　{thename}　］的微博</h1>
         <Button shape="circle"  type="link" icon={<FormOutlined /> } onClick={()=>setIsOpen(true)}>改名</Button>
    </Space>

      <Modal title="改名" open={isOpen} onOk={onOk} onCancel={()=>setIsOpen(false)}>
        <TextArea showCount maxLength={120} style={{ height: 120 }} onChange={onChange}  />
      </Modal>
    </>
  

  )
}

export { Header }
