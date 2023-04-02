using OpenHardwareMonitor.Hardware;
using System.Threading.Tasks;

namespace OHMPort
{
    public class OHMPortClass
    {
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

        public async Task<object> getCpuTemperature(object input)
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
                            return sensor.Value.GetValueOrDefault();

                        }
                }
            }

            return 0f;
        }

        public async Task<object> getCpuUsage(object input)
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
                        if (sensor.SensorType == SensorType.Load && sensor.Name.Contains("CPU Total"))
                        {
                            return sensor.Value.GetValueOrDefault();
                        }
                }
            }

            return 0f;
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

        public async Task<object> getGpuTemperature(object input)
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
                            return sensor.Value.GetValueOrDefault();
                        }
                }
            }

            return 0f;
        }

        public async Task<object> getGpuUsage(object input)
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
                        if (sensor.SensorType == SensorType.Load && sensor.Name.Contains("GPU Core"))
                        {
                            return sensor.Value.GetValueOrDefault();
                        }
                }
            }

            return 0f;
        }
    }
}