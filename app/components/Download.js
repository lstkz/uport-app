import React, {Component} from 'react';
import moment from 'moment';
import Stepper, {Step, StepLabel} from 'material-ui/Stepper';
import TextField from 'material-ui/TextField';
import {CircularProgress} from 'material-ui/Progress';
import Button from 'material-ui/Button';
import List, {ListItem, ListItemText} from 'material-ui/List';
import ErrorDialog from './ErrorDialog';
import styles from './Download.css';


const steps = ['Pick a challenge', 'Enter key', 'download'];

export default class Download extends Component {

  canPrev = () => {
    const {step} = this.props;
    return step !== 0;
  };

  canNext = () => {
    const {step, challengeId, privateKey} = this.props;
    switch (step) {
      case 0:
        return !!challengeId;
      case 1:
        return !!privateKey;
      default:
        return true;
    }
  };

  renderNext = () => {
    const {step, fetchSubmissions, checkKey} = this.props;
    switch (step) {
      case 0:
        return <Button raised color="primary" disabled={!this.canNext()} onClick={fetchSubmissions}>Next</Button>;
      case 1:
        return <Button raised color="primary" disabled={!this.canNext()} onClick={checkKey}>Next</Button>;
      default:
        return null;
    }
  };

  render() {
    const {
      challengeId, setChallengeId, isLoading, error, lastError, closeError,
      submissions, download, step, goPrevStep, setPrivateKey, privateKey,
    } = this.props;
    return (
      <div>
        <ErrorDialog error={lastError} show={error} closeError={closeError} />
        <Stepper activeStep={step}>
          {steps.map((label, index) => {
            const props = {};

            props.completed = index < step;
            return (
              <Step key={label} {...props}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {isLoading && <div className={styles.loader}>
          <CircularProgress />
        </div>}

        {step === 0 && <div className={styles.step0}>
          <TextField
            id="number"
            label="Challenge ID"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e => setChallengeId(e.target.value)}
            value={challengeId || ''}
            margin="normal"
          />
        </div>}

        {step === 1 && <div className={styles.step0}>
          <TextField
            id="number"
            label="Private key"
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            style={{width: '70%'}}
            onChange={e => setPrivateKey(e.target.value)}
            value={privateKey || ''}
            margin="normal"
          />
        </div>}

        {step === 2 && <div className={styles.step0}>
          <List>
            {submissions.map(sub => (
              <ListItem key={sub.sender} button onClick={() => download(sub)}>
                <ListItemText primary={sub.sender} secondary={moment(sub.timestamp).format('LLL')} />
              </ListItem>
            ))}
          </List>
        </div>}

        <div className={styles.buttons}>
          <Button raised disabled={!this.canPrev()} onClick={goPrevStep}>Prev</Button>
          {this.renderNext()}
        </div>
      </div>
    );
  }
}
