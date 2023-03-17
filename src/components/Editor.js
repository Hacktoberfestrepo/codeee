import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import  'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css';
import 'codemirror/keymap/sublime'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/hint/javascript-hint.js'
import 'codemirror/addon/hint/anyword-hint'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/foldgutter.css';
import AceEditor from 'react-ace';
import ACTIONS from '../Actions';
const Editor = ({socketRef , roomId ,onCodeChange}) => {

  const editorRef=useRef(null);
 
  useEffect(()=>{
    const  init =async ()=>{  
      editorRef.current =Codemirror.fromTextArea(
        document.getElementById('realtimeEditor')
        ,{
          extraKeys: {'Ctrl-Space':'autocomplete'},
          mode:{name:'javascript' , json:true},
          theme:'dracula',
          keyMap:'sublime',
          lineWrapping: true,
          smartIndent: true,
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          autoCloseBrackets:true,
          autoCloseTags:true,
          lineNumbers:true,
          
        }
        );
            editorRef.current.on('change',(instance,changes)=>{
              // console.log('changes',changes);
              const {origin}=changes;
              // console.log('origin',origin)
              const code=instance.getValue();
              onCodeChange(code);
              if(origin!=='setValue'){
                // console.log('working',code)
                socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                  roomId,
                  code,
                });
              }
         // console.log(code);
            });

           }
          init();
    },[]);

    useEffect(()=>{
      if(socketRef.current){

        socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
          // console.log('recieving',code);
          if(code!==null){
            editorRef.current.setValue(code);
          }
        });
      }

      return ()=>{
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
        
    },[socketRef.current])

  return (
    <textarea id='realtimeEditor' > // Write your Code here!</textarea> 
    
   )
}; 

export default Editor

