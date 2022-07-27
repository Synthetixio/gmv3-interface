import { act, fireEvent, render, screen } from '@testing-library/react';
import { CopyClipboard } from './CopyClipboard';
import enJSON from 'i18n/en.json';

Object.assign(navigator, {
	clipboard: {
		writeText: () => {},
	},
});
jest.spyOn(navigator.clipboard, 'writeText');
jest.mock('react-i18next', () => ({
	useTranslation() {
		return {
			t: () => enJSON.components['copy-clipboard-message'],
		};
	},
}));
test('Copy Clipboard component should copy text unaltered to the clipboard', () => {
	render(<CopyClipboard text="test-text"></CopyClipboard>);
	act(() => {
		fireEvent.click(screen.getByTestId('copy-clipboard-svg'));
	});
	expect(navigator.clipboard.writeText).toBeCalledWith('test-text');
});