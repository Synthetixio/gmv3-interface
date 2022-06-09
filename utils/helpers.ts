export const compareAddress = (add1: string | null = '', add2: string | null = '') =>
	!!add1 && !!add2 && add1.toLowerCase() === add2.toLowerCase();

export const copyToClipboard = (value: string) => navigator.clipboard.writeText(value);
