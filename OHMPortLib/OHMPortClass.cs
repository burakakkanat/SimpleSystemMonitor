using OpenHardwareMonitor.Hardware;
using System.Threading.Tasks;

namespace OHMPort
{
    public class OHMPortClass
    {
        float cpuUsage;
        float cpuTemp;
        float gpuUsage;
        float gpuTemp;

        public async Task<object> getSystemInfo(object input)
        {
            setCpuInfo();
            setGpuInfo();

            float[] infoArray = new float[4];
            infoArray[0] = cpuUsage;
            infoArray[1] = cpuTemp;
            infoArray[2] = gpuUsage;
            infoArray[3] = gpuTemp;

            return infoArray;
        }

        public async Task<object> getCpuName(object input)
        {
            Computer computer = new Computer()
            {
                CPUEnabled = true,
            };

            computer.Open();

            foreach (var hardware in computer.Hardware)
            {
                if (hardware.HardwareType == HardwareType.CPU)
                {
                    return hardware.Name;
                }
            }

            return "CPU";
        }
        public async Task<object> getGpuName(object input)
        {
            Computer computer = new Computer()
            {
                GPUEnabled = true,
            };

            computer.Open();

            foreach (var hardware in computer.Hardware)
            {
                if (hardware.HardwareType == HardwareType.GpuAti || hardware.HardwareType == HardwareType.GpuNvidia)
                {
                    return hardware.Name;
                }
            }

            return "GPU";
        }

        public void setCpuInfo()
        {
            Computer computer = new Computer()
            {
                CPUEnabled = true,
            };

            computer.Open();

            foreach (var hardware in computer.Hardware)
            {
                if (hardware.HardwareType == HardwareType.CPU)
                {
                    hardware.Update();

                    foreach (var sensor in hardware.Sensors)
                        if (sensor.SensorType == SensorType.Temperature && sensor.Name.Contains("CPU Package"))
                        {
                           cpuTemp = sensor.Value.GetValueOrDefault();

                        } else if (sensor.SensorType == SensorType.Load && sensor.Name.Contains("CPU Total"))
                        {
                            cpuUsage = sensor.Value.GetValueOrDefault();
                        }
                }
            }
        }

        public void setGpuInfo()
        {
            Computer computer = new Computer()
            {
                GPUEnabled = true,
            };

            computer.Open();

            foreach (var hardware in computer.Hardware)
            {
                if (hardware.HardwareType == HardwareType.GpuAti || hardware.HardwareType == HardwareType.GpuNvidia)
                {
                    hardware.Update();

                    foreach (var sensor in hardware.Sensors)
                        if (sensor.SensorType == SensorType.Temperature && sensor.Name.Contains("GPU Core"))
                        {
                            gpuTemp = sensor.Value.GetValueOrDefault();
                        } else if (sensor.SensorType == SensorType.Load && sensor.Name.Contains("GPU Core"))
                        {
                            gpuUsage = sensor.Value.GetValueOrDefault();
                        }
                }
            }
        }
    }
}