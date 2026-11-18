/**
 * Prints an in-memory PDF with the browser's own dialog: loads it in a hidden
 * iframe and calls `print()` once it has rendered. The iframe and the object
 * URL are released a minute later (the print dialog keeps its own copy).
 */
export function printBlob(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const frame = document.createElement('iframe');
  frame.style.position = 'fixed';
  frame.style.width = '0';
  frame.style.height = '0';
  frame.style.border = '0';
  frame.src = url;
  frame.onload = () => {
    frame.contentWindow?.focus();
    frame.contentWindow?.print();
  };
  document.body.appendChild(frame);
  setTimeout(() => {
    frame.remove();
    URL.revokeObjectURL(url);
  }, 60_000);
}
