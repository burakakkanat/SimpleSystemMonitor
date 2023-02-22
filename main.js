const { app, BrowserWindow, ipcMain } = require('electron')
const si = require('systeminformation')
const path = require('path')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow.setTitle('System Information')

    mainWindow.loadFile('index.html')

    const sendSystemInfo = async () => {
        try {

            const cpuTemp = await si.cpuTemperature();
            const gpuData = await si.graphics();

            const cpuLoad = await si.currentLoad();
            const gpuLoad = (gpuData.controllers[0].memoryUsed * 100 / gpuData.controllers[0].memoryTotal).toFixed(1);

            const systemInfo = {
                cpuTemp: cpuTemp.main.toFixed(1),
                gpuTemp: gpuData.controllers[0].temperatureGpu.toFixed(1),
                cpuLoad: cpuLoad.currentLoad.toFixed(1),
                gpuLoad: gpuLoad,
            }

            mainWindow.webContents.send('systemInfo', systemInfo)
        } catch (error) {
            console.error(error);
        }
    }

    setInterval(sendSystemInfo, 1000);
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
