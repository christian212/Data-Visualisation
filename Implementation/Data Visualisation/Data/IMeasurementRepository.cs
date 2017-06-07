using System.Collections.Generic;

using Data_Visualisation.Models;

namespace Data_Visualisation.Data
{

    public interface IMeasurementRepository
    {
        IEnumerable<Measurement> Measurements { get; }

        void SaveMeasurement(Measurement measurement);
        Measurement DeleteMeasurement(int measurementID);
    }

}