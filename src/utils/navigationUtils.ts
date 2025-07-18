/**
 * Scrolls the page smoothly to an element with the given ID.
 * @param elementId The ID of the element to scroll to.
 */
export function scrollToElementById(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  } else {
    console.warn(`[scrollToElementById] Element with ID "${elementId}" not found.`);
  }
} 