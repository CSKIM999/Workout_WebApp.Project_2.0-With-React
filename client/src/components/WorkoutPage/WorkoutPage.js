import * as React from "react";
import * as Axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Stopwatch from "./WorkoutUtils/Stopwatch";
import ProgressCard from "./WorkoutUtils/ProgressCard";
import { getHistory } from "../../_actions/history_action";
import { Box, Grid } from "@mui/material";
import { FitnessCenter, Save } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});
const AppbarMargin = "4rem";

export default function WorkoutPage(props) {
  const myRoutine = useSelector((state) => state.routine.myRoutines).filter(
    (x) => x._id === props.id
  )[0];
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userData._id);
  const [open, setOpen] = React.useState(false);
  const [Timer, setTimer] = React.useState([]);
  const [Progress, setProgress] = React.useState(
    Array(myRoutine.detail.length).fill(0)
  );
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (Timer.every((item) => item <= 0)) {
      alert("시작 버튼을 눌러주세요");
      return;
    }
    const exec = myRoutine.detail.map((item, index) => {
      return {
        name: item.name,
        progress: [Progress[index], item.contents.length],
      };
    });
    const date = new Date();
    const body = {
      writer: userId,
      date: date,
      name: myRoutine.title,
      runtime: Timer,
      execute: exec,
    };
    Axios.post(process.env.REACT_APP_HOST + "/api/history/", body).then(
      (response) => {
        if (response.data.success) {
          dispatch(getHistory({ writer: userId }));
          handleClose();
          props.swipe();
        } else {
          alert("history Save Fail");
        }
      }
    );
  };

  return (
    <div>
      <Button
        color="primary"
        variant={"text"}
        size={"small"}
        onClick={handleClickOpen}
      >
        실행
        <FitnessCenter fontSize="small" />
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Box justifyContent="center" display="flex">
          <AppBar
            sx={{
              position: "stick",
              height: AppbarMargin,
              justifyContent: "center",
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {myRoutine.title}
              </Typography>
              <Button autoFocus color="inherit" onClick={() => handleSave()}>
                <Save fontSize="medium" />
                <Typography variant="subtitle2" sx={{ pl: 0.5 }}>
                  Save
                </Typography>
              </Button>
            </Toolbar>
          </AppBar>
          <Grid
            container
            direction="column"
            sx={{ p: 2, mt: AppbarMargin }}
            alignItems="center"
          >
            <Grid item>
              <Stopwatch timer={setTimer} />
            </Grid>
            <Grid item>
              <ProgressCard
                getProgress={setProgress}
                routine={myRoutine.detail}
              />
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </div>
  );
}
