// src/arduino/export.ts
function sanitizeFilename(name) {
  return name.replace(/[<>:"/\\|?*]/g, "-").replace(/\s+/g, "_").substring(0, 100);
}
function downloadIno(code, projectName) {
  const blob = new Blob([code], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${sanitizeFilename(projectName)}.ino`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
function getInoBlob(code) {
  return new Blob([code], { type: "text/plain" });
}

export {
  downloadIno,
  getInoBlob
};
//# sourceMappingURL=chunk-JLLEDKFM.js.map