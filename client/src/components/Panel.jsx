import {useState , useEffect , useRef} from "react";

import Editor from "./Editor"

import {useParams} from "react-router-dom"

import { io } from "socket.io-client"

function Panel() {

  const {id} = useParams();

  const remoteChange = useRef("server");
  const [socket,setSocket] = useState() ;
  const [info,setInfo] = useState({'html':'', 'css':'' , 'js':''});
  
  const [srcDoc , setSrcdoc] = useState('')

  useEffect(()=>{
    if(socket==null ){
        return;
    }
    
    socket.once('load-code',code=>{
        setInfo(code);
    })

    socket.emit('get-code' , id);
    
},[socket,id])

  useEffect(() => {
    const s = io("https://devpad2-0.onrender.com")
    setSocket(s);

    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(()=>{
    if(socket==null){
      return;
    }

    let interval = setInterval(()=>{
      socket.emit("save-code" , info);
    },2500);
    
    return ()=>{
      clearInterval(interval);
    }
  },[info])

  useEffect(()=>{
    if(socket==null || remoteChange.current!="user"){
      return;
    }
    // console.log(info);
    if(remoteChange.current=="user"){
      socket.emit("send-changes",info);
    }

  },[info])

  useEffect(() => {
    if (socket == null) return

    const handler = info => {
      setInfo(info);
    }
    remoteChange.current = "server"; 
    socket.on('receive-changes', handler);
    return () => {
      socket.off("receive-changes", handler)
    }
  }, [socket,info])

  return (
    <>
    <div className="top-pane header">
      <h3><i className="fa-solid fa-code"></i> DevPad</h3>
      <button onClick={()=>{
      setSrcdoc(`
        <html>
          <body>${info.html}</body>
          <style>${info.css}</style>
          <script>${info.js}</script>
        </html>
        `)
    }} >Run &nbsp;<i class="fa-solid fa-play"></i></button>
    </div>
    
      <div className='pane top-pane'>
        <Editor language="xml" 
        displayName="HTML" 
        value={info.html} 
        onChange={setInfo} 
        remoteChange = {remoteChange}
        />
        <Editor language="css" 
        displayName="CSS" 
        value={info.css} 
        onChange={setInfo}
        remoteChange = {remoteChange}
        />
        <Editor language="javascript" 
        displayName="JS" 
        value={info.js} 
        onChange={setInfo} 
        remoteChange = {remoteChange}
        />
        
      </div>
      <div className='pane'>
        <iframe
        srcDoc={srcDoc}
        title='output' 
        sandbox='allow-scripts'
        width="100%"
        height="100%" 
        frameBorder="0"></iframe>
      </div>
    </>
  )
}

export default Panel
