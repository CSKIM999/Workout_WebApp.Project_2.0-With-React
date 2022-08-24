import { Box, Button, Card, CardContent, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import { CardActionArea, Grid } from "@mui/material";

export default function ProgressCard(props) {
  const [activeStep, setActiveStep] = React.useState(
    Array(props.routine.length).fill(0)
  );

  const handleNext = (index) => {
    const newStep = [...activeStep];
    newStep[index]++;
    setActiveStep([...newStep]);
    props.getProgress([...newStep]);
  };

  const handleBack = (index) => {
    const newStep = [...activeStep];
    newStep[index]--;
    setActiveStep([...newStep]);
    props.getProgress([...newStep]);
  };

  const handleContent = (option, itemIndex) => {
    const setCount = activeStep[itemIndex];
    const nowSetContents = props.routine[itemIndex].contents;
    var returnWord = "";
    try {
      if (option[0] === "weight") {
        // 무게 + 카운트

        const weight = nowSetContents[setCount][0];
        const count = nowSetContents[setCount][1];
        returnWord = `${weight} Kg x ${count} 회`;
        // console.log(weight, "Kg x", count, " 회");
      } else if (option[0] === "count") {
        // only Count
        const count = nowSetContents[setCount][1];
        returnWord = `${count} 회`;
      } else {
        // only time
        const timeUnit = option[2];
        const count = nowSetContents[setCount][1];
        returnWord = `${count} ${timeUnit}`;
      }
    } catch (err) {
      returnWord = "< SET DONE >";
    }
    return <Typography variant="body1">{returnWord}</Typography>;
  };

  return (
    <Box>
      {props.routine &&
        props.routine.map((item, index) => {
          const contentsLength = item.contents.length;
          return (
            <Card key={index} sx={{ Width: 500 }}>
              <CardActionArea
                component="span"
                onClick={() =>
                  activeStep[index] !== contentsLength && handleNext(index)
                }
                // disabled={activeStep[index] === contentsLength}
              >
                <CardContent>
                  <Typography variant="h4">CHECK FOR ROUTINE</Typography>
                  <Typography variant="h4">{item.name}</Typography>
                  {/* <Button onClick={() => handleContent(item.option, index)}>
                    Check
                  </Button> */}
                  {handleContent(item.option, index)}
                </CardContent>
                <MobileStepper
                  variant="progress"
                  steps={contentsLength + 1}
                  position="static"
                  activeStep={activeStep[index]}
                  sx={{}}
                  nextButton={
                    <Button
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleBack(index);
                      }}
                      disabled={activeStep[index] === 0}
                    >
                      <BackspaceOutlinedIcon fontSize="small" sx={{ p: 1 }} />{" "}
                      -1 Set
                    </Button>
                  }
                />
              </CardActionArea>
            </Card>
          );
        })}
    </Box>
  );
}
