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
      weibo.follows().then(followed=>setFollows(followed as string[]))
        .catch(err=>console.log("error refreshFollows",err));

    }
    useEffect(()=>{
      refreshFollows()
    },[])

  const postMessage = async (message) =>{
    weibo.post(message).then(()=>refreshMessages())
      .catch(err=>console.log("error postMessage",err));
    

  }

  const rename = async (newname) =>{
    weibo.set_name(newname).then(()=>refreshName())
      .catch(err=>console.log("error rename",err));
    
  }

  const id2name = async(id:string) =>{
    if (id)  
      try{
         return await weibo.id2name(id)
      }
      catch (err){
        return err;
      } 
  }

  const refreshMessages = async () => {
    weibo.timeline(0).then((messages:MessageType[])=>setMessages(messages))
      .catch(err=>console.log('refreshMessages',err))

    
  }
  useEffect(()=>{
    refreshMessages()
  },[])

   const refreshName = async () => {
      weibo.get_name().then((name:string)=>setName(name))
        .catch(err=>console.log("refreshName error", err)) ;
      
  }

  useEffect(()=>{
    refreshName();
  },[])

  const onFollow = async (e:any, id:string) =>{
    weibo.follow(id).then(()=>refreshFollows())
      .catch(err=>console.log('onFlow error',err))
    
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
            messages={messages}
            follows={follows}
            onFollow={onFollow}
            id2name={id2name}
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
