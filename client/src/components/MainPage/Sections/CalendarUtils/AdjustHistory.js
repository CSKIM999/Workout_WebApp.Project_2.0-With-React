import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {
  Box,
  Fab,
  Grid,
  DialogTitle,
  Menu,
  MenuItem,
  GridList,
} from "@material-ui/core";
import AddIcon from "@mui/icons-material/Add";
import { Alert, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Stack } from "@mui/system";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getHistory } from "../../../../_actions/history_action";

export default function AdjustHistory(props) {
  const dispatch = useDispatch();
  const myRoutines = useSelector((state) => state.routine.myRoutines);
  const userId = useSelector((state) => state.user.userData._id);
  const [open, setOpen] = React.useState(false);
  const [Flag, setFlag] = React.useState(false);
  const [Hour, setHour] = React.useState(0);
  const [Minute, setMinute] = React.useState(0);
  const [Second, setSecond] = React.useState(0);
  const [Title, setTitle] = React.useState("");
  const [Detail, setDetail] = React.useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  const reset = (Adjust) => {
    setHour(Adjust ? Adjust.data.runtime[0] : 0);
    setMinute(Adjust ? Adjust.data.runtime[1] : 0);
    setSecond(Adjust ? Adjust.data.runtime[2] : 0);
    setTitle(Adjust ? Adjust.data.name : "");
    if (Adjust) {
      const newData = JSON.parse(JSON.stringify(Adjust.data.execute));
      setDetail([...newData]);
    } else {
      setDetail([{ name: "", progress: [0, 0] }]);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
    setFlag(false);
    if (!props.data) {
      reset();
    } else {
      reset(props);
    }
  };

  const handleFormation = (index) => {
    if (index === undefined) {
      setDetail([...Detail, { name: "", progress: [0, 0] }]);
    } else {
      const newDetail = [...Detail];
      newDetail.splice(index, 1);
      setDetail([...newDetail]);
    }
  };
  const handleOncardTitle = (value, index) => {
    var newDetail = [...Detail];
    newDetail[index].name = value;
    setDetail([...newDetail]);
  };
  const handleOncardExec = (value, index, target) => {
    var newDetail = [...Detail];
    newDetail[index].progress[target] = value * 1;
    setDetail([...newDetail]);
  };
  const ButtonType = () => {
    if (!props.data) {
      return (
        <Fab variant="extended" onClick={handleClickOpen}>
          루틴 추가
          <AddIcon />
        </Fab>
      );
    } else {
      return (
        <Button
          onClick={(event) => {
            event.stopPropagation();
            handleClickOpen();
          }}
          size="small"
        >
          수정
        </Button>
      );
    }
  };
  const timeGrid = (props) => {
    return (
      <Grid container alignItems="center" spacing={3}>
        <Grid item xs={2}>
          <TextField
            type={"number"}
            onChange={(event) => setHour(event.target.value * 1)}
            value={Hour}
            label={"시"}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            onChange={(event) => setMinute(event.target.value * 1)}
            type={"number"}
            value={Minute}
            label={"분"}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            onChange={(event) => setSecond(event.target.value * 1)}
            type={"number"}
            value={Second}
            label={"초"}
          />
        </Grid>
        <Grid item>
          <Button onClick={() => handleFormation()}>운동 추가</Button>
        </Grid>
      </Grid>
    );
  };
  const gridElement = (index) => {
    return (
      <Grid key={index} item container direction="row">
        <Grid>
          <TextField
            onChange={(event) => handleOncardTitle(event.target.value, index)}
            error={Flag && Detail[index].name === ""}
            helperText={
              Flag && Detail[index].name === "" ? "이름을 입력해주세요" : ""
            }
            value={Detail[index].name}
            label="운동 이름"
          />
        </Grid>
        <Grid>
          <TextField
            InputProps={{
              inputProps: { min: 0, max: `${Detail[index].progress[1]}` },
            }}
            type={"number"}
            label="수행 세트"
            onChange={(event) => handleOncardExec(event.target.value, index, 0)}
            value={Detail[index].progress[0]}
          />
        </Grid>
        <Grid>
          <TextField
            InputProps={{ inputProps: { min: 0, max: 20 } }}
            type={"number"}
            label="총 세트수"
            onChange={(event) => handleOncardExec(event.target.value, index, 1)}
            value={Detail[index].progress[1]}
          />
        </Grid>
        <Grid>
          <Button onClick={() => handleFormation(index)}>DEL</Button>
        </Grid>
      </Grid>
    );
  };

  const handleSave = () => {
    setFlag(true);
    const body = {
      writer: userId,
      date: props.date,
      name: Title,
      runtime: [Hour, Minute, Second],
      execute: Detail,
    };
    if (props.adj) {
      body._id = props.data._id;
      Axios.post("/api/history/modify", body).then((response) => {
        if (response.data.success) {
          dispatch(getHistory({ writer: userId }));
          handleClose();
        } else {
          alert("ERROR : HIST-MODIFY");
        }
      });
    } else {
      Axios.post("/api/history/", body).then((response) => {
        if (response.data.success) {
          dispatch(getHistory({ writer: userId }));
          handleClose();
        } else {
          alert("ERROR : HIST-SUBMIT");
        }
      });
    }
  };
  const handleMenu = (props) => {
    handleMenuClose();
    setHour(0);
    setMinute(0);
    setSecond(0);
    setFlag(false);
    setTitle(props.title);
    const beforeParse = props.detail.map((item) => {
      const c = item.contents.length;
      return { name: item.name, progress: [c, c] };
    });
    const newData = JSON.parse(JSON.stringify(beforeParse));
    setDetail([...newData]);
  };

  return (
    <div>
      {ButtonType()}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>운동 추가</DialogTitle>
        <DialogContent>
          <DialogContentText>추가/수정 내용을 작성해주세요</DialogContentText>
          <div>
            <Button
              id="basic-button"
              aria-controls={openMenu ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? "true" : undefined}
              onClick={handleMenuClick}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Dashboard
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {myRoutines &&
                myRoutines.map((item, index) => (
                  <MenuItem key={index} onClick={() => handleMenu(item)}>
                    {item.title}
                  </MenuItem>
                ))}
            </Menu>
          </div>
          <TextField
            autoFocus
            error={Title !== "" && Title.split(" ").join("").length === 0}
            helperText={
              Title.split(" ").join("").length === 0
                ? Title === ""
                  ? ""
                  : "최소 한 글자 이상 입력해주세요!!"
                : ""
            }
            margin="dense"
            value={Title}
            label="루틴 이름"
            fullWidth
            variant="standard"
            onChange={(event) => setTitle(event.target.value)}
          />
          <Grid container direction="column">
            {timeGrid()}
            {Detail && Detail.map((item, index) => gridElement(index))}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => handleSave()}>SAVE</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}