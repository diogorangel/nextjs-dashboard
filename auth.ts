import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
// REMOVIDAS: As importações de '@vercel/postgres' (sql, createClient) não são mais necessárias.
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

// Tipo de usuário mockado (a senha é apenas uma string, não um hash)
interface MockedUser extends User {
    mockedPassword?: string;
}

// MOCANDO a função getUser para retornar um usuário fixo.
// A senha aqui é a senha Pura (123456)
async function getUserMocked(email: string): Promise<MockedUser | undefined> {
    const mockedUser: MockedUser = {
        id: '12345-mock-id',
        name: 'Mock User',
        email: 'user@mock.com',
        // Armazenamos a senha pura para simular a comparação abaixo
        password: '$2a$10$w7kQ8/z4uQ6/F0Jz/7XgO.s6Y5w8w8.oA3jD1H0v2G', // Hash de "123456" para manter a estrutura, mas usaremos uma comparação simples no authorize
        mockedPassword: '123456', // Senha pura para a lógica de comparação simples
    };

    if (email === mockedUser.email) {
        return mockedUser;
    }
    return undefined;
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
                    // MUDANÇA: Chama a função mockada
                    const user = await getUserMocked(email);

                    if (!user) {
                        console.log('User not found (mocked)');
                        return null;
                    }

                    // Apenas compara a senha pura com a senha que esperamos (123456)
                    const passwordsMatch = (password === user.mockedPassword);
                    // Se você quiser ser mais "realista", pode usar:
                    // const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) {
                        // Retorna o objeto User (sem a propriedade mockedPassword)
                        const { mockedPassword, ...userToReturn } = user;
                        return userToReturn as User;
                    }
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});