import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import HomePage from "./Sections/HomePage";
import RoutinePage from "./Sections/RoutinePage";
import CalendarPage from "./Sections/CalendarPage";

import { useDispatch, useSelector } from "react-redux";
import { getRoutine } from "../../_actions/routine_action";
import { getHistory } from "../../_actions/history_action";

const paddingBottom = "2rem";

const StyledTabs = withStyles({
  indicator: {
    top: 0,
  },
})((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ sx: { height: 5 }, children: <span /> }}
  />
));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function getId(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function MainPage() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  React.useEffect(() => {
    if (user.userData) {
      dispatch(getRoutine({ writer: user.userData._id }));
      dispatch(getHistory({ writer: user.userData._id }));
    }
  }, [user]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const WorkoutEnd = () => {
    setValue(2);
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
        style={{ paddingBottom: paddingBottom }}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Box>
            <HomePage swipe={WorkoutEnd} />
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <RoutinePage swipe={WorkoutEnd} />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <CalendarPage />
        </TabPanel>
      </SwipeableViews>
      <div style={{ position: "fixed", bottom: 0, width: "100%" }}>
        <AppBar position="static">
          <StyledTabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{ style: { background: "#42FF9F" } }}
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
            style={{ height: paddingBottom }}
          >
            <Tab label="???????????????" {...getId(0)} />
            <Tab label="??? ??????" {...getId(1)} />
            <Tab label="?????? ??????" {...getId(2)} />
          </StyledTabs>
        </AppBar>
      </div>
    </Box>
  );
}
