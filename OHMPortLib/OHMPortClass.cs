using OpenHardwareMonitor.Hardware;
using System.Linq;
using System.Threading.Tasks;

namespace OHMPort
{
    public class OHMPortClass
    {
        private readonly Computer computer;

        public OHMPortClass()
        {
            computer = new Computer();
            computer.Open();
            computer.CPUEnabled = true;
            computer.GPUEnabled = true;
        }

        public async Task<object> GetSystemInfo(object input)
        {
            await UpdateHardwareAsync();
            return new float[] { cpuUsage, cpuTemp, gpuUsage, gpuTemp };
        }

        private async Task UpdateHardwareAsync()
        {
            await Task.Run(() =>
            {
                try
                {
                    foreach (var hardware in computer.Hardware)
                    {
                        hardware.Update();

                        if (hardware.HardwareType == HardwareType.CPU)
                        {
                            foreach (var sensor in hardware.Sensors)
                            {
                                if (sensor.SensorType == SensorType.Temperature && sensor.Name.Contains("CPU Package"))
                                {
                                    cpuTemp = (float)sensor.Value;
                                }
                                else if (sensor.SensorType == SensorType.Load && sensor.Name.Contains("CPU Total"))
                                {
                                    cpuUsage = (float)sensor.Value;
                                }
                            }
                        }
                        else if (hardware.HardwareType == HardwareType.GpuAti || hardware.HardwareType == HardwareType.GpuNvidia)
                        {
                            foreach (var sensor in hardware.Sensors)
                            {
                                if (sensor.SensorType == SensorType.Temperature && sensor.Name.Contains("GPU Core"))
                                {
                                    gpuTemp = (float)sensor.Value;
                                }
                                else if (sensor.SensorType == SensorType.Load && sensor.Name.Contains("GPU Core"))
                                {
                                    gpuUsage = (float)sensor.Value;
                                }
                            }
                        }
                    }
                }
                catch
                {
                    // Handle any exceptions that may occur when accessing the hardware data.
                }
            });
        }

        public async Task<object> GetCpuName(object input)
        {
            Computer cpt = new Computer()
            {
                CPUEnabled = true,
            };

            cpt.Open();

            foreach (var hardware in cpt.Hardware)
            {
                if (hardware.HardwareType == HardwareType.CPU)
                {
                    return hardware.Name;
                }
            }

            return "CPU";
        }

        public async Task<object> GetGpuName(object input)
        {
            Computer cpt = new Computer()
            {
                GPUEnabled = true,
            };

            cpt.Open();

            foreach (var hardware in cpt.Hardware)
            {
                if (hardware.HardwareType == HardwareType.GpuAti || hardware.HardwareType == HardwareType.GpuNvidia)
                {
                    return hardware.Name;
                }
            }

            return "GPU";
        }

        private float cpuUsage;
        private float cpuTemp;
        private float gpuUsage;
        private float gpuTemp;
    }
}
