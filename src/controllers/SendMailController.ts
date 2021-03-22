import { Request, response, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repository/SurveyRepository";
import { SurveyUserRepository } from "../repository/SurveyUserRepository";
import { UserRepository } from "../repository/UserRepository";
import sendMailService from "../services/sendMailService";
import { resolve } from 'path';
import { AppError } from "../errors/AppError";

class SendMailController {
    async execute(req: Request, res: Response){
        const { email, survey_id } = req.body;

        const userRepository = getCustomRepository(UserRepository);
        const surveyRepository = getCustomRepository(SurveyRepository);
        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const userExists = await userRepository.findOne({email});
        const surveyExists = await surveyRepository.findOne({id: survey_id});

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        if(!userExists) {
            throw new AppError("User doesn't exists");
        }
        if(!surveyExists) {
            throw new AppError("Survey doesn't exists");
        }

        const surveyUserExists = await surveyUserRepository.findOne({
            where: {user_id: userExists.id, value: null}
        });

        const variables = {
            name: userExists.name,
            title: surveyExists.title,
            description: surveyExists.description,
            id: "",
            link: process.env.URL_MAIL,
        }
        
        if(surveyUserExists){
            variables.id = surveyUserExists.id;
            await sendMailService.execute(email, surveyExists.title, variables, npsPath);
            return res.status(200).json(surveyUserExists);
        }

        const surveyUser = surveyUserRepository.create({
            user_id: userExists.id,
            survey_id
        });
        await surveyUserRepository.save(surveyUser);
        variables.id = surveyUser.id;

        await sendMailService.execute(email, surveyExists.title, variables, npsPath);

        return res.status(201).json(surveyUser);
    }
}

export { SendMailController }