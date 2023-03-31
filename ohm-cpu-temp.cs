using System;
using OpenHardwareMonitor.Hardware;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

public class Startup
{

    public async Task<object> Invoke(dynamic input)
    {

        var cpuTemp = 0f;

        Computer computer = new Computer()
        {
            CPUEnabled = true,
        };

        computer.Open();

        foreach (var hardware in computer.Hardware)
        {

            if (hardware.HardwareType != HardwareType.CPU)
            {
                continue;
            }

            hardware.Update();

            foreach (var sensor in hardware.Sensors)
            {
                if (sensor.SensorType == SensorType.Temperature && sensor.Name.Contains("CPU Package"))
                {

                    return 2000;
                }
            }
        }

        computer.Close();

        return 1000;
    }
}