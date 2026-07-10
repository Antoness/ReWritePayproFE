import { useMemo } from 'react';

/**
 * Hook to compute hierarchical dropdown options based on combinations.
 * @param {Array} combinations - List of valid combinations from backend (e.g. { division, unit, position, employeeType, branch })
 * @param {Object} selected - Current selected values (e.g. { division, unit, position, employeeType, branch })
 * @returns {Object} - Computed unique lists for each field based on the hierarchy
 */
export const useCascadingDropdowns = (combinations, selected) => {
  const { division, unit, position, employeeType, branch } = selected;

  return useMemo(() => {
    if (!combinations || !Array.isArray(combinations)) {
      return { divisions: [], units: [], positions: [], employeeTypes: [], branches: [] };
    }

    // Always show all divisions
    const divisionsSet = new Set();
    
    // Units filtered by Division (if selected)
    const unitsSet = new Set();
    
    // Positions filtered by Division & Unit
    const positionsSet = new Set();
    
    // EmployeeTypes and Branches could be independent or dependent on unit/position.
    // Based on user request, it's hierarchical: Division -> Unit -> Position -> EmployeeType -> Branch
    const employeeTypesSet = new Set();
    const branchesSet = new Set();

    combinations.forEach((combo) => {
      // 1. Division is always collected
      if (combo.division) divisionsSet.add(combo.division);

      // 2. Unit is valid if no division is selected OR if division matches
      const isDivisionMatch = !division || combo.division === division;
      if (isDivisionMatch && combo.unit) {
        unitsSet.add(combo.unit);
      }

      // 3. Position is valid if division & unit match
      const isUnitMatch = isDivisionMatch && (!unit || combo.unit === unit);
      if (isUnitMatch && combo.position) {
        positionsSet.add(combo.position);
      }

      // 4. Employee Type is valid if div & unit & position match
      const isPositionMatch = isUnitMatch && (!position || combo.position === position);
      const empType = combo.employeeType || combo.employeetype;
      if (isPositionMatch && empType) {
        employeeTypesSet.add(empType);
      }

      // 5. Branch is valid if all above match
      const isEmployeeTypeMatch = isPositionMatch && (!employeeType || empType === employeeType);
      if (isEmployeeTypeMatch && combo.branch) {
        branchesSet.add(combo.branch);
      }
    });

    return {
      divisions: Array.from(divisionsSet).sort(),
      units: Array.from(unitsSet).sort(),
      positions: Array.from(positionsSet).sort(),
      employeeTypes: Array.from(employeeTypesSet).sort(),
      branches: Array.from(branchesSet).sort()
    };
  }, [combinations, division, unit, position, employeeType, branch]);
};
