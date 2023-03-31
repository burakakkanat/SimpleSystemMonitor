const { app, BrowserWindow, ipcMain } = require('electron');
const si = require('systeminformation');
const edge = require('electron-edge-js');
const path = require('path');

const getOhmCpuTemp = edge.func({
    source: function() {/*

    using OpenHardwareMonitor.Hardware;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Linq;

    public class Startup {

        public async Task<object> Invoke(dynamic input) {

            var cpuTemp = 0f;

            Computer computer = new Computer() {
                CPUEnabled = true,
            };

            computer.Open();

            foreach (var hardware in computer.Hardware) {

                if (hardware.HardwareType != HardwareType.CPU) {
                    continue;
                }

                hardware.Update();

                foreach (var sensor in hardware.Sensors) {
                    if (sensor.SensorType == SensorType.Temperature && sensor.Name.Contains("CPU Package")) {
                        cpuTemp = sensor.Value.GetValueOrDefault();
                    }
                }
            }

            computer.Close();

            return cpuTemp;
        }
    }
    */
    },
    references: ['OpenHardwareMonitorLib.dll']
})

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

            const cpuTemp = await getOhmCpuTemp();

            console.log(cpuTemp);
            const gpuData = await si.graphics();

            const cpuLoad = await si.currentLoad();
            const gpuLoad = (gpuData.controllers[0].memoryUsed * 100 / gpuData.controllers[0].memoryTotal).toFixed(1);

            const systemInfo = {
                //cpuTemp: cpuTemp.main.toFixed(1),
                gpuTemp: gpuData.controllers[0].temperatureGpu.toFixed(1),
                cpuLoad: cpuLoad.currentLoad.toFixed(1),
                gpuLoad: gpuLoad,
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
