// src/utils/getVersion.js
import { execSync } from 'child_process';

export function getTag() {
  try {
    // Get the latest commit hash
    const tag = execSync('git describe --tags --abbrev=0').toString().trim();
    return tag ? tag : 'No Tag';
  } catch (error) {
    console.error('Error fetching Git tag:', error);
    return 'No Tag';
  }
}
