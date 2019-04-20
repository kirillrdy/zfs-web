import React, { Component } from 'react';
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

interface Dataset {
  Name: string
}

interface Props {
}

interface State {
  datasets: Array<Dataset>
}

class App extends Component<Props, State> {

  componentWillMount() {
    this.setState({datasets: []})
  }

  async componentDidMount() {
    const response = await fetch("http://localhost:3000/datasets.json")
    let datasets = await response.json()
    this.setState({datasets: datasets})
  }



  render() {
    return (
      <div className="App">
        <Grid container direction="column">
          <Grid item>
            foo
          </Grid>

          <Grid>
            bar
          </Grid>
        </Grid>
        <div>
          {this.state.datasets.map(dataset => <ListItem button><ListItemText primary={dataset.Name}/></ListItem>)}
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
        </div>
      </div>
    );
  }
}

export default App;
