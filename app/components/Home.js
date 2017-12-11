import React, {Component} from 'react';
import {Link} from 'react-router';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import styles from './Home.css';

export default class Home extends Component {
  render() {
    const {login, user} = this.props;
    return (
      <div>
        {!user && <div className={styles.container} data-tid="container">
          <Typography type="display2" gutterBottom align="center">
            Welcome Topcoder Blockchain!
          </Typography>
          <Button raised color="accent" style={{marginTop: 20}} onClick={login}>Login</Button>
        </div>}
        {user && <div className={styles.buttons}>
          <Button
            component={Link}
            raised
            href="#/submit"
            className={styles.button}
          >Submit to challenge</Button>
          <Button raised className={styles.button}>Download submissions</Button>
        </div>}
      </div>
    );
  }
}
