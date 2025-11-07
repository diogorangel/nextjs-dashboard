import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
// IMPORTANTE: Importa 'createClient' para conexões diretas com o Render
import { createClient } from '@vercel/postgres'; 
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

// Usa a variável NON_POOLING (definida no .env.local)
const connectionString = process.env.POSTGRES_URL_NON_POOLING;

async function getUser(email: string): Promise<User | undefined> {
    // 1. Verificação da String de Conexão
    if (!connectionString) {
        console.error('Missing database connection environment variable.');
        throw new Error('Database connection configuration error.');
    }

    // 2. Configuração SSL/TLS para Render (resolve o erro EPROTO)
    let clientConfig: { connectionString: string; ssl?: { rejectUnauthorized: boolean } } = {
        connectionString,
    };
    clientConfig.ssl = {
        rejectUnauthorized: false,
    };

    // 3. Cria e Conecta o Cliente
    const client = createClient(clientConfig);

    try {
        await client.connect(); 
        const user = await client.query<User>(`SELECT * FROM users WHERE email=$1`, [email]);
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    } finally {
        // 4. Fechamento ESSENCIAL
        await client.end(); 
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});