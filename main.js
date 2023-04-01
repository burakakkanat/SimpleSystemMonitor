const { app, BrowserWindow } = require('electron');
const edge = require('electron-edge-js');
const path = require('path');

const getOhmCpuTemp = edge.func({
    assemblyFile: path.join(__dirname, 'OHMPortLib', 'bin', 'Debug', 'OHMPortLib.dll'),
    typeName: 'OHMPort.OHMPortClass',
    methodName: 'getCpuTemperature'
});
const getOhmCpuUsage = edge.func({
    assemblyFile: path.join(__dirname, 'OHMPortLib', 'bin', 'Debug', 'OHMPortLib.dll'),
    typeName: 'OHMPort.OHMPortClass',
    methodName: 'getCpuUsage'
});
const getOhmGpuTemp = edge.func({
    assemblyFile: path.join(__dirname, 'OHMPortLib', 'bin', 'Debug', 'OHMPortLib.dll'),
    typeName: 'OHMPort.OHMPortClass',
    methodName: 'getGpuTemperature'
});
const getOhmGpuUsage = edge.func({
    assemblyFile: path.join(__dirname, 'OHMPortLib', 'bin', 'Debug', 'OHMPortLib.dll'),
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
            
            var tmpCpuUsage;
            var tmpCpuTemp;

            var tmpGpuUsage;
            var tmpGpuTemp;

            getOhmCpuUsage(null, function (error, result) {
                if (error) {
                    throw error
                };
                tmpCpuUsage = result;
            });

            getOhmCpuTemp(null, function (error, result) {
                if (error) {
                    throw error
                };
                tmpCpuTemp = result;
            });

            getOhmGpuUsage(null, function (error, result) {
                if (error) {
                    throw error
                };
                tmpGpuUsage = result;
            });

            getOhmGpuTemp(null, function (error, result) {
                if (error) {
                    throw error
                };
                tmpGpuTemp = result;
            });

            const systemInfo = {
                cpuLoad: tmpCpuUsage,
                cpuTemp: tmpCpuTemp,

                gpuLoad: tmpGpuUsage,
                gpuTemp: tmpGpuTemp,
            }

            mainWindow.webContents.send('systemInfo', systemInfo)
        } catch (error) {
            console.error(error);
        }
    }

    setInterval(sendSystemInfo, 2000);
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
