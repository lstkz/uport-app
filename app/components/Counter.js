// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Counter.css';
const {dialog} = require('electron').remote;

console.log(require('electron').remote);
const openDialog = () => console.log(dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']}))

class Counter extends Component {
  props: {
    increment: () => void,
    incrementIfOdd: () => void,
    incrementAsync: () => void,
    decrement: () => void,
    counter: number
  };

  render() {
    const { increment, incrementIfOdd, incrementAsync, decrement, counter } = this.props;
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={`counter ${styles.counter}`} data-tid="counter">
          {counter}
        </div>
        <div className={styles.btnGroup}>
          <button className={styles.btn} onClick={increment} data-tclass="btn">
            <i className="fa fa-plus" />
          </button>
          <button className={styles.btn} onClick={decrement} data-tclass="btn">
            <i className="fa fa-minus" />
          </button>
          <button className={styles.btn} onClick={incrementIfOdd} data-tclass="btn">odd</button>
          <button className={styles.btn} onClick={() => incrementAsync()} data-tclass="btn">async</button>
          <button className={styles.btn} onClick={openDialog} data-tclass="btn">show file dialog</button>
          <input type="file" value="f" />
        </div>
      </div>
    );
  }
}

export default Counter;
