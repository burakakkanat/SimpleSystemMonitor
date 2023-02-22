window.addEventListener('DOMContentLoaded', () => {
    myAPI.receive('systemInfo', (systemInfo) => {
        const cpuTempDisplay = document.getElementById('cpu-temperature');
        const gpuTempDisplay = document.getElementById('gpu-temperature');

        cpuTempDisplay.textContent = systemInfo.cpuTemp + ' °C';
        gpuTempDisplay.textContent = systemInfo.gpuTemp + ' °C';

        const cpuPercDisplay = document.getElementById('cpu-usage');
        const gpuPercDisplay = document.getElementById('gpu-usage');

        cpuPercDisplay.textContent = '%' + systemInfo.cpuLoad;
        gpuPercDisplay.textContent = '%' + systemInfo.gpuLoad;
    });
});