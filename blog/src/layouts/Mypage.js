import React from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from './Header';

const quizzes = [
    {
        quizId: 9,
        content: "다음 중 누가 더 통수가 강한가?",
        optionA: "토트넘 주장이며 영원히 토트넘에게 남겠다고 하다가 라이벌팀 아스날로 이적",
        optionB: "내 안의 작은아이가 맨유라고 속삭였다.",
        descriptionA: "토트넘 주장이며 영원히 토트넘에게 남겠다고 하다가 라이벌팀 아스날로 이적",
        descriptionB: "내 안의 작은아이가 맨유라고 속삭였다.",
        imageA: "https://d2dqkvm4dh281k.cloudfront.net/79edf8d8-1bc4-4fdb-9566-ca3638479f26.jpg",
        imageB: "https://d2dqkvm4dh281k.cloudfront.net/db7e6ec6-fd37-4e52-9188-48502f7f84ce.jpg",
        view: 29,
        preference: 2
    },
    {
        quizId: 10,
        content: "잠을 깨고 일어나니 갑자기 무인도다.\n옆에 물건이 1개 놓아져있다. 어떤 거였으면 좋겠나?",
        optionA: "도끼",
        optionB: "가스 토치",
        descriptionA: "도끼",
        descriptionB: "가스 토치",
        imageA: "https://d2dqkvm4dh281k.cloudfront.net/3050ec7c-c5d0-41f7-8ba6-80121b70f697.jpg",
        imageB: "https://d2dqkvm4dh281k.cloudfront.net/aec6dee6-29a4-44fb-a021-4c0119f54897.jpg",
        view: 11,
        preference: 0
    },
    {
        quizId: 11,
        content: "뭐가 더 머릿 속에 깊게 박혔나요?",
        optionA: "산왕 시해 사건",
        optionB: "1819시즌 챔스 뮌헨 vs 아약스전 \n뮐러 쿵푸킥",
        descriptionA: "산왕 시해 사건",
        descriptionB: "1819시즌 챔스 뮌헨 vs 아약스전 \n뮐러 쿵푸킥",
        imageA: "https://d2dqkvm4dh281k.cloudfront.net/c0e8007f-26f7-470d-b831-2ec3fd7d56f8.png",
        imageB: "https://d2dqkvm4dh281k.cloudfront.net/9e188e58-6195-43b8-bd77-e63b4fe00ff0.jpg",
        view: 7,
        preference: 0
    },
    {
        quizId: 12,
        content: "뭐가 더 좋니",
        optionA: "백수인데 돈 받기",
        optionB: "열일하는 직장인",
        descriptionA: "백수인데 돈 받기",
        descriptionB: "열일하는 직장인",
        imageA: "https://d2dqkvm4dh281k.cloudfront.net/9169e043-0a2d-4032-8584-a6fa7fb2beeb.jpg",
        imageB: "https://d2dqkvm4dh281k.cloudfront.net/cbb59e59-39cc-42be-aa39-db15aa77f039.jpg",
        view: 5,
        preference: 0
    },
    {
        quizId: 13,
        content: "string",
        optionA: "string",
        optionB: "string",
        descriptionA: "string",
        descriptionB: "string",
        imageA: "https://d2dqkvm4dh281k.cloudfront.net/45a6f679-2f7d-486a-8f10-0968353505a7.jpg",
        imageB: "https://d2dqkvm4dh281k.cloudfront.net/5db34904-459e-42a6-ba50-6f99a7687ac5.jpg",
        view: 4,
        preference: 0
    }
];

const MyPage = () => {
    return (
        <>
            <Header />
            <div>
                <Typography variant="h4" gutterBottom>
                    내가 작성한 퀴즈
                </Typography>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>퀴즈 목록</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Quiz</TableCell>
                                        <TableCell>Image A</TableCell>
                                        <TableCell>Description A</TableCell>
                                        <TableCell>Image B</TableCell>
                                        <TableCell>Description B</TableCell>
                                        <TableCell>Likes</TableCell>
                                        <TableCell>Views</TableCell>
                                    </TableRow>
                                </TableHead>
                                <tbody>
                                    {quizzes.map((quiz) => (
                                        <TableRow key={quiz.quizId}>
                                            <TableCell>{quiz.content}</TableCell>
                                            <TableCell>
                                                {quiz.imageA && (
                                                    <img src={quiz.imageA} alt="Option A" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                                                )}
                                            </TableCell>
                                            <TableCell>{quiz.descriptionA}</TableCell>
                                            <TableCell>
                                                {quiz.imageB && (
                                                    <img src={quiz.imageB} alt="Option B" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                                                )}
                                            </TableCell>
                                            <TableCell>{quiz.descriptionB}</TableCell>
                                            <TableCell>{quiz.preference}</TableCell>
                                            <TableCell>{quiz.view}</TableCell>
                                        </TableRow>
                                    ))}
                                </tbody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </
                Accordion>
            </div>
        </>
    );
};

export default MyPage;
