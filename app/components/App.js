import React, {Component} from 'react';
import {withStyles} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Drawer from 'material-ui/Drawer';
import List, {ListItem, ListItemText} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import withRoot from '../components/withRoot';

const styles = () => ({
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

class App extends Component {
  state = {menuOpen: false};

  closeDrawer = () => this.setState({menuOpen: false});
  openDrawer = () => this.setState({menuOpen: true});

  render() {
    const {classes, user, logout} = this.props;
    return (
      <div className={classes.root}>
        <Drawer open={this.state.menuOpen} onRequestClose={this.closeDrawer}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.closeDrawer}
            onKeyDown={this.closeDrawer}
          >
            <div className={classes.list}>
              <List>
                <ListItem button>
                  <ListItemText primary="Submit to challenge" />
                </ListItem>
                <ListItem button>
                  <ListItemText primary="Download submissions" />
                </ListItem>
                <Divider />
                <ListItem button onClick={logout}>
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            </div>
          </div>
        </Drawer>
        <AppBar position="static">
          <Toolbar>
            {user && <IconButton className={classes.menuButton} color="contrast" aria-label="Menu" onClick={this.openDrawer}>
              <MenuIcon />
            </IconButton>}
            <Typography type="title" color="inherit" className={classes.flex}>
              Topcoder blockchain
            </Typography>
            {user && <div>Welcome {user.name}</div>}
          </Toolbar>
        </AppBar>
        {this.props.children}
      </div>
    );
  }
}


export default withRoot(withStyles(styles)(App));
