import React, { useState } from "react"
import { List,Button, Modal, Input,Space, Statistic,Avatar,Divider } from 'antd'
import { FormOutlined } from '@ant-design/icons'
import {MessageType} from '../App'
const { TextArea } = Input

interface PropsType {
  messages: MessageType[];
  followsLength: number;
  followedLength: number;
  postMessage: any;
};

const Messages: React.FC<PropsType> = ({ messages, followsLength, followedLength, postMessage }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [message, setMessage] = useState<string>("")


  const onChange = (e: any) => {
    setMessage(e.target.value)
  }


  const onOk = () => {
    postMessage(message)
    setIsOpen(false)
  }

  const tick2Datetime = (n: any) => {
    const tick: number = Number(n / BigInt(1000000))
    const date = new Date(tick)
    return date.toLocaleString()
  }

  return (
    <>
      <Space size="small">

        <Statistic title="微博" value={messages.length} />

        <Statistic title="关注" value={followsLength} />


        <Button shape="circle" type="primary" icon={<FormOutlined />} onClick={() => setIsOpen(true)}></Button>
      </Space>

      <List
        size="small"
        dataSource={messages}
        renderItem={message => <List.Item
        >
          <List.Item.Meta
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title={<Space split={<Divider type="vertical" />}>
              <a href="">{message.author}</a>
              <span> {tick2Datetime(message.time)}</span>
            </Space>} />
          {message.text}
        </List.Item>} />
      <Modal title="写消息" open={isOpen} onOk={onOk} onCancel={() => setIsOpen(false)}>
        <TextArea showCount maxLength={120} style={{ height: 120 }} onChange={onChange} />
      </Modal>
    </>


  )
}

export { Messages }
