import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyUserRepository } from "../repository/SurveyUserRepository";

class AnswerController {
    async execute(req: Request, res: Response){
        const { value } = req.params;
        const { u } = req.query;

        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const surveyUser = await surveyUserRepository.findOne({
            id: String(u)
        });

        if(!surveyUser){
            return res.status(400).json({error: "Survey to User doesnt exists"});
        }

        surveyUser.value = Number(value);

        await surveyUserRepository.save(surveyUser);

        return res.status(200).json(surveyUser);
    }
}

export {AnswerController}