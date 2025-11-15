// This is the Server Component Page that handles data loading and searching.

import Search from '@/app/ui/search';
import CustomersTable from '@/app/ui/customers/table';
import { Suspense } from 'react';

// IMPORTANT: Simplified types to ensure the code compiles
type Customer = {
    id: string;
    name: string;
    email: string;
    image_url: string;
    total_invoices: number;
    total_pending: string;
    total_paid: string;
};

// MOCK FUNCTION for fetchFilteredCustomers
const fetchFilteredCustomersMock = async (query: string = ''): Promise<Customer[]> => {
    // Simplified mock data
    const MOCKED_CUSTOMERS: Customer[] = [
        { id: 'cust1', name: 'Adriana Silva', email: 'adriana@example.com', image_url: 'https://placehold.co/40x40/50d71e/000000?text=AS', total_invoices: 5, total_pending: '$150.00', total_paid: '$450.00' },
        { id: 'cust2', name: 'Bruno Costa', email: 'bruno@example.com', image_url: 'https://placehold.co/40x40/3b82f6/ffffff?text=BC', total_invoices: 2, total_pending: '$0.00', total_paid: '$980.00' },
        { id: 'cust3', name: 'Carla Naves', email: 'carla@example.com', image_url: 'https://placehold.co/40x40/ef4444/ffffff?text=CN', total_invoices: 8, total_pending: '$320.00', total_paid: '$1,500.00' },
        { id: 'cust4', name: 'Daniel Mendes', email: 'daniel@example.com', image_url: 'https://placehold.co/40x40/f97316/ffffff?text=DM', total_invoices: 1, total_pending: '$50.00', total_paid: '$0.00' },
        { id: 'cust5', name: 'Elaine Santos', email: 'elaine@example.com', image_url: 'https://placehold.co/40x40/a855f7/ffffff?text=ES', total_invoices: 4, total_pending: '$0.00', total_paid: '$1,200.00' },
    ];
    
    // Simulate fetch delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const lowerCaseQuery = query.toLowerCase();

    // Simulate filtering logic
    return MOCKED_CUSTOMERS.filter(c => 
        c.name.toLowerCase().includes(lowerCaseQuery) || 
        c.email.toLowerCase().includes(lowerCaseQuery)
    );
}

// Loading Skeleton Component
const CustomersTableSkeleton = () => (
    <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 text-lg">Loading Customers...</p>
    </div>
);

// Define the expected props structure for the Page component
interface PageProps {
    searchParams?: {
        query?: string;
        page?: string;
    };
}

export default async function Page({ searchParams }: PageProps) {
    // The previous type error was likely caused by an incorrect type assertion 
    // or an incompatible type definition for PageProps elsewhere.
    // Defining the type inline or via an interface (PageProps) ensures compatibility.
    
    const query = searchParams?.query || '';
    // currentPage is kept for project structure alignment, even if not used in the mock
    const currentPage = Number(searchParams?.page) || 1; 

    // Load data in the Server Component
    let customers: Customer[] = [];
    try {
        // Use the mock function to guarantee functionality
        customers = await fetchFilteredCustomersMock(query); 
    } catch (e) {
        // Fallback to mock data if a real fetch failed
        console.error("Error fetching customer data, falling back to mock.", e);
        customers = await fetchFilteredCustomersMock(query); 
    }

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Customers</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                {/* Search is typically a Client Component */}
                <Search placeholder="Search for clients..." /> 
                <a 
                    href="/dashboard/customers/create"
                    className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    Add Customer
                </a>
            </div>
            
            <Suspense fallback={<CustomersTableSkeleton />}>
                {/* Pass the server-loaded data to the table component */}
                <CustomersTable customers={customers} /> 
            </Suspense>
        </div>
    );
}