import { useCanister } from "@connect2ic/react"
import React, { useEffect, useState } from "react"
import { List,Button,Input,Space, Popover } from 'antd'
import { UserOutlined,PlusOutlined } from '@ant-design/icons'
import {MessageType} from '../App'

interface PropsType {
  messages: MessageType[];
  follows:string[];
  onFollow:any;
  id2name: any;
  loadingFollow:boolean;
  loadingFollowMsg:boolean;
};

const Follows: React.FC<PropsType>= ({messages,follows,onFollow, id2name,loadingFollow,loadingFollowMsg}) => {
  const [bloggerId, setBloggerId] = useState<string>('');
  const [msgs4id, setMsgs4id] = useState<MessageType[]>([])
  const [author,setAuthor] = useState<string>('');


  const onClick = (e,id) =>{
    if(id) 
      id2name(id).then(author =>{
        console.log('author',author,'id',id)
        setAuthor(author);
        setMsgs4id(messages.filter(msg=>msg.author == author))
      })
      .catch(err=>console.log('error',err)
      )
  }

  const onChange = (e:any) =>{
    setBloggerId(e.target.value)
  }
 
  const tick2Datetime = (n: any) => {
    const tick: number = Number(n / BigInt(1000000))
    const date = new Date(tick)
    return date.toLocaleString()
  }  


  
  const content = (
          <List
            size="small"
            loading={loadingFollowMsg}
            dataSource={msgs4id}
            renderItem={(message:MessageType) => <List.Item
            >
              {message.text} <br/> 发布时间: {tick2Datetime(message.time)}
            </List.Item>} />
    )
 
  return (
    <>
      <Space>
        <Input placeholder="请输入博主ID" prefix={<UserOutlined />}  onChange={onChange}/>
        <Button shape="circle"  type="primary" icon={<PlusOutlined /> } onClick={(e)=>onFollow(e,bloggerId)}></Button>
      </Space>
       <List
        size="small"
        loading={loadingFollow}
        dataSource={follows}
        renderItem={id => <List.Item>
          
            <Popover content={msgs4id.length>0?content:''} title={"他["+ author + "]发表的消息："}>
              <Button  onClick={e=>onClick(e,id)}>{id as string}</Button>
          </Popover>
          
          
          </List.Item>}
      />

    </>
  

  )
}

export { Follows }
