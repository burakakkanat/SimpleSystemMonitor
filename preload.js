const { contextBridge, ipcRenderer } = require('electron')
var ProgressBar = require('progressbar.js');

contextBridge.exposeInMainWorld('myAPI', {
    receive: (channel, callback) => {
        ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
});

window.addEventListener('DOMContentLoaded', () => {

    const cpuTempSemiCircle = new ProgressBar.SemiCircle('#cpu-temperature-bar', {
        trailWidth: 10,
        strokeWidth: 10,
        color: '#FFEA82',
        trailColor: '#eee',
        easing: 'easeInOut',
        duration: 1000,
        from: { color: '#FFEA82' },
        to: { color: '#ED6A5A' },
        text: {
            alignToBottom: true,
            style: {
                fontSize: '25px',
                fontFamily: 'Helvetica',
                position: 'absolute',
                left: '50%',
                top: '50%'
            },
        },
        step: (state, bar) => {
            bar.path.setAttribute('stroke', state.color);
            const value = Math.round(bar.value() * 100) + '°C';
            bar.setText(value);
            bar.text.style.color = state.color;
        }
    });

    var cpuLoadLine = new ProgressBar.Line('#cpu-load-bar', {
        trailWidth: 1,
        strokeWidth: 3,
        easing: 'easeInOut',
        duration: 1000,
        color: '#FFEA82',
        trailColor: '#eee',
        from: { color: '#FFEA82' },
        to: { color: '#ED6A5A' },
        text: {
            style: {
                fontSize: '20px',
                fontFamily: 'Helvetica',
                position: 'absolute',
                right: '0',
                top: '30px',
                padding: 0,
                margin: 0,
                transform: null
            },
            autoStyleContainer: false
        },
        step: (state, bar) => {
            bar.setText('%' + Math.round(bar.value() * 100) + " usage");
            bar.path.setAttribute('stroke', state.color);
            bar.text.style.color = state.color;
        }
    });

    const gpuTempSemiCircle = new ProgressBar.SemiCircle('#gpu-temperature-bar', {
        trailWidth: 10,
        strokeWidth: 10,
        color: '#FFEA82',
        trailColor: '#eee',
        easing: 'easeInOut',
        duration: 1000,
        from: { color: '#FFEA82' },
        to: { color: '#ED6A5A' },
        text: {
            alignToBottom: true,
            style: {
                fontSize: '25px',
                fontFamily: 'Helvetica',
                position: 'absolute',
                left: '50%',
                top: '50%'
            },
        },
        step: (state, bar) => {
            bar.path.setAttribute('stroke', state.color);
            const value = Math.round(bar.value() * 100) + '°C';
            bar.setText(value);
            bar.text.style.color = state.color;
        }
    });

    var gpuLoadLine = new ProgressBar.Line('#gpu-load-bar', {
        trailWidth: 1,
        strokeWidth: 3,
        easing: 'easeInOut',
        duration: 1000,
        color: '#FFEA82',
        trailColor: '#eee',
        from: { color: '#FFEA82' },
        to: { color: '#ED6A5A' },
        text: {
            style: {
                fontSize: '20px',
                fontFamily: 'Helvetica',
                position: 'absolute',
                right: '0',
                top: '30px',
                padding: 0,
                margin: 0,
                transform: null
            },
            autoStyleContainer: false
        },
        step: (state, bar) => {
            bar.setText('%' + Math.round(bar.value() * 100) + " usage");
            bar.path.setAttribute('stroke', state.color);
            bar.text.style.color = state.color;
        }
    });

    ipcRenderer.on('systemInfo', (event, systemInfo) => {

        const { cpuTemp, gpuTemp, cpuLoad, gpuLoad } = systemInfo;

        cpuTempSemiCircle.animate(cpuTemp / 100);
        cpuLoadLine.animate(cpuLoad / 100);

        gpuTempSemiCircle.animate(gpuTemp / 100);
        gpuLoadLine.animate(gpuLoad / 100);
    });

    ipcRenderer.on('cpuGpuNames', (event, cpuGpuNames) => {

        const { cpuName, gpuName } = cpuGpuNames;

        document.getElementById('cpu-title').innerText = cpuName;
        document.getElementById('gpu-title').innerText = gpuName;

    });
});