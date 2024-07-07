"use client"
import React from 'react';
import Image from "next/image";
import styles from "./page.module.css";
//import "./App.css";

const CodeContext = React.createContext()


function App(){
  
  const [codeSequence,setCodeSequence] = React.useState([[[], '', []]])
  let [pinTags,setPinTags] = React.useState([{start:0,end:1,tag:'x'}])
  let [sourceCode, setSourceCode] = React.useState('');
  const [sequenceTracker , setSequenceTracker] = React.useState(0)
  let [preview, setPreview] = React.useState(true);
  let [showPreview , setShowPreview] = React.useState()

  const joinContents = (content)=>{
    //let styles = `${x.style.length > 0 ? ${x.style.map((i=>`${i.key}:${i.value};`)).join(" ")} : ''}`
    let styles = (x) => (x.style.map((i=>i.key && `${i.key}:${i.value};`)).join(""))
    let attributes = (x) => `${x.attributes.map((i)=>i.key && `${i.key}="${i.value}"`).join("")}`
    let firstPart = content[0].map(x=>(`${x.start} style="${styles(x)}" ${attributes(x)} >`))
    let secondPart = content[2].map(x=>x.end)

    let total = `${firstPart.join("")} ${content[1]} ${secondPart.join("")}`  
    
    return total;
    
  }

  const joinAllSequence = ()=>{
    let totalSeq = '';
    
    for (let i of codeSequence){
    totalSeq += joinContents(i)
    }
    console.log(totalSeq)
    return totalSeq;

  }


  React.useEffect(()=>{
    setSourceCode(joinAllSequence())
  },[codeSequence])

  return (
      <CodeContext.Provider value={{codeSequence,setCodeSequence,joinContents,sourceCode,setSourceCode, joinAllSequence, sequenceTracker , setSequenceTracker , pinTags , setPinTags }}>
     <nav class='px-2'>
      
    </nav>
    
    <div class='container-fluid'>

    <div class="row center sz-16">
      <div class="col p-2">
        <button class="col-md-8 col-12 no-border rounded p-2" onClick={()=>setShowPreview(false)}> Editor </button>
      </div>
      <div class="col p-2">
        <button class="col-md-8 col-12 no-border rounded p-2" onClick={()=>setShowPreview(true)}> Preview </button>
      </div>
    </div>
    
     <div class="row">
     <div class="col-md-6 col-sm border-end">
      {!showPreview ? <ElementsDisplay /> : <Preview content={sourceCode} /> }
    </div>     
    <div class="col-md-6 col-sm d-none d-md-block">
      {preview ? <Preview content={sourceCode} /> : <HTMLCode content={sourceCode} />}
      <div class="row">
        <div class="col">
          <button class="btn color-bg-s" onClick={()=>setPreview((prev)=> prev == true ? false : true)}> {preview ? 'show source code' : 'show preview'} </button>
        </div>
      </div>

    </div>
    </div>
      <SequenceDisplay />
    </div>
    </CodeContext.Provider>
  );
};


function Preview(props){

  return(
    <div class="container-fluid">
        <div class="row">
        <div  class="col sz-18 hide bold color-p">
          Preview
        </div>
        </div>
        
<div  dangerouslySetInnerHTML={{__html: props.content }} style={{height:'300px',overflow:'auto'}}/>

        </div>

    )
}

       // <div className='col-md-6 my-2'>
       //    {preview ? <Preview content={sourceCode} /> : <HTMLCode content={sourceCode} />}
       //    <hr />
       //    <div className="row" style={{ zIndex: '20000' }}>
       //      <div className="col">
       //        <p>
       //          <button
       //            className="btn btn-danger btn-block"
       //            onClick={() => setPreview(!preview)}
       //          >
       //            {preview ? 'Show Source Code' : 'Show Preview'}
       //          </button>
       //        </p>
       //      </div>
       //    </div>

function HTMLCode(props){
  let [edit,setEdit] = React.useState(false)
  let text = React.useRef()
  let text2 = React.useRef()

  const saveContent =() =>{
    let value1 = text.current.value
    text2.current.value = ''
  }  
  const EditText = () => <textarea ref={text} class='form-control border my-2 ' editable={true}  style={{height:'300px',overflow:'auto'}}>{props.content}</textarea>

  const UnEditText = () => <textarea ref={text2} class='form-control border my-2 ' editable={true} value={props.content} style={{height:'300px',overflow:'auto'}}>{props.content}</textarea> 

  const EditButton =() => <button class="btn-primary btn" onClick={()=>setEdit(true)}>Edit </button>

  const SaveButton =() => <button class="btn-primary btn" onClick={()=>saveContent()} >Save </button> 
  return(
    <>
      <h5 class='color-p'>Result</h5>
      
      {edit ? <EditText /> : <UnEditText />}
      <p class="hide"> {edit ? <SaveButton/> : <EditButton /> } </p>
    </>
    )
}


function Elements(props){
  return(
      <button class='btn w-100' onClick={props.click} >{props.name}</button>
    )
}


function ElementsDisplay(props) {
  let inLineElements = [
    { rep: 'bold', start: '<b>', end: '</b>' },
    { rep: 'italic', start: '<i>', end: '</i>' },
    { rep: 'break', start: '', end: '<br />' }
  ];
  let elementList = [
    { rep: '', start: '', end: '', style: [{ key: '', value: '' }] },
    { rep: 'paragraph', start: '<p', end: '</p>', style: [{ key: '', value: '' }] , content: '' , attributes:[{key:'',value:""}]},
    { rep: 'heading 1', start: '<h1', end: '</h1>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'heading 2', start: '<h2', end: '</h2>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'heading 3', start: '<h3', end: '</h3>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'heading 4', start: '<h4', end: '</h4>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'heading 5', start: '<h5', end: '</h5>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'heading 6', start: '<h6', end: '</h6>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'bold', start: '<b', end: '</b>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'italic', start: '<i', end: '</i>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'underline', start: '<u', end: '</u>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'link', start: '<a', end: '</a>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'unordered list', start: '<ul', end: '</ul>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'ordered list', start: '<ol', end: '</ol>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'list item', start: '<li', end: '</li>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'table', start: '<table', end: '</table>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'table row', start: '<tr', end: '</tr>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'table data', start: '<td', end: '</td>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'table header', start: '<th', end: '</th>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'division', start: '<div', end: '</div>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'span', start: '<span', end: '</span>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'image', start: '<img', end: '', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'line break', start: '<br', end: '', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'horizontal rule', start: '<hr', end: '', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'form', start: '<form', end: '</form>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'input', start: '<input', end: '', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'button', start: '<button', end: '</button>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'select', start: '<select', end: '</select>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'option', start: '<option', end: '</option>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'textarea', start: '<textarea', end: '</textarea>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'label', start: '<label', end: '</label>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'header', start: '<header', end: '</header>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'footer', start: '<footer', end: '</footer>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'section', start: '<section', end: '</section>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'article', start: '<article', end: '</article>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'aside', start: '<aside', end: '</aside>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'nav', start: '<nav', end: '</nav>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'figure', start: '<figure', end: '</figure>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
    { rep: 'figcaption', start: '<figcaption', end: '</figcaption>', style: [{ key: '', value: '' }] , attributes:[{key:'',value:""}]},
];



  let { codeSequence,setCodeSequence,joinContents,sourceCode,setSourceCode, joinAllSequence , sequenceTracker , setSequenceTracker , pinTags , setPinTags} = React.useContext(CodeContext);
  let contentValue = React.useRef('');
  let [element, setElement] = React.useState(elementList[1]);
  let [contentSequence, setContentSequence] = React.useState(codeSequence[sequenceTracker]);
  let styleKey = React.useRef([])
  let styleValue = React.useRef([])
  let attributeKey = React.useRef([])
  let attributeValue = React.useRef([])
  let [elementStatus,setElementStatus] = React.useState(true)
  let selectTag = React.useRef()
  let tagHouse = React.useRef()
  let [sequencePreviewTracker , setSequencePreviewTracker] = React.useState(2)

  const convertToSequence = (ele) => {
    let characterSequence = [...contentSequence];
  
    if(ele == true){
    characterSequence[0].push(element);
    characterSequence[2].unshift(element)
    console.log("element is coming")  
    }
    else if(ele == 'update'){
      let index = characterSequence[0].findLastIndex((x,e)=>x.start == element.start)
      console.log(index)
      characterSequence[0][index] = element
    }
  characterSequence[1] = contentValue.current.value;
    return characterSequence
  };


  const pushToSequence = (ele)=>{
    setContentSequence(convertToSequence(ele));
  }

  const removeFromSequence = (character,closeCharacter) => {
    let characterSequence = [...contentSequence];
    console.log(characterSequence)
    console.log(closeCharacter)
    characterSequence[0] = characterSequence[0].filter((char,e) => e !== character);
    characterSequence[2] = characterSequence[2].filter((char,e) => e!== closeCharacter);
    setContentSequence(characterSequence);
    console.log(characterSequence)
    //setElement(elementList[0])
  };

  const pushContent = ()=>{
    let content = [...codeSequence]
    try{
    content[sequenceTracker]= contentSequence}
    catch{
      content.push(contentSequence)
    }
    setCodeSequence(content);
  }

  const nextSequence = ()=>{
    setSequenceTracker((prev)=>prev+1)
    setContentSequence([[], '', []])
    contentValue.current.value = ""
  }

  const addStyle = (e)=>{
  
    let formerStyle = element.style
    formerStyle[e+1] = {key:styleKey.current[e]?.value,value:styleValue.current[e]?.value}
    setElement((prev)=>({...prev,style:formerStyle}))
    setElementStatus("update")
  }

  const addAttribute = (e)=>{
    let formerAttribute = element.attributes
    formerAttribute[e+1] = {key:attributeKey.current[e]?.value,value:attributeValue.current[e]?.value}
    //let newAttribute = [...formerAttribute,{key:attributeKey.current[e]?.value,value:attributeValue.current[e]?.value}]
    setElement((prev)=>({...prev,attributes:formerAttribute}))
    setElementStatus("update")
  }

  const pinTag = (ele)=>{
    let tags = [...pinTags]
    tags[0].push(ele);
    tags[2].unshift(ele)
    setPinTags(tags)
  }

  const addElement = (e)=>{
      setElementStatus(true)
      setElement(elementList[e]);
      
      //pushToSequence(true);
      console.log('Element added')  
  }

  React.useEffect(() => {
    pushContent(false)
  }, [contentSequence]);

  React.useEffect(() => {
    //pushContent(true)
    if(elementStatus === true){
      pushToSequence(true)
    }
    else if(elementStatus === "update"){
      pushToSequence("update")
    }
  }, [element]);

  React.useEffect(()=>{
    if(codeSequence[sequenceTracker]){
      setContentSequence(codeSequence[sequenceTracker])
      contentValue.current.value = codeSequence[sequenceTracker][1]
    }
  },[sequenceTracker])

  return (
    <div class="container-fluid">
       <div class="row">
        <div  class="col sz-18 bold color-p">
        
        </div>
        </div>
        <br />
        <div class="row">
      <div className='col color-p sz-16 bold'>Select Tag </div>
      </div>
      <div className='row my-2 bordr rounded' ref={tagHouse} stye={{height:'100px',overflow:'auto'}}>
        
        <select ref={selectTag} class="form-control" onChange={()=>addElement(selectTag.current.value)} >
        {elementList.map((x, e) => (
           <option key={e} value={e}> {x.rep} </option> 
        ))}
        </select>
      </div>

      <div className="row sz-12" ref={tagHouse}>
            {contentSequence[0].slice(0,sequencePreviewTracker).map((x, index) => (

              <>{x.start &&
              <div key={index} className="col-sm-2 col-md-3 p-2 ">
                <div className="color-bg-silver bg-light color-black p-1 m-2 rounded row align-items-center">
                  <div className="col">{x.rep}</div>
                  <div className="col" style={{textAlign:'right'}}>
                    <button onClick={() => removeFromSequence(index, contentSequence[2].indexOf(x))} className="btn color-red btn-link">
                      <i className="fas fa-times-circle"></i>
                    </button>
                  </div>
                  <div class="col hide">
                    <button onClick={()=>pinTag(x)} class="btn" > pin tag </button>
                  </div>
                </div>
              </div>}
              </>
            ))}
          </div>


      <div class="row my-3">
        <div class="col">
          {sequencePreviewTracker == 2 && <button class="sz-12 no-border rounded btn btn-link no-decoration" onClick={()=>setSequencePreviewTracker(100)} >show all </button>}
          {sequencePreviewTracker ===100 && <button class="sz-12 no-border rounded btn btn-link no-decoration" onClick={()=>setSequencePreviewTracker(2)} >show less </button> }
        </div>
      </div>

      <div className='row my-3'>
        <div className='col my-3'>
          <h5 className='color-p bold sz-16'>Add Content </h5>
          <p>
            <textarea
              name='element'
              className='form-control'
              style={{ height: '150px' }}
              ref={contentValue}
              onChange={pushToSequence}
              placeholder='Insert Content'
            ></textarea>
          </p>

          <div class="row my-3 bold color-p">
            <div class="col sz-16">
              Add Style
            </div>
          </div>

          <div class="row">
            <div class="col">
              style: {element.style.map((style)=><>{style.key && <>{style.key}:{style.value} </> }</>)}
            </div>
          </div>
  
          { 
          element.style.map((style,e)=>(
          <div class="row my-2" key={e}>
            <div class="col"> <input placeholder="key" class="form-control p-2" ref={el=>styleKey.current[e]=el}  /></div>
            <div class="col"> <input placeholder ="value" class="form-control p-2" ref={el=>styleValue.current[e]=el} /> </div>
            <div class="col">
              <button class="btn color-bg-p color-white w-100 p-2" onClick={()=>addStyle(e)}> Update </button>
            </div>
          </div>
          ))
          }

          <br />

           <div class="row my-3 bold color-p">
            <div class="col sz-16">
              Add Attributes
            </div> 
          </div>

          <div class="row hide">
            <div class="col">
              style: {element.style.map((style)=><>{style.key && <>{style.key}:{style.value} </> }</>)}
            </div>
          </div>

          { 
          element.attributes.map((style,e)=>(
          <div class="row my-2" key={e}>
            <div class="col"> <input placeholder="key" class="form-control p-2" ref={el=>attributeKey.current[e]=el}  /></div>
            <div class="col"> <input placeholder ="value" class="form-control p-2" ref={el=>attributeValue.current[e]=el} /> </div>
            <div class="col">
              <button class="btn color-bg-p color-white w-100 p-2" onClick={()=>addAttribute(e)}> Update </button>
            </div>
          </div>
          ))
          }
          <br />
          

          <p className='border rounded p-2 hide' style={{ height: '70px', overflow: 'auto' }}>
            {element.start} {contentValue.current?.value} {element.end}
          </p>


       <div class="row my-3 hide">
        <div class="col">
          <button class="sz-14 no-border" onClick={()=>tagHouse.current.classList.toggle('h-100')} >show sequence </button>
        </div>
      </div>

          <br />

          <div class="row">
            <div class="col">
                <button class="btn btn-success w-100 py-3 sz-16" onClick={nextSequence}> Next </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function SequenceDisplay(props){
  const { codeSequence,setCodeSequence,joinContents,sourceCode,setSourceCode, joinAllSequence , sequenceTracker , setSequenceTracker} = React.useContext(CodeContext)

  const nextTracker = ()=>{
    setSequenceTracker((prev)=>prev+1)
  }

  const prevTracker = ()=>{
    setSequenceTracker((prev)=>prev-1)
  }

  return (
        <div class="container-fluid"> 
        <div class="row sz-14">
          <div class="col-6 center">
            {sequenceTracker != 0 && <button class="btn color-bg-p color-white" onClick={nextTracker}> Next </button>}
            
          </div>
          <div class="col-6">
            {sequenceTracker >0 && <button class="btn color-bg-p color-white" onClick={prevTracker}> Prev </button>}
          </div>
        </div>

        </div>
    )
}

export default App;