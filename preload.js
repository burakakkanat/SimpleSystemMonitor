const { contextBridge, ipcRenderer } = require('electron')
var ProgressBar = require('progressbar.js');

contextBridge.exposeInMainWorld('myAPI', {
    receive: (channel, callback) => {
        ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
});

window.addEventListener('DOMContentLoaded', () => {

    const cpuTempSemiCircle = new ProgressBar.SemiCircle('#cpu-temperature-bar', {
        strokeWidth: 10,
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 10,
        easing: 'easeInOut',
        duration: 1400,
        svgStyle: null,
        text: {
            alignToBottom: false
        },
        from: { color: '#FFEA82' },
        to: { color: '#ED6A5A' },
        // Set default step function for all animate calls
        step: (state, bar) => {
            bar.path.setAttribute('stroke', state.color);
            const value = Math.round(bar.value() * 100) + '°C';
            bar.setText(value);
            bar.text.style.color = state.color;
        }
    });

    var cpuLoadLine = new ProgressBar.Line('#cpu-load-bar', {
        strokeWidth: 4,
        easing: 'easeInOut',
        duration: 1400,
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 1,
        svgStyle: { width: '100%', height: '100%' },
        from: { color: '#FFEA82' },
        to: { color: '#ED6A5A' },
        text: {
            style: {
                color: '#999',
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
            bar.setText(Math.round(bar.value() * 100) + ' %');
            bar.path.setAttribute('stroke', state.color);
            bar.text.style.color = state.color;
        }
    });

    const gpuTempSemiCircle = new ProgressBar.SemiCircle('#gpu-temperature-bar', {
        strokeWidth: 10,
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 10,
        easing: 'easeInOut',
        duration: 1400,
        svgStyle: null,
        svgStyle: null, text: {
            alignToBottom: false
        },
        from: { color: '#FFEA82' },
        to: { color: '#ED6A5A' },
        // Set default step function for all animate calls
        step: (state, bar) => {
            bar.path.setAttribute('stroke', state.color);
            const value = Math.round(bar.value() * 100) + '°C';
            bar.setText(value);
            bar.text.style.color = state.color;
        }
    });

    var gpuLoadLine = new ProgressBar.Line('#gpu-load-bar', {
        strokeWidth: 4,
        easing: 'easeInOut',
        duration: 1400,
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 1,
        svgStyle: { width: '100%', height: '100%' },
        from: { color: '#FFEA82' },
        to: { color: '#ED6A5A' },
        text: {
            style: {
                color: '#999',
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
            bar.setText(Math.round(bar.value() * 100) + ' %');
            bar.path.setAttribute('stroke', state.color);
            bar.text.style.color = state.color;
        }
    });

    ipcRenderer.on('systemInfo', (event, systemInfo) => {
        // Extract the CPU and GPU temperature and usage values from the systemInfo object
        const { cpuTemp, gpuTemp, cpuLoad, gpuLoad } = systemInfo;

        cpuTempSemiCircle.animate(cpuTemp / 100);
        cpuLoadLine.animate(cpuLoad / 100);

        gpuTempSemiCircle.animate(gpuTemp / 100);
        gpuLoadLine.animate(gpuLoad / 100);
    });
});