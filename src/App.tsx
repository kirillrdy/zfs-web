import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ListItemText from "@material-ui/core/ListItemText";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";

import { BrowserRouter as Router, Switch, Route, Link, useParams } from "react-router-dom";

const HBox = styled.div`
  display: flex;
  flex-direction: row;
`;
const VBox = styled.div`
  display: flex;
  flex-direction: column;
`;
const Main = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100vh;
`;

const useStyles = makeStyles({
  fixedHeight: {
    height: "100%"
  },
  list: {
    "overflow-y": "auto",
    height: "100%"
  }
});

interface Dataset {
  Name: string;
}

function servedHost() {
  return window.location.protocol + "//" + window.location.hostname;
}

function Datasets() {
  const [isLoading, setIsLoading] = useState(true);
  const [datasets, setDatasets] = useState(new Array<Dataset>());

  useEffect(() => {
    if (isLoading === false) return;
    (async () => {
      const response = await fetch(servedHost() + ":3000/datasets.json");
      let datasets = await response.json();

      setIsLoading(false);
      setDatasets(datasets);
    })();
  });
  const classes = useStyles();
  return (
    <div className={classes.list}>
      {datasets.map((dataset: Dataset) => (
        <ListItem key={dataset.Name} button >
          <Link  to={"/datasets/"+ dataset.Name }>
            <ListItemText primary={dataset.Name} />
          </Link>

          <Button> Foo</Button>
        </ListItem>
      ))}
    </div>
  );
}

function Navbar() {
  return (
    <VBox>
      <ListItem button>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Pools" />
      </ListItem>
      <Link to="/datasets">
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Datasets" />
        </ListItem>
      </Link>
      <ListItem button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Customers" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItem>

    </VBox>
  );
}

function Dataset() {
  let { dataset } = useParams();
  return (<h1>{dataset}</h1>)
}

// TODO error handling
// TODO spinner
// TODO prettier
function App() {
  return (
    <Router>
      <HBox>
        <Navbar />
        <Main>
          <Switch>
            <Route path="/datasets/:dataset+">
              <Dataset />
            </Route>
            <Route path="/datasets">
              <h1>Datasets</h1>
              <Datasets />
            </Route>
            <Route path="/">
              <h1>Datasets</h1>
              <Datasets />
            </Route>
          </Switch>
        </Main>
      </HBox>
    </Router>
  );
}

export default App;
