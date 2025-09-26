const { app, BrowserWindow, Tray, Menu } = require('electron/common')
const path = require("path");
const { openCustomHid } = require("./custom_hid");

const createWindow = () => {
  const win = new BrowserWindow({
    // width: 200,
    // height: 200,
    // frame: false,
    // autoHideMenuBar: true,
    // transparent: true,
    // alwaysOnTop: true,
  })
  // win.setIgnoreMouseEvents(true, { forward: true })
  win.loadFile('index.html')
  
  openCustomHid.onReport = (report) => {
    win.webContents.send("hid-report", report);
  };
  openCustomHid();
}


let tray = null


app.whenReady().then(() => {


  tray = new Tray('./icon.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { role: 'quit' },
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)


  createWindow()
})