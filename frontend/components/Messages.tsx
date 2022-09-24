import React, { useState } from "react"
import { List,Button, Modal, Input,Space, Statistic,Skeleton,Avatar } from 'antd'
import { FormOutlined } from '@ant-design/icons'
import {MessageType} from '../App'
const { TextArea } = Input

interface PropsType {
  messages: MessageType[];
  followsLength: number;
  followedLength: number;
  postMessage: (message:string)=>{};
}

const Messages: React.FC<PropsType> = ({messages,followsLength, followedLength, postMessage}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  
  const [message, setMessage] = useState<string>("");


  const onChange = (e:any) =>{
      setMessage(e.target.value)
  }


  const onOk = () =>{
    postMessage(message)
    setIsOpen(false)
  }
  
  return (
    <>
     <Space size="small">

        <Statistic title="微博" value={messages.length} />

        <Statistic title="关注" value={followsLength}  />

        <Statistic title="粉丝" value={followedLength}  />
         <Button shape="circle"  type="primary" icon={<FormOutlined /> } onClick={()=>setIsOpen(true)}></Button>
    </Space>

      <List
        size="small"
        dataSource={messages}
        renderItem={message => 
          <List.Item
            key={message.author}
          >
              <List.Item.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={<a href="">{message.author}</a>}
              />
              {message.text}
          </List.Item>
        }
      />
      <Modal title="写消息" open={isOpen} onOk={onOk} onCancel={()=>setIsOpen(false)}>
        <TextArea showCount maxLength={120} style={{ height: 120 }} onChange={onChange}  />
      </Modal>
    </>
  

  )
}

export { Messages }
