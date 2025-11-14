/**
 * Calculate dream streaks from a set of unique UTC dates
 */

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
}

/**
 * Get UTC date string (YYYY-MM-DD) from a Date object
 */
export function getUTCDateString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate streaks from an array of UTC date strings
 */
export function calculateStreaks(dateStrings: string[]): StreakData {
  if (dateStrings.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalDays: 0 };
  }

  // Sort dates chronologically
  const sortedDates = [...new Set(dateStrings)].sort();
  const totalDays = sortedDates.length;

  // Convert to Date objects for easier comparison
  const dates = sortedDates.map(d => new Date(d + 'T00:00:00Z'));
  
  // Calculate current streak (working backwards from today)
  const today = new Date();
  const todayUTC = getUTCDateString(today);
  let currentStreak = 0;

  // Check if there's an entry today or yesterday (to keep streak alive)
  const lastEntryDate = sortedDates[sortedDates.length - 1];
  const lastEntry = new Date(lastEntryDate + 'T00:00:00Z');
  const daysSinceLastEntry = Math.floor((today.getTime() - lastEntry.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceLastEntry <= 1) {
    // Start counting backwards from the last entry
    currentStreak = 1;
    let checkDate = new Date(lastEntry);
    
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const prevDate = new Date(sortedDates[i] + 'T00:00:00Z');
      const dayDiff = Math.floor((checkDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        currentStreak++;
        checkDate = prevDate;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prevDate = dates[i - 1];
    const currDate = dates[i];
    const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalDays,
  };
}
