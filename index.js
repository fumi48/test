const ipc = require('electron').ipcRenderer
const contextMenuBtn1 = document.getElementById('context-button1')
contextMenuBtn1.addEventListener('click', function(){
    ipc.send('show-context-menu1')
})
const contextMenuBtn2 = document.getElementById('context-button2')
contextMenuBtn2.addEventListener('click', function(){
    ipc.send('show-context-menu2')
})
const selectDirBtn = document.getElementById('select-directory')
selectDirBtn.addEventListener('click', function(event){
    ipc.send('open-file-dialog')
})
ipc.on('selected-directory', function(event, path){
    document.getElementById('selected-file').innerHTML = `path: ${path}`
})
const saveFileBtn = document.getElementById('save-dialog')
saveFileBtn.addEventListener('click', function(){
    ipc.send('save-dialog')
})
ipc.on('saved-file', function(event, path){
    if(!path) path = 'No Path'
    document.getElementById('file-saved').innerHTML = `Path selected: ${path}`
})
const showDialog = document.getElementById('show-dialog')
showDialog.addEventListener('click', function(){
    ipc.send('show-dialog')
})
ipc.on('selected-result', function(event, index){
    document.getElementById('selected-result').innerHTML = `Selected Index: ${index}`
})
//非同期メッセージ
const asyncMsgBtn = document.getElementById('async-msg')
asyncMsgBtn.addEventListener('click', function(){
    ipc.send('asynchronous-message', 'ping')
})
ipc.on('asynchronous-reply', function(event, arg){
    const message = `Async Message: ${arg}`
    document.getElementById('async-reply').innerHTML = message
})
//同期メッセージ
const syncMsgBtn = document.getElementById('sync-msg')
syncMsgBtn.addEventListener('click', function(){
    const reply = ipc.sendSync('synchronous-message', 'ping')
    const message = `Syncronous Message: ${reply}`
    document.getElementById('sync-reply').innerHTML = message
})
