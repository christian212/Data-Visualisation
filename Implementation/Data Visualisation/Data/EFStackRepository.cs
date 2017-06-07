using System.Collections.Generic;
using System.Linq;

using Data_Visualisation.Models;

namespace Data_Visualisation.Data
{

    public class EFStackRepository : IStackRepository
    {
        private ApplicationDbContext Context;

        public EFStackRepository(ApplicationDbContext context)
        {
            Context = context;
        }

        public IEnumerable<Stack> Stacks => Context.Stacks;

        public void SaveStack(Stack stack)
        {
            if (stack.StackID == 0)
            {
                Context.Stacks.Add(stack);
            }

            else
            {
                Stack dbEntry = Context.Stacks
                    .FirstOrDefault(p => p.StackID == stack.StackID);

                if (dbEntry != null)
                {
                    dbEntry.Name = stack.Name;
                    dbEntry.Category = stack.Category;
                    dbEntry.Description = stack.Description;
                    dbEntry.CellCount = stack.CellCount;
                    dbEntry.CircuitType = stack.CircuitType;
                    dbEntry.Creation = stack.Creation;
                    dbEntry.Modification = stack.Modification;

                    dbEntry.StackCells = stack.StackCells;
                    dbEntry.Measurements = stack.Measurements;
                }
            }

            Context.SaveChanges();
        }

        public Stack DeleteStack(int stackID)
        {
            Stack dbEntry = Context.Stacks
                .FirstOrDefault(p => p.StackID == stackID);

            if (dbEntry != null)
            {
                Context.Stacks.Remove(dbEntry);
                Context.SaveChanges();
            }

            return dbEntry;
        }
    }

}