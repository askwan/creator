let $message = function(mes,type="success"){
    //error,caver
    let oDiv = document.createElement("div");
    // oDiv.className="${type}";
    oDiv.classList.add("message-box")
    oDiv.classList.add(type)
    oDiv.innerHTML=`${mes}`;
    document.body.appendChild(oDiv)
    setTimeout(()=>{
      
    },1000)
  }
  export default $message;
  