export class AuthUser {
    _id!: string;
    nom!: string;
    image?: string;
    email!: string;
    isAdmin!: boolean;
}
export class AuthResponse {
    token!: string;
    user!: AuthUser;
}