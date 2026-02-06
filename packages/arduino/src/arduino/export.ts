/**
 * Arduino code export utilities
 * Handles exporting generated code as .ino files
 */

/**
 * Sanitize a string for use as a filename
 */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, '_')
    .substring(0, 100);
}

/**
 * Export Arduino code as a .ino file and trigger download
 */
export function downloadIno(code: string, projectName: string): void {
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(projectName)}.ino`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get Arduino code as a Blob (for future verify/upload use)
 */
export function getInoBlob(code: string): Blob {
  return new Blob([code], { type: 'text/plain' });
}