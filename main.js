const { app, BrowserWindow, Menu } = require('electron');
const edge = require('electron-edge-js');
const path = require('path');

const getOhmCpuName = edge.func({
    assemblyFile: 'OHMPortLib.dll',
    typeName: 'OHMPort.OHMPortClass',
    methodName: 'getCpuName'
});

const getOhmGpuName = edge.func({
    assemblyFile: 'OHMPortLib.dll',
    typeName: 'OHMPort.OHMPortClass',
    methodName: 'getGpuName'
});

const getOhmSystemInfo = edge.func({
    assemblyFile: 'OHMPortLib.dll',
    typeName: 'OHMPort.OHMPortClass',
    methodName: 'getSystemInfo'
});

let mainWindow;

function createWindow() {

    mainWindow = new BrowserWindow({
        height: 1280,
        width: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false
        }
    })

    Menu.setApplicationMenu(null);
    mainWindow.setTitle('System Information');
    mainWindow.loadFile('index.html');

    let cpuUsageHolder;
    let cpuTempHolder;
    let gpuUsageHolder;
    let gpuTempHolder;

    const setCpuGpuNames = async () => {

        let tmpCpuName;
        let tmpGpuName;

        getOhmCpuName(null, function (error, result) {
            if (error) {
                throw error
            };
            tmpCpuName = result;
        });

        getOhmGpuName(null, function (error, result) {
            if (error) {
                throw error
            };
            tmpGpuName = result.replace(/NVIDIA(.*?NVIDIA)*/g, 'NVIDIA');
        });

        const cpuGpuNames = {
            cpuName: tmpCpuName,
            gpuName: tmpGpuName,
        }

        mainWindow.webContents.send('cpuGpuNames', cpuGpuNames)
    }

    const sendSystemInfo = async () => {
        try {
            getOhmSystemInfo(null, function (error, result) {
                if (error) {
                    throw error
                };

                cpuUsageHolder = result[0] > 0 ? result[0] : cpuUsageHolder;
                cpuTempHolder = result[1] > 0 ? result[1] : cpuTempHolder;
                gpuUsageHolder = result[2] > 0 ? result[2] : gpuUsageHolder;
                gpuTempHolder = result[3] > 0 ? result[3] : gpuTempHolder;
            });

            const systemInfo = {
                cpuUsage: cpuUsageHolder,
                cpuTemp: cpuTempHolder,

                gpuUsage: gpuUsageHolder,
                gpuTemp: gpuTempHolder,
            }

            mainWindow.webContents.send('systemInfo', systemInfo);
        } catch (error) {
            console.error(error);
        }
    }

    setCpuGpuNames();
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
