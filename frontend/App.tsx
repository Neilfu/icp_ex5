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
    const [loadingMsg, setLoadingMsg] = useState<boolean>(false)
    const [loadingFollow, setLoadingFollow] = useState<boolean>(false)
    const [loadingFollowMsg, setLoadingFollowMsg] = useState<boolean>(false)
    
    const [follows, setFollows] = useState([])
    const [fans, setFans] = useState([])
    const [name, setName] = useState('')
    const refreshFollows = async () => {
      setLoadingFollow(true)
      weibo.follows().then(followed=>{
        setFollows(followed as string[])
        setLoadingFollow(false)
      })
        .catch(err=>console.log("error refreshFollows",err));

    }
    useEffect(()=>{
      refreshFollows()
    },[])

    const refreshFans = async () => {
      weibo.followeds().then(fans=>setFans(fans as string[]))
        .catch(err=>console.log("error refreshFans",err));

    }
    useEffect(()=>{
      refreshFans()
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
         setLoadingFollowMsg(true)
         const name = await weibo.id2name(id)
         setLoadingFollowMsg(false)
         return name
      }
      catch (err){
        return err;
      } 
  }

  const refreshMessages = async () => {
    setLoadingMsg(true);
    weibo.timeline(0).then((messages:MessageType[])=>{
      setMessages(messages)
      setLoadingMsg(false)
    })
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
              followedLength= {fans.length}
              followsLength = {follows.length}
              postMessage={postMessage}
              loadingMsg={loadingMsg}
            />
        </Content>
        <Sider width={400} theme="light">
          <Follows
            messages={messages}
            follows={follows}
            onFollow={onFollow}
            id2name={id2name}
            loadingFollow={loadingFollow}
            loadingFollowMsg={loadingFollowMsg}
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
