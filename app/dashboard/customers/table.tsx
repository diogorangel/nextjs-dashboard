'use client'; // Mantido: Permite o uso de event handlers (como onError e onClick)

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react';

// NOTE: Não importamos o "Image from 'next/image';" pois estamos usando a tag <img> nativa.

// Tipos simplificados (assumindo que CustomersTableType está em outro arquivo)
type CustomersTableType = {
    id: string;
    name: string;
    email: string;
    image_url: string;
    total_invoices: number;
    total_pending: string;
    total_paid: string;
};

// Sub-componentes definidos no arquivo Client para garantir que o onClick funcione
function UpdateCustomer({ id }: { id: string }) {
  return (
    <a href={`/dashboard/customers/${id}/edit`} className="rounded-md border p-2 hover:bg-gray-100">
      <PencilIcon className="w-5" />
    </a>
  );
}
function DeleteCustomer({ id }: { id: string }) {
  return (
    // onClick funciona no Client Component
    <button className="rounded-md border p-2 hover:bg-gray-100" onClick={() => console.log(`Simulação: Deletar ${id}`)}>
      <span className="sr-only">Deletar</span>
      <TrashIcon className="w-5" />
    </button>
  );
}

// Este componente é a Tabela de Clientes completa, recebendo os dados do servidor.
export default function CustomersTable({
  customers,
}: {
  customers: CustomersTableType[];
}) {

  if (!customers || customers.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 text-lg">Nenhum cliente encontrado. Adicione clientes ou ajuste o filtro.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className={`text-2xl`}>Clientes</h1> 
      </div>
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {/* Visualização para Mobile */}
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          {/* CORRIGIDO: Usando <img> nativo (28x28) */}
                          <img
                            src={customer.image_url}
                            className="mr-2 rounded-full"
                            width={28}
                            height={28}
                            alt={`${customer.name}'s profile picture`}
                            onError={(e) => {
                                // Fallback em caso de erro no carregamento da imagem
                                e.currentTarget.src = 'https://placehold.co/28x28/cccccc/000000?text=NP';
                            }}
                          />
                          <p>{customer.name}</p>
                        </div>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                        <p className="text-xl font-medium">
                          {customer.total_invoices} Faturas
                        </p>
                        <p>{customer.total_paid} Pago / {customer.total_pending} Pendente</p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <UpdateCustomer id={customer.id} /> 
                        <DeleteCustomer id={customer.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Visualização para Desktop */}
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Cliente
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total de Faturas
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Pago
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Pendente
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Editar</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          {/* CORRIGIDO: Usando <img> nativo (40x40) */}
                          <img
                            src={customer.image_url}
                            className="rounded-full"
                            width={40}
                            height={40}
                            alt={`${customer.name}'s profile picture`}
                            onError={(e) => {
                                // Fallback em caso de erro no carregamento da imagem
                                e.currentTarget.src = 'https://placehold.co/40x40/cccccc/000000?text=NP';
                            }}
                          />
                          <p>{customer.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
                        {customer.email}
                      </td>
                      <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
                        {customer.total_invoices}
                      </td>
                      <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
                        {customer.total_paid}
                      </td>
                      <td className="whitespace-nowrap bg-white px-3 py-5 text-sm group-last-of-type:rounded-md">
                        {customer.total_pending}
                      </td>
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex justify-end gap-3">
                          <UpdateCustomer id={customer.id} />
                          <DeleteCustomer id={customer.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}