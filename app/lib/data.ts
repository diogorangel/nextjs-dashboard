import { unstable_noStore as noStore } from 'next/cache';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

// IMPORTANTE: MOCK DE DADOS
// Estes dados são fixos e não requerem conexão com o PostgreSQL.

// Simulação de Clientes (Adicionados 15 clientes)
const MOCKED_CUSTOMERS: CustomersTableType[] = [
  { id: 'cust1', name: 'Adriana Silva', email: 'adriana@exemplo.com', image_url: '/customers/adriana.png', total_invoices: 5, total_pending: '$150,00', total_paid: 'R$450,00' },
  { id: 'cust2', name: 'Bruno Costa', email: 'bruno@exemplo.com', image_url: '/customers/bruno.png', total_invoices: 2, total_pending: '$0,00', total_paid: 'R$980,00' },
  { id: 'cust3', name: 'Carla Naves', email: 'carla@exemplo.com', image_url: '/customers/carla.png', total_invoices: 8, total_pending: '$320,00', total_paid: 'R$1.500,00' },
  { id: 'cust4', name: 'Daniel Mendes', email: 'daniel@exemplo.com', image_url: '/customers/daniel.png', total_invoices: 1, total_pending: '$50,00', total_paid: 'R$0,00' },
  { id: 'cust5', name: 'Elaine Santos', email: 'elaine@exemplo.com', image_url: '/customers/elaine.png', total_invoices: 4, total_pending: '$0,00', total_paid: 'R$1.200,00' },
  { id: 'cust6', name: 'Fábio Reis', email: 'fabio@exemplo.com', image_url: '/customers/fabio.png', total_invoices: 6, total_pending: '$100,00', total_paid: 'R$600,00' },
  { id: 'cust7', name: 'Glória Pires', email: 'gloria@exemplo.com', image_url: '/customers/gloria.png', total_invoices: 3, total_pending: '$0,00', total_paid: 'R$750,00' },
  { id: 'cust8', name: 'Henrique Vaz', email: 'henrique@exemplo.com', image_url: '/customers/henrique.png', total_invoices: 7, total_pending: '$210,00', total_paid: 'R$1.100,00' },
  { id: 'cust9', name: 'Iara Lima', email: 'iara@exemplo.com', image_url: '/customers/iara.png', total_invoices: 2, total_pending: '$0,00', total_paid: 'R$300,00' },
  { id: 'cust10', name: 'João Melo', email: 'joao@exemplo.com', image_url: '/customers/joao.png', total_invoices: 10, total_pending: '$500,00', total_paid: 'R$2.000,00' },
  { id: 'cust11', name: 'Kelly Souza', email: 'kelly@exemplo.com', image_url: '/customers/kelly.png', total_invoices: 5, total_pending: '$50,00', total_paid: 'R$800,00' },
  { id: 'cust12', name: 'Luís Gomes', email: 'luis@exemplo.com', image_url: '/customers/luis.png', total_invoices: 3, total_pending: '$0,00', total_paid: 'R$400,00' },
  { id: 'cust13', name: 'Márcia Alves', email: 'marcia@exemplo.com', image_url: '/customers/marcia.png', total_invoices: 9, total_pending: '$450,00', total_paid: 'R$1.350,00' },
  { id: 'cust14', name: 'Nuno Ferreira', email: 'nuno@exemplo.com', image_url: '/customers/nuno.png', total_invoices: 1, total_pending: '$0,00', total_paid: 'R$250,00' },
  { id: 'cust15', name: 'Olívia Rocha', email: 'olivia@exemplo.com', image_url: '/customers/olivia.png', total_invoices: 4, total_pending: '$80,00', total_paid: 'R$600,00' },
];

// Mapeamento para CustomerField (necessário para fetchCustomers)
const MOCKED_CUSTOMER_FIELDS: CustomerField[] = MOCKED_CUSTOMERS.map(c => ({
    id: c.id,
    name: c.name,
}));

// Simulação de Faturas (para fetchFilteredInvoices)
const MOCKED_INVOICES_TABLE: InvoicesTable[] = [
    // 6 faturas pagas
    { id: 'inv1', customer_id: 'cust1', name: 'Adriana Silva', email: 'adriana@exemplo.com', image_url: '/customers/adriana.png', amount: 45000, date: '2023-11-01', status: 'paid' },
    { id: 'inv2', customer_id: 'cust2', name: 'Bruno Costa', email: 'bruno@exemplo.com', image_url: '/customers/bruno.png', amount: 98000, date: '2023-10-25', status: 'paid' },
    { id: 'inv3', customer_id: 'cust5', name: 'Elaine Santos', email: 'elaine@exemplo.com', image_url: '/customers/elaine.png', amount: 120000, date: '2023-10-20', status: 'paid' },
    { id: 'inv4', customer_id: 'cust7', name: 'Glória Pires', email: 'gloria@exemplo.com', image_url: '/customers/gloria.png', amount: 75000, date: '2023-10-15', status: 'paid' },
    { id: 'inv5', customer_id: 'cust9', name: 'Iara Lima', email: 'iara@exemplo.com', image_url: '/customers/iara.png', amount: 30000, date: '2023-10-10', status: 'paid' },
    { id: 'inv6', customer_id: 'cust12', name: 'Luís Gomes', email: 'luis@exemplo.com', image_url: '/customers/luis.png', amount: 40000, date: '2023-10-05', status: 'paid' },
    // 4 faturas pendentes
    { id: 'inv7', customer_id: 'cust3', name: 'Carla Naves', email: 'carla@exemplo.com', image_url: '/customers/carla.png', amount: 32000, date: '2023-10-01', status: 'pending' },
    { id: 'inv8', customer_id: 'cust4', name: 'Daniel Mendes', email: 'daniel@exemplo.com', image_url: '/customers/daniel.png', amount: 5000, date: '2023-09-25', status: 'pending' },
    { id: 'inv9', customer_id: 'cust6', name: 'Fábio Reis', email: 'fabio@exemplo.com', image_url: '/customers/fabio.png', amount: 10000, date: '2023-09-20', status: 'pending' },
    { id: 'inv10', customer_id: 'cust8', name: 'Henrique Vaz', email: 'henrique@exemplo.com', image_url: '/customers/henrique.png', amount: 21000, date: '2023-09-15', status: 'pending' },
];

// Simulação de Dados para as Cartas (Cards)
const MOCKED_CARD_DATA = {
  numberOfCustomers: MOCKED_CUSTOMERS.length,
  numberOfInvoices: MOCKED_INVOICES_TABLE.length,
  totalPaidInvoices: formatCurrency(MOCKED_INVOICES_TABLE.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)),
  totalPendingInvoices: formatCurrency(MOCKED_INVOICES_TABLE.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0)),
};

// Simulação de Receita (Revenue)
const MOCKED_REVENUE: Revenue[] = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1500 },
  { month: 'Mar', revenue: 3000 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 4000 },
  { month: 'Jun', revenue: 3500 },
  { month: 'Jul', revenue: 4500 },
  { month: 'Aug', revenue: 3800 },
  { month: 'Sep', revenue: 4200 },
  { month: 'Oct', revenue: 5000 },
  { month: 'Nov', revenue: 4800 },
  { month: 'Dec', revenue: 5500 },
];

// Simulação de Faturas Recentes
const MOCKED_LATEST_INVOICES: LatestInvoiceRaw[] = MOCKED_INVOICES_TABLE
  .slice(0, 5) // Pegar as 5 mais recentes
  .map(i => ({
    id: i.id,
    amount: i.amount,
    name: i.name,
    email: i.email,
    image_url: i.image_url,
  }));


export async function fetchRevenue() {
  noStore();
  try {
    // Simulação de atraso
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // RETORNA DADOS MOCKADOS
    return MOCKED_REVENUE;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data (using mock).');
  }
}

export async function fetchLatestInvoices() {
  try {
    // Simulação de atraso
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const latestInvoices = MOCKED_LATEST_INVOICES.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    // RETORNA DADOS MOCKADOS
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices (using mock).');
  }
}

export async function fetchCardData() {
  try {
    // Simulação de atraso
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // RETORNA DADOS MOCKADOS
    return MOCKED_CARD_DATA;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data (using mock).');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  // Simula o filtro e paginação sobre os dados mockados
  const filtered = MOCKED_INVOICES_TABLE.filter(invoice =>
    invoice.name.toLowerCase().includes(query.toLowerCase()) ||
    invoice.email.toLowerCase().includes(query.toLowerCase()) ||
    invoice.status.toLowerCase().includes(query.toLowerCase())
  );
  
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(offset, offset + ITEMS_PER_PAGE);

  return paginated;
}

export async function fetchInvoicesPages(query: string) {
  const filteredCount = MOCKED_INVOICES_TABLE.filter(invoice =>
    invoice.name.toLowerCase().includes(query.toLowerCase()) ||
    invoice.email.toLowerCase().includes(query.toLowerCase()) ||
    invoice.status.toLowerCase().includes(query.toLowerCase())
  ).length;
  
  return Math.ceil(filteredCount / ITEMS_PER_PAGE);
}

export async function fetchInvoiceById(id: string) {
  // Busca a fatura mockada
  const invoiceData = MOCKED_INVOICES_TABLE.find(i => i.id === id);

  if (!invoiceData) {
     throw new Error('Mocked invoice not found.');
  }

  const invoice: InvoiceForm = {
    id: invoiceData.id,
    customer_id: invoiceData.customer_id,
    amount: invoiceData.amount / 100, // Converte centavos para reais/dólares (para o formulário de edição)
    status: invoiceData.status as 'pending' | 'paid',
  };

  return invoice;
}

export async function fetchCustomers() {
  // RETORNA A LISTA COMPLETA DE CLIENTES PARA O FORMULÁRIO
  return MOCKED_CUSTOMER_FIELDS;
}

export async function fetchFilteredCustomers(query: string) {
  // Simula o filtro e retorna os dados completos do cliente (com totais)
  const filtered = MOCKED_CUSTOMERS.filter(customer =>
    customer.name.toLowerCase().includes(query.toLowerCase()) ||
    customer.email.toLowerCase().includes(query.toLowerCase())
  );

  return filtered;
}

export async function getUser(email: string) {
  const user: User = { id: '12345-mock-id', name: 'Mock User', email: 'user@mock.com', password: '' };
  if (email === user.email) {
      return user;
  }
  return undefined as unknown as User;
}

export async function fetchUsers(){
  return [] as unknown as User[];
}