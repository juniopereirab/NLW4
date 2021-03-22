import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveyUserRepository } from "../repository/SurveyUserRepository";

class NpsController {
    async execute(req: Request, res: Response) {
        const { survey_id } = req.params;

        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const surveyUsers = await surveyUserRepository.find({
            survey_id,
            value: Not(IsNull())
        });

        const detractor = surveyUsers.filter(
            (survey) => survey.value >= 0 && survey.value <= 6
        ).length;

        const promotor = surveyUsers.filter(
            (survey) => survey.value >= 9 && survey.value <= 10
        ).length;

        const totalAnswer = surveyUsers.length;

        const calculate = ((promotor - detractor) / totalAnswer) * 100;

        return res.status(200).json({
            detractor,
            promotor,
            calculate
        });
    }
}

export {NpsController}