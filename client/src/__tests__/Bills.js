/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom'; // Ajout de jest-dom
import BillsUI from '../views/BillsUI.js';
import { bills } from '../fixtures/bills.js';
import { ROUTES_PATH } from '../constants/routes.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import Bills from '../containers/Bills.js';
import mockedBills from '../__mocks__/store.js';

import router from '../app/Router.js';

describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    test('Then bill icon in vertical layout should be highlighted', async () => {
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      );
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId('icon-window'));
      const windowIcon = screen.getByTestId('icon-window');
      // [BUG] Ajout d'un expect. Le routeur fixe la classe active-icon à layout-icon lorsqu'on arrive sur la page bills.
      expect(windowIcon).toHaveClass('active-icon');
    });

    test('Then bills should be ordered from earliest to latest', () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    test('Then if I click on the "New bill" button, I should navigate to the new bill page', async () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const onNavigate = jest.fn();
      const billsList = new Bills({
        document,
        onNavigate,
        store: mockedBills,
        localStorage: localStorageMock,
      });
      const newBillButton = screen.getByTestId('btn-new-bill');
      newBillButton.addEventListener('click', billsList.handleClickNewBill);
      newBillButton.click();
      expect(onNavigate).toHaveBeenCalledWith('#employee/bill/new');
    });

    test('Then if I click on the eye icon of the first bill, it should open a modal', async () => {
      const billsList = new Bills({
        document,
        onNavigate,
        store: mockedBills,
        localStorage: localStorageMock,
      });
      const icons = await waitFor(() => screen.getAllByTestId('icon-eye'));
      $.fn.modal = jest.fn();
      const handleClickIconEye = jest.fn(() => {
        billsList.handleClickIconEye(icons[0]);
      });
      icons[0].addEventListener('click', () => {
        handleClickIconEye();
      });

      icons[0].click();
      expect($.fn.modal).toHaveBeenCalled();
    });
    test('Then the getBills method should return  expected data', async () => {
      const billsList = new Bills({
        document,
        onNavigate,
        store: mockedBills,
        localStorage: localStorageMock,
      });
      const getBills = jest.fn(() => billsList.getBills());
      const generatedBills = await getBills();
      const billsMock = await mockedBills.bills().list();
      expect(generatedBills).toEqual(billsMock);
    });
  });
  
});
