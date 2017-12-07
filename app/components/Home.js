// @flow
import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import styles from './Home.css';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <Typography type="display2" gutterBottom align="center">
            Welcome TopCoder Blockchain!
          </Typography>
        </div>
      </div>
    );
  }
}
