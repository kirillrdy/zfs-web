import React, { useState, useEffect } from 'react';
import './App.css';
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
import Paper from '@material-ui/core/Paper';

interface Dataset {
  Name: string
}

function clicked(dataset: Dataset) {
}


//TODO prettier
function App() {

  const [datasets, setDatasets] = useState(new Array<Dataset>());

  useEffect( () => {
    (async() => {
      const response = await fetch("http://localhost:3000/datasets.json")
      let datasets = await response.json()
      setDatasets(datasets)
    })()
  })


    return (
      <div className="App">
        <Grid container spacing={24}>
          <Grid item>
              <ListItem button>
                  <ListItemIcon>
                      <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
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
          <Grid item xs={6}>
              {datasets.map(dataset =>
                  <ListItem key={dataset.Name} button onClick={e => clicked(dataset)}>
                      <ListItemText primary={dataset.Name}/>
                  </ListItem>
              )}
          </Grid>
        </Grid>
        <div>
        </div>
      </div>
    );
}

export default App;
