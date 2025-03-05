// import { IconButton, Stack } from "@mui/material";
import {
  Card,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useQuestionsStore } from "./store/questions";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { type Question as QuestionType } from "./types";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Footer } from "./Footer";

const getBackgroundColor = (info: QuestionType, index: number) => {
  const { userSelecterAnswer, correctAnswer } = info;

  // usuario no ha seleccionado nada todavia
  if (userSelecterAnswer == null) return "transparent";
  // si ya selecciono pero la solucion es incorrecta
  if (index !== correctAnswer && index !== userSelecterAnswer)
    return "transparent";
  // si es la solucion correcta
  if (index === correctAnswer) return "green";
  // si es la seleccion del usuario pero no es correcta
  if (index === userSelecterAnswer) return "red";
  // si no es ninguna de las anteriores
  return "transparent";
};

const Question = ({ info }: { info: QuestionType }) => {
  const selectAnswer = useQuestionsStore((state) => state.selectAnswer);

  const createHandleClick = (answerIndex: number) => () => {
    selectAnswer(info.id, answerIndex);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        bgcolor: "#222",
        padding: 2,
        textAlign: "left",
        marginTop: 4,
      }}
    >
      <Typography variant="h5">{info.question}</Typography>

      <SyntaxHighlighter language="javascript" style={atomOneDark}>
        {info.code}
      </SyntaxHighlighter>

      <List sx={{ bgcolor: "#333" }} disablePadding>
        {info.answers.map((answer, index) => (
          <ListItem key={index} disablePadding divider>
            <ListItemButton
              disabled={info.userSelecterAnswer != null}
              onClick={createHandleClick(index)}
              sx={{
                backgroundColor: getBackgroundColor(info, index),
              }}
            >
              <ListItemText
                primary={answer}
                sx={{
                  textAlign: "center",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export const Game = () => {
  const questions = useQuestionsStore((state) => state.questions);
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const goNextQuestion = useQuestionsStore((state) => state.goNextQuestion);
  const goPreviousQuestion = useQuestionsStore(
    (state) => state.goPreviousQuestion
  );

  const questionInfo = questions[currentQuestion];

  return (
    <>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="center"
      >
        <IconButton
          onClick={goPreviousQuestion}
          disabled={currentQuestion === 0}
        >
          <ArrowBackIos />
        </IconButton>
        {currentQuestion + 1} / {questions.length}
        <IconButton
          onClick={goNextQuestion}
          disabled={currentQuestion >= questions.length - 1}
        >
          <ArrowForwardIos />
        </IconButton>
      </Stack>
      <Question info={questionInfo} />

      <Footer />
    </>
  );
};
