/* eslint-disable no-param-reassign */
// libs
import React, { useState, useEffect } from 'react';
import {
  IoIosCard,
  IoIosCash,
  IoIosPizza,
  IoIosWallet,
  IoIosEasel,
} from 'react-icons/io';
// global Components
import Header from '../../components/Header';

// local components
import { Container, CardContainer, Card, TableContainer } from './styles';

// assets
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

// app
import api from '../../services/api';
import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Response {
  transactions: Transaction[];
  balance: Balance;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get<Response>('/transactions');
      const {
        transactions: resTransactions,
        balance: resBalance,
      } = response.data;

      const formattedTransactions = resTransactions.map(transaction => {
        transaction.formattedValue =
          transaction.type === 'income'
            ? formatValue(transaction.value)
            : `- ${formatValue(transaction.value)}`;
        transaction.formattedDate = formatDate(transaction.created_at);
        return transaction;
      });

      setTransactions(formattedTransactions);
      setBalance(resBalance);
    }

    loadTransactions();
  }, []);

  // useEffect(() => {
  //   api.get('/transactions').then(response => {
  //     setTransactions(response.data.transactions);
  //     setBalance(response.data.balance);
  //   });
  // }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          {balance && (
            <>
              <Card>
                <header>
                  <p>Entradas</p>
                  <img src={income} alt="Income" />
                </header>
                <h1 data-testid="balance-income">
                  {formatValue(balance.income)}
                </h1>
              </Card>
              <Card>
                <header>
                  <p>Saídas</p>
                  <img src={outcome} alt="Outcome" />
                </header>
                <h1 data-testid="balance-outcome">
                  {formatValue(balance.outcome)}
                </h1>
              </Card>
              <Card total>
                <header>
                  <p>Total</p>
                  <img src={total} alt="Total" />
                </header>
                <h1 data-testid="balance-total">
                  {formatValue(balance.total)}
                </h1>
              </Card>
            </>
          )}
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {/* <tr>
                <td className="title">Computer</td>
                <td className="income">R$ 5.000,00</td>
                <td>Sell</td>
                <td>20/04/2020</td>
              </tr>
              <tr>
                <td className="title">Website Hosting</td>
                <td className="outcome">- R$ 1.000,00</td>
                <td>
                  <div className="category">
                    <div>
                      <IoIosCard size="25px" />
                    </div>
                    <div>Hosting</div>
                  </div>
                </td>
                <td>19/04/2020</td>
              </tr> */}

              {transactions &&
                transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.formattedValue}
                    </td>
                    <td>
                      <div className="category">
                        <div>
                          <IoIosCard size="25px" />
                        </div>
                        <div>{transaction.category.title}</div>
                      </div>
                    </td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
