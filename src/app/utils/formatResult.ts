export const formatResult = (result: HTMLElement | string): string => {
  if (typeof result === "string" && /^https?:\/\/[^\s]+$/.test(result)) {
    return `<a href="${result}" target="_blank" rel="noopener noreferrer">${result}</a>`;
  }

  if (result instanceof HTMLElement) {
    return result.outerHTML;
  }

  return result.toString();
};
