const { app, BrowserWindow, Menu } = require('electron');
const edge = require('electron-edge-js');
const path = require('path');

// CPU
const getOhmCpuName = edge.func({
    assemblyFile: 'OHMPortLib.dll',
    typeName: 'OHMPort.OHMPortClass',
    methodName: 'getCpuName'
});
const getOhmCpuTemp = edge.func({
    assemblyFile: 'OHMPortLib.dll',
    typeName: 'OHMPort.OHMPortClass',
    methodName: 'getCpuTemperature'
});
const getOhmCpuUsage = edge.func({
    assemblyFile: 'OHMPortLib.dll',
    typeName: 'OHMPort.OHMPortClass',
    methodName: 'getCpuUsage'
});

// GPU
const getOhmGpuName = edge.func({
    assemblyFile: 'OHMPortLib.dll',
    typeName: 'OHMPort.OHMPortClass',
    methodName: 'getGpuName'
});
const getOhmGpuTemp = edge.func({
    assemblyFile: 'OHMPortLib.dll',
    typeName: 'OHMPort.OHMPortClass',
    methodName: 'getGpuTemperature'
});
const getOhmGpuUsage = edge.func({
    assemblyFile: 'OHMPortLib.dll',
    typeName: 'OHMPort.OHMPortClass',
    methodName: 'getGpuUsage'
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

    let tmpCpuUsage;
    let tmpCpuTemp;

    let tmpGpuUsage;
    let tmpGpuTemp;

    const sendSystemInfo = async () => {
        try {

            getOhmCpuUsage(null, function (error, result) {
                if (error) {
                    throw error
                };
                if (result > 0) {
                    tmpCpuUsage = result;
                }
            });

            getOhmCpuTemp(null, function (error, result) {
                if (error) {
                    throw error
                };
                if (result > 0) {
                    tmpCpuTemp = result;
                }
            });

            getOhmGpuUsage(null, function (error, result) {
                if (error) {
                    throw error
                };
                if (result > 0) {
                    tmpGpuUsage = result;
                }
            });

            getOhmGpuTemp(null, function (error, result) {
                if (error) {
                    throw error
                };
                if (result > 0) {
                    tmpGpuTemp = result;
                }
            });

            const systemInfo = {
                cpuLoad: tmpCpuUsage,
                cpuTemp: tmpCpuTemp,

                gpuLoad: tmpGpuUsage,
                gpuTemp: tmpGpuTemp,
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
