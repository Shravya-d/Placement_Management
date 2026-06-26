const natural = require('natural');

/**
 * Preprocesses a skill string (lowercasing, camelCase splitting).
 */
const preprocessSkill = (skill) => {
    if (!skill) return '';
    let s = skill.trim();
    
    // Split camelCase (e.g., NodeJS -> Node JS) before lowercasing
    s = s.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    
    return s.toLowerCase();
};

/**
 * Normalizes by keeping alphanumeric characters, spaces, +, and #.
 */
const normalize = (processedSkill) => {
    return processedSkill.replace(/[^a-z0-9+#\s]/g, '').trim();
};

/**
 * Generates potential acronyms/abbreviations based on initials.
 */
const getAcronyms = (processedSkill) => {
    const words = processedSkill.split(/[^a-z0-9+#]+/).filter(Boolean);
    if (words.length <= 1) return [];

    const ac1 = words.map(w => w[0]).join('');
    
    const stopWords = new Set(['of', 'and', 'the', 'for', 'in', 'on', 'at', 'with', 'to']);
    const filteredWords = words.filter(w => !stopWords.has(w));
    const ac2 = filteredWords.map(w => w[0]).join('');
    
    return [ac1, ac2].filter(Boolean);
};

/**
 * Checks if two skills match semantically using:
 * 1. Exact match after normalization (with whitespaces removed)
 * 2. Acronym matching based on word initials
 * 3. Jaro-Winkler Similarity fallback with a 0.90 threshold
 */
exports.isSkillMatch = (skillA, skillB) => {
    if (!skillA || !skillB) return false;
    
    const pA = preprocessSkill(skillA);
    const pB = preprocessSkill(skillB);
    
    const nA = normalize(pA).replace(/\s+/g, '');
    const nB = normalize(pB).replace(/\s+/g, '');
    
    // 1. Direct exact match after normalization
    if (nA === nB) return true;
    
    // 2. Acronym match (e.g. "artificial intelligence" <-> "ai")
    const acsA = getAcronyms(pA);
    const acsB = getAcronyms(pB);
    if (acsA.includes(nB) || acsB.includes(nA)) return true;
    
    // 3. Jaro-Winkler Similarity with carefully selected threshold 0.90
    const jwScore = natural.JaroWinklerDistance(nA, nB, false);
    if (jwScore >= 0.90) return true;
    
    return false;
};

/**
 * Computes semantic similarity between student skills and job skills.
 * Range: 0 to 1. Returns 1 for exact or semantic matches, fallback to JW similarity for partial.
 */
exports.calculateSemanticScore = (studentSkills = [], jdSkills = []) => {
    if (!jdSkills || !jdSkills.length) return 1; // if JD has no skills, perfect match
    if (!studentSkills || !studentSkills.length) return 0;

    let matchWeight = 0;
    
    jdSkills.forEach(jdSkill => {
        let bestScore = 0;
        studentSkills.forEach(stSkill => {
            let score = 0;
            if (exports.isSkillMatch(stSkill, jdSkill)) {
                score = 1.0;
            } else {
                const nA = normalize(preprocessSkill(stSkill)).replace(/\s+/g, '');
                const nB = normalize(preprocessSkill(jdSkill)).replace(/\s+/g, '');
                score = natural.JaroWinklerDistance(nA, nB, false);
            }
            
            if (score > bestScore) {
                bestScore = score;
            }
        });
        matchWeight += bestScore;
    });

    const maxWeight = jdSkills.length;
    const finalScore = maxWeight > 0 ? (matchWeight / maxWeight) : 0;
    
    return Math.min(1, Math.max(0, finalScore));
};
