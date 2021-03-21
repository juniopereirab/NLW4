import { Request, response, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repository/SurveyRepository";
import { SurveyUserRepository } from "../repository/SurveyUserRepository";
import { UserRepository } from "../repository/UserRepository";

class SendMailController {
    async execute(req: Request, res: Response){
        const { email, survey_id } = req.body;

        const userRepository = getCustomRepository(UserRepository);
        const surveyRepository = getCustomRepository(SurveyRepository);
        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const userExists = await userRepository.findOne({email});
        const surveyExists = await surveyRepository.findOne({id: survey_id});

        if(!userExists) {
            return res.status(400).json({error: "User doesn't exists"});
        }
        if(!surveyExists) {
            return res.status(400).json({error: "Survey doesn't exists"});
        }

        const surveyUser = surveyUserRepository.create({
            user_id: userExists.id,
            survey_id
        });

        await surveyUserRepository.save(surveyUser);

        return res.status(201).json(surveyUser);
    }
}

export { SendMailController }