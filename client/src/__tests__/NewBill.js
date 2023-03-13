/**
 * @jest-environment jsdom
 */
import { localStorageMock } from '../__mocks__/localStorage.js';
import { screen } from '@testing-library/dom';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';
import userEvent from '@testing-library/user-event';
import mockedBills from '../__mocks__/store.js';

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    test('Then I can put a png file in the file input', () => {
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      );
      const html = NewBillUI();
      document.body.innerHTML = html;
      const newBill = new NewBill({
        document,
        onNavigate: jest.fn(),
        store: mockedBills,
        localStorage: localStorageMock,
      });
      const input = screen.getByTestId('file');
      const file = new File(['pngfile'], 'image.png', { type: 'image/png' });
      userEvent.upload(input, file);
      expect(input.files[0]).toStrictEqual(file);
    });

    test('Then I put a pdf file in the file input, an alert should be displayed', () => {
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      );
      const html = NewBillUI();
      document.body.innerHTML = html;
      const newBill = new NewBill({
        document,
        onNavigate: jest.fn(),
        store: mockedBills,
        localStorage: localStorageMock,
      });
      const input = screen.getByTestId('file');
      const file = new File(['pdfFile'], 'file.pdf', {
        type: 'application/pdf',
      });
      const alertFunction = jest
        .spyOn(window, 'alert')
        .mockImplementation(() => {});
      userEvent.upload(input, file);
      expect(alertFunction).toHaveBeenCalled();
    });
    test('Then i put a pdf file on the file input, the submit button should be disabled', () => {
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      );
      const html = NewBillUI();
      document.body.innerHTML = html;
      const newBill = new NewBill({
        document,
        onNavigate: jest.fn(),
        store: mockedBills,
        localStorage: localStorageMock,
      });
      const input = screen.getByTestId('file');
      const file = new File(['pdfFile'], 'file.pdf', {
        type: 'application/pdf',
      });
      userEvent.upload(input, file);
      const submitButton = screen.getByTestId('btn-send-bill');
      expect(submitButton.disabled).toBeTruthy();
    });
  });
});
