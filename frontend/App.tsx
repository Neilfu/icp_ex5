import React, { useEffect, useState }  from "react"
import { Layout} from "antd"
const { Header, Footer, Sider, Content } = Layout;
/*
 * Connect2ic provides essential utilities for IC app development
 */
import { createClient } from "@connect2ic/core"
import { defaultProviders } from "@connect2ic/core/providers"
import { Connect2ICProvider } from "@connect2ic/react"
import "@connect2ic/core/style.css"
/*
 * Import canister definitions like this:
 */
import * as weibo from "../.dfx/local/canisters/weibo"
/*
 * Some examples to get you started
 */
import { useCanister } from "@connect2ic/react"
import { Messages } from "./components/Messages"
import { Follows } from "./components/Follows"
import { Header as Title } from "./components/Header"

import { Profile } from "./components/Profile"
import 'antd/dist/antd.css';

export interface MessageType {
  text: string;
  time: number;
  author: string;
} 

function App() {

    const [weibo] = useCanister("weibo")
    const [messages, setMessages] = useState<MessageType[]>([])
    
    const [follows, setFollows] = useState([])
    const [followed, setFollowed] = useState([])
    const [name, setName] = useState('')
    const refreshFollows = async () => {
      let follows:string[] = await weibo.follows() as string[]
      setFollows(follows)
    }
    useEffect(()=>{
      refreshFollows()
    },[])

    const refreshFollowed = async () => {
      let followed:string[] = await weibo.follows() as string[]
      setFollows(followed)
    }
    useEffect(()=>{
      //refreshFollowed()
    },[])

  const postMessage = async (message) =>{
    await weibo.post(message)
    refreshMessages()

  }

  const rename = async (newname) =>{
    await weibo.setName(newname)
    refreshName()
  }

  const refreshMessages = async () => {
    const messages:MessageType[] = await weibo.timeline(0) as MessageType[]
    setMessages(messages)
  }
  useEffect(()=>{
    refreshMessages()
  },[])

   const refreshName = async () => {
      let name:string = await weibo.getName() as string;
      setName(name)
  }

  useEffect(()=>{
    refreshName();
  },[])

  const onFollow = async (e:any, id:string) =>{
    await weibo.follow(id)
    refreshFollows()
  }

  return (
    <>
    <Layout >
      <Header ><Title name={name} rename={rename}/>{name}</Header>
      <Layout>
        <Content>
            <Messages 
              messages={messages}
              followedLength= {followed.length}
              followsLength = {follows.length}
              postMessage={postMessage}
            />
        </Content>
        <Sider width={400} theme="light">
          <Follows
            follows={follows}
            onFollow={onFollow}
          />
        </Sider>
      </Layout>

    </Layout>
    </>




  )
}

const client = createClient({
  canisters: {
    weibo,
  },
  providers: defaultProviders,
  globalProviderConfig: {
    dev: import.meta.env.DEV,
  },
})

export default () => (
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
)
