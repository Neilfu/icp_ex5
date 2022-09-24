import { useCanister } from "@connect2ic/react"
import React, { useEffect, useState } from "react"
import { List,Button,Input,Space } from 'antd'
import { UserOutlined,PlusOutlined } from '@ant-design/icons';

const Follows = ({follows,onFollow}) => {
  const [bloggerId, setBloggerId] = useState<string>('');
  const onChange = (e:any) =>{
    setBloggerId(e.target.value)
  }
  
  return (
    <>
      <Space>
        <Input placeholder="请输入博主ID" prefix={<UserOutlined />}  onChange={onChange}/>
        <Button shape="circle"  type="primary" icon={<PlusOutlined /> } onClick={(e)=>onFollow(e,bloggerId)}></Button>
      </Space>
       <List
        size="small"
        dataSource={follows}
        renderItem={id => <List.Item>{id as string}</List.Item>}
      />

    </>
  

  )
}

export { Follows }
