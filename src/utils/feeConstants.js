/**
 * Fee Chart for SciFun
 * Contains monthly fee structure for different boards and classes
 */

export const FEE_CHART = {
  "Maharashtra": {
    "1": 250,
    "2": 250,
    "3": 300,
    "4": 450,
    "5": 400,
    "6": 450,
    "7": 500,
    "8": 550,
    "9": 650,
    "10": 900
  },
  "CBSE": {
    "1": 350,
    "2": 350,
    "3": 350,
    "4": 400,
    "5": 550,
    "6": 600,
    "7": 700,
    "8": 800,
    "9": 1000,
    "10": 1500
  }
};

/**
 * Get fee for a specific board and class
 * @param {string} board - Board name ("Maharashtra" or "CBSE")
 * @param {string} classNumber - Class number as string ("1" to "10")
 * @returns {number|null} - Monthly fee amount or null if not found
 */
export const getFee = (board, classNumber) => {
  if (!FEE_CHART[board] || !FEE_CHART[board][classNumber]) {
    return null;
  }
  return FEE_CHART[board][classNumber];
};

/**
 * Check if a board and class combination is valid
 * @param {string} board - Board name
 * @param {string} classNumber - Class number as string
 * @returns {boolean} - True if valid combination
 */
export const isValidBoardClass = (board, classNumber) => {
  return getFee(board, classNumber) !== null;
};


