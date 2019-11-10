import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListItemText from '@material-ui/core/ListItemText';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import Grid from '@material-ui/core/Grid';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

interface Dataset {
  Name: string
}

function clicked(dataset: Dataset) {
}

function servedHost() {
  return window.location.protocol + "//" + window.location.hostname
}


function Datasets() {

  const [isLoading, setIsLoading] = useState(true)
  const [datasets, setDatasets] = useState(new Array<Dataset>());

  useEffect( () => {
    if (isLoading === false) return;
    (async() => {
      const response = await fetch(servedHost() + ":3000/datasets.json")
      let datasets = await response.json()

      setIsLoading(false)
      setDatasets(datasets)


    })()
  })
return (
          <Grid item xs>
            <h1>Datasets</h1>
              {datasets.map((dataset: Dataset) =>
                  <ListItem key={dataset.Name} button onClick={e => clicked(dataset)}>
                      <ListItemText primary={dataset.Name}/>
                      <Button> Foo</Button>
                  </ListItem>
              )}
          </Grid>);

}


// TODO error handling
// TODO spinner
//TODO prettier
function App() {
    return (
      <Grid container spacing={10}>
        <Router>
          <Grid item>
              <ListItem button>
                  <ListItemIcon>
                      <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Datasets" />
              </ListItem>
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
              <ListItem button>
                  <ListItemIcon>
                      <LayersIcon />
                  </ListItemIcon>
                  <ListItemText primary="Integrations" />
              </ListItem>
          </Grid>
          <Grid item xs>
            <Switch>
              <Route path="/datasets">
                <Datasets />
             </Route>
              <Route path="/">
               <Datasets />
              </Route>
            </Switch>
          </Grid>
        </Router>
      </Grid>
    );
}

export default App;
