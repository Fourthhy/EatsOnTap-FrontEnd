const extractSchoolHierarchy = (schoolData = []) => {
    const flatSections = [];
    const hierarchyTree = {};

    // Safety check: if data isn't loaded yet, return empty structures
    if (!schoolData || !Array.isArray(schoolData)) {
        return { flatSections: [], hierarchyTree: {} };
    }

    schoolData.forEach(cat => {
        const categoryName = cat.category;

        // Initialize Category
        if (!hierarchyTree[categoryName]) {
            hierarchyTree[categoryName] = {};
        }

        if (cat.levels) {
            cat.levels.forEach(lvl => {
                const levelName = lvl.level;

                // Initialize Level
                if (!hierarchyTree[categoryName][levelName]) {
                    hierarchyTree[categoryName][levelName] = [];
                }

                if (lvl.sections) {
                    lvl.sections.forEach(sec => {
                        const sectionName = sec.section;

                        // 1. Build Flat List
                        flatSections.push({
                            section: sectionName,
                            level: levelName,
                            category: categoryName,
                            adviser: sec.adviser || null, 
                            studentCount: sec.students ? sec.students.length : 0,
                            // Useful helper for searches:
                            searchLabel: `${sectionName} - ${levelName} (${categoryName})`
                        });

                        // 2. Build Tree
                        hierarchyTree[categoryName][levelName].push(sectionName);
                    });
                }
            });
        }
    });

    return { flatSections, hierarchyTree };
};

export {
    extractSchoolHierarchy
}