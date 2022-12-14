import * as React from "react";
import Typography from "@mui/material/Typography";
import DetailPage from "../../DetailPage/DetailPage";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Collapse,
  Divider,
  Stack,
} from "@mui/material";
import RemoveBtn from "../../utils/RemoveBtn";

export default function WorkoutCards(props) {
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = (panel) => {
    if (expanded !== panel) {
      setExpanded(panel);
    } else {
      setExpanded("false");
    }
  };
  const handleWorkoutData = (item, data, index) => {
    switch (item[0]) {
      case "weight":
        const fontSize = "0.9rem";
        return (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ px: 2 }}
          >
            <Grid item xs={7}>
              <Typography>{index + 1} SET</Typography>
            </Grid>
            <Grid item xs={5}>
              <Stack direction="row">
                <Typography fontSize={fontSize}>{data[0]} KG X </Typography>
                <Typography fontSize={fontSize}>{data[1]} 개</Typography>
              </Stack>
            </Grid>
          </Grid>
        );
      case "count":
        return (
          <Grid container justifyContent="space-between" sx={{ px: 2 }}>
            <Grid item xs={4}>
              <Typography>{index + 1} SET</Typography>
            </Grid>
            <Grid item xs="auto">
              <Typography>{data[1]} 개</Typography>
            </Grid>
          </Grid>
        );
      case "time":
        return (
          <Grid container justifyContent="space-between" sx={{ px: 2 }}>
            <Grid item xs={7}>
              <Typography>{index + 1} SET</Typography>
            </Grid>
            <Grid item xs="auto">
              <Typography>
                {data[1]} {item[2]}
              </Typography>
            </Grid>
          </Grid>
        );
      default:
        break;
    }
  };
  return (
    <Stack spacing={1}>
      {props.detail &&
        props.detail.map((item, index) => (
          <Card key={index}>
            <CardActionArea
              expanded={expanded === `panel${index + 1}` ? "true" : undefined}
              onClick={() => handleExpandClick(`panel${index + 1}`)}
              aria-expanded={expanded}
            >
              <CardContent>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  direction="row"
                >
                  <Grid item>
                    <Typography variant="h5" component="div">
                      {item.name}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" color="text.secondary">
                      {item.contents.length} Workouts
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <Collapse
                in={expanded === `panel${index + 1}` ? true : undefined}
                timeout="auto"
                unmountOnExit
                sx={{ pb: 2 }}
              >
                <Divider textAlign="right">Set Detail</Divider>
                <CardContent>
                  {item.contents.map((workout, workoutIndex) => (
                    <Box key={workoutIndex}>
                      {handleWorkoutData(item.option, workout, workoutIndex)}
                    </Box>
                  ))}
                </CardContent>
                <Divider />
              </Collapse>
            </CardActionArea>
            <Grid container justifyContent="flex-end" direction="row">
              <RemoveBtn event={() => props.setRoutine(index, null)} />
              <DetailPage
                adj={index}
                data={item}
                setRoutine={props.setRoutine}
              />
            </Grid>
          </Card>
        ))}
    </Stack>
  );
}
