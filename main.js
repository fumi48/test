//importはダメ(仕様らしい)(importはes2015での記法、import以外はes2015もOK)
//import electron from 'electron'
//import {app, BrowserWindow, Menu, MenuItem, ipcMain } from 'electron';
const electron = require('electron');
const {app, BrowserWindow, Menu, MenuItem, ipcMain, dialog, Tray } = electron;
const path = require('path')

let mainWindow = null;
let appIcon = null

//トレイにアプリを表示する
ipcMain.on('put-in-tray', function(event){
    //後回し
})

//非同期メッセージ
ipcMain.on('asynchronous-message', function(event, arg){
    event.sender.send('asynchronous-reply', 'pong')
})

//同期メッセージ
ipcMain.on('synchronous-message', function(event, arg){
    event.returnValue = 'pong'
})

//Menu
let template = [{
    label: '編集',
    submenu:[{
        label:'やり直し',
        accelerator:'Shift+CmdOrCtrl+Z',
        role:'redo'
    },{
        type:'separator'
    },{
        label:'コピー',
        accelerator:'CmdOrCtrl+C',
        role:'copy'
    }]
},{
    label:'表示',
    submenu:[{
        label:'全画面表示',
        accelerator:(function(){
            if(process.platform === 'darwin'){
                return 'Ctrl+Command+F'
            }else{
                return 'F11'
            }
        })(),
        click:function(item, focusedWindow){
            if(focusedWindow){
                focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
        }
    }]
}]

if(process.platform === 'darwin'){
    const name = electron.app.getName()
    template.unshift({
        label:name,
        submenu:[{
            label:'About ${name}',
            role: 'about'
        },{
            label:'Quit',
            accelerator:'Command+Q',
            click:function(){
                app.quit()
            }
        }]
    })
}

//コンテキストメニュー
//const menu = new Menu()
//menu.append(new MenuItem({label:'Hello'}))
//menu.append(new MenuItem({type:'separator'}))
//menu.append(new MenuItem({label:'Electron', type: 'checkbox', checked: true}))

//ウィンドウ作成時のイベントでコンテキストメニューを登録
// app.on('browser-window-created', function(event, win){
//     win.webContents.on('context-menu', function(e, params){
//         menu.popup(win, params.x, params.y)
//     })
// })

//
ipcMain.on('show-context-menu1', function(event){
    const menu1 = new Menu()
    menu1.append(new MenuItem({ label: 'Context Menu 1'}))
    const win = BrowserWindow.fromWebContents(event.sender)
    menu1.popup(win)
})
ipcMain.on('show-context-menu2', function(event){
    const menu2 = new Menu()
    menu2.append(new MenuItem({ label: 'Context Menu 2'}))
    const win = BrowserWindow.fromWebContents(event.sender)
    menu2.popup(win)
})

//ファイル選択ダイアログを表示する
ipcMain.on('open-file-dialog', function(event){
    const options ={
        title:'Select a file',
        filters:[{name:'Images', extensions:['jpg', 'png', 'gif']}],
        properties: ['openFile']
    }
    dialog.showOpenDialog(options, function(files){
        if(files) event.sender.send('selected-directory', files)
    })  
})

//ファイル保存ダイアログを表示する（保存するコードは別）
ipcMain.on('save-dialog', function(event){
    const options ={
        title:'Save an Image',
        filters:[{
            name: 'Images', extensions:['jpg', 'png', 'gif']
        }]
    }
    dialog.showSaveDialog(options, function(filename){
        event.sender.send('saved-file', filename)
    })
})

//ダイアログを表示する
ipcMain.on('show-dialog', function(event){
    const options = {
        type:'info',
        title:'インフォメーション',
        message:'はじめてのelectron',
        buttons:['Yes', 'No']
    }
    dialog.showMessageBox(options, function(index){
        event.sender.send('selected-result', index)
    })
})

//メインプロセスからウィンドウ表示
app.on('ready', ()=>{

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    mainWindow = new BrowserWindow({ width:400, height:300 });

    mainWindow.loadURL('file://' + __dirname + '/index.html');
    //mainWindow.loadFile('index.html');

    //デベロッパーツールの起動
    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function(){
        mainWindow = null;
    });
});
