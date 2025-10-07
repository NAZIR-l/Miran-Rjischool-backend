import { Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOneById(id: string): Promise<User>;
    createUser(data: Partial<User>): Promise<User>;
    deleteUser(id: string): Promise<void>;
}
