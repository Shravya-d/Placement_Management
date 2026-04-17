const natural = require('natural');

/**
 * Computes semantic similarity between student skills and job skills.
 * Range: 0 to 1
 */
exports.calculateSemanticScore = (studentSkills = [], jdSkills = []) => {
    if (!jdSkills.length) return 1; // if JD has no skills, perfect match
    if (!studentSkills.length) return 0;

    // We can tokenize and stem both arrays
    const tokenizer = new natural.WordTokenizer();
    
    // Custom normalizer to strip punctuation and handle exact match edge-cases
    const normalize = (skill) => skill.toLowerCase().replace(/[^a-z0-9]/g, '');

    let studentTokens = studentSkills.map(normalize);
    let jdTokens = jdSkills.map(normalize);

    // Keep unique tokens
    studentTokens = [...new Set(studentTokens)];
    jdTokens = [...new Set(jdTokens)];

    let matchWeight = 0;
    
    jdTokens.forEach(jdToken => {
        let bestScore = 0;
        studentTokens.forEach(stToken => {
            const score = natural.JaroWinklerDistance(jdToken, stToken, false);
            if (score > bestScore) {
                bestScore = score;
            }
        });
        matchWeight += bestScore;
    });

    const maxWeight = jdTokens.length;
    const finalScore = maxWeight > 0 ? (matchWeight / maxWeight) : 0;
    
    // Formatting to max 1, min 0.
    return Math.min(1, Math.max(0, finalScore));
};
