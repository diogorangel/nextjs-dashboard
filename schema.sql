-- Tabela de Usuários (Necessária para autenticação)
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Tabela de Clientes (Customers)
CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL
);

-- Tabela de Faturas (Invoices)
CREATE TABLE invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id),
    amount INT NOT NULL, -- Valor em centavos
    status VARCHAR(255) NOT NULL, -- Ex: 'pending' ou 'paid'
    date DATE NOT NULL
);

-- Tabela de Receitas (Revenue)
CREATE TABLE revenue (
    month VARCHAR(4) NOT NULL UNIQUE, -- Ex: 'Jan', 'Feb'
    revenue INT NOT NULL
);