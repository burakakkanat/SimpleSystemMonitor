using System;
using OpenHardwareMonitor.Hardware;

namespace PPSU_hwmonitor_c
{
    class Program
    {
        /**
         *  Define vars to hold stats
         **/

        // CPU Temp
        static float cpuTemp;
        // CPU Usage
        static float cpuUsage;
        // CPU Power Draw (Package)
        static float cpuPowerDrawPackage;
        // CPU Frequency
        static float cpuFrequency;
        // GPU Temperature
        static float gpuTemp;
        // GPU Usage
        static float gpuUsage;
        // GPU Core Frequency
        static float gpuCoreFrequency;
        // GPU Memory Frequency
        static float gpuMemoryFrequency;

        /**
         * Init OpenHardwareMonitor.dll Computer Object
         **/

        static Computer c = new Computer()
        {
            GPUEnabled = true,
            CPUEnabled = true,
            //RAMEnabled = true, // uncomment for RAM reports
            //MainboardEnabled = true, // uncomment for Motherboard reports
            //FanControllerEnabled = true, // uncomment for FAN Reports
            //HDDEnabled = true, // uncomment for HDD Report
        };

        /**
         * Pulls data from OHM
         **/

        static void ReportSystemInfo()
        {
            foreach (var hardware in c.Hardware)
            {

                if (hardware.HardwareType == HardwareType.CPU)
                {
                    // only fire the update when found
                    hardware.Update();

                    // loop through the data
                    foreach (var sensor in hardware.Sensors)
                        if (sensor.SensorType == SensorType.Temperature && sensor.Name.Contains("CPU Package"))
                        {
                            // store
                            cpuTemp = sensor.Value.GetValueOrDefault();
                            // print to console
                            System.Diagnostics.Debug.WriteLine("cpuTemp: " + sensor.Value.GetValueOrDefault());

                        }
                        else if (sensor.SensorType == SensorType.Load && sensor.Name.Contains("CPU Total"))
                        {
                            // store
                            cpuUsage = sensor.Value.GetValueOrDefault();
                            // print to console
                            System.Diagnostics.Debug.WriteLine("cpuUsage: " + sensor.Value.GetValueOrDefault());

                        }
                        else if (sensor.SensorType == SensorType.Power && sensor.Name.Contains("CPU Package"))
                        {
                            // store
                            cpuPowerDrawPackage = sensor.Value.GetValueOrDefault();
                            // print to console
                            System.Diagnostics.Debug.WriteLine("CPU Power Draw - Package: " + sensor.Value.GetValueOrDefault());


                        }
                        else if (sensor.SensorType == SensorType.Clock && sensor.Name.Contains("CPU Core #1"))
                        {
                            // store
                            cpuFrequency = sensor.Value.GetValueOrDefault();
                            // print to console
                            System.Diagnostics.Debug.WriteLine("cpuFrequency: " + sensor.Value.GetValueOrDefault());
                        }
                }

            }
        }

        static void Main(string[] args)
        {
            c.Open();

            // loop
            while (true)
            {
                ReportSystemInfo();
            }
        }
    }
}