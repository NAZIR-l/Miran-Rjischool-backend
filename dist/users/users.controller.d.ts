import { UsersService } from './users.service.js';
import { User } from '../entities/user.entity.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    create(data: Partial<User>): Promise<User>;
    remove(id: string): Promise<{
        success: true;
    }>;
}
