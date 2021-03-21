import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repository/UserRepository';

class UserController {
    async create(req: Request, res: Response) {
        const {name, email} = req.body;
        
        const userRepository = getCustomRepository(UserRepository);

        const userExists = await userRepository.findOne({email});
        if(userExists){
            return res.status(404).json({error: "User already exists"});
        }
        const user = userRepository.create({
            name,
            email
        });

        await userRepository.save(user);

        return res.status(200).json(user);
    }
}

export { UserController };
