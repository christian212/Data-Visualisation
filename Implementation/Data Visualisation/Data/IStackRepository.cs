using System.Collections.Generic;

using Data_Visualisation.Models;

namespace Data_Visualisation.Data
{

    public interface IStackRepository
    {
        IEnumerable<Stack> Stacks { get; }

        void SaveStack(Stack stack);
        Stack DeleteStack(int stackID);
    }

}