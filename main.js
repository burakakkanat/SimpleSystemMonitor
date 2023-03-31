const { app, BrowserWindow, ipcMain } = require('electron');
const edge = require('electron-edge-js');
const path = require('path');

const getOhmCpuTemp = edge.func({
    assemblyFile: path.join(__dirname, 'OHMPortLib', 'bin', 'Release', 'OHMPortLib.dll'),
    typeName: 'OHMPort.OHMPortClass',
    methodName: 'getCpuTemperature'
});
const getOhmCpuUsage = edge.func({
    assemblyFile: path.join(__dirname, 'OHMPortLib', 'bin', 'Release', 'OHMPortLib.dll'),
    typeName: 'OHMPort.OHMPortClass',
    methodName: 'getCpuUsage'
});
const getOhmGpuTemp = edge.func({
    assemblyFile: path.join(__dirname, 'OHMPortLib', 'bin', 'Release', 'OHMPortLib.dll'),
    typeName: 'OHMPort.OHMPortClass',
    methodName: 'getGpuTemperature'
});
const getOhmGpuUsage = edge.func({
    assemblyFile: path.join(__dirname, 'OHMPortLib', 'bin', 'Release', 'OHMPortLib.dll'),
    typeName: 'OHMPort.OHMPortClass',
    methodName: 'getGpuUsage'
});

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false
        }
    })

    mainWindow.setTitle('System Information');

    mainWindow.loadFile('index.html');

    const sendSystemInfo = async () => {
        try {

            const cpuLoad = await getOhmCpuUsage();
            const cpuTemp = await getOhmCpuTemp();

            const gpuUsage = await getOhmGpuUsage();
            const gpuTemp = await getOhmGpuTemp();

            const systemInfo = {
                cpuLoad: cpuLoad,
                cpuTemp: cpuTemp.toFixed(1),
                gpuLoad: gpuUsage,
                gpuTemp: gpuTemp.toFixed(1),
            }

            mainWindow.webContents.send('systemInfo', systemInfo)
        } catch (error) {
            console.error(error);
        }
    }

    setInterval(sendSystemInfo, 2500);
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
