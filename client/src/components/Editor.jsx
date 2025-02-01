import {useEffect, useState} from "react";

import "codemirror/addon/edit/closetag"
import "codemirror/lib/codemirror.css"
import "codemirror/theme/material.css"
import "codemirror/mode/xml/xml"
import "codemirror/mode/javascript/javascript"
import "codemirror/mode/css/css"
import {Controlled as ControlledEditor} from "react-codemirror2"

export default function Editor(props){

    const [open ,setOpen] = useState(true);

    const {displayName,
        language,
        value,
        onChange,
        remoteChange} = props;

    function changeOpen(){
        
        setOpen((prev)=>!prev);
    }

    const name =  displayName.toLowerCase();
    function handleChange(editor,data,value){
        let x = name;
        remoteChange.current = "user";
        onChange((prev)=>{
            if(x=='html'){
                return {...prev , 'html':value};
            }
            else if(x=='css'){
                return {...prev , 'css':value};
            }
            return {...prev , 'js':value};
        });
    }
    return (
        <div className={`editor-container ${open?'':'collapsed'}`}>
            <div className="editor-title">
                <div >
                    {displayName=="HTML" ?
                     <i className="fa-brands fa-html5"></i>:
                     displayName=="CSS"?
                      <i className="fa-brands fa-css3-alt"></i>: <i className="fa-brands fa-js"></i> 
                      } &nbsp;  {open?displayName:''}</div>
            
                <button onClick={changeOpen} className="expand-compress-btn">{open?<i className="fa-solid fa-down-left-and-up-right-to-center"></i>:<i className="fa-solid fa-up-right-and-down-left-from-center"></i>}</button>
            </div>
            <ControlledEditor 
            className="code-mirror-wrapper"
            value={value}
            onBeforeChange={handleChange}
            options={{
                lineWrapping:true,
                lint:true,
                mode:language,
                lineNumbers:true,
                theme:"material",
                autoCloseTags:true,
                }} />
        </div>
    )
}