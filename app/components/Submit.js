import React, {Component} from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import ErrorDialog from './ErrorDialog';
import styles from './Submit.css';


const steps = ['Pick a challenge', 'Submit', 'Confirm'];

export default class Submit extends Component {

  canPrev = () => {
    const {step} = this.props;
    return step !== 0;
  };

  canNext = () => {
    const {step, challengeId} = this.props;
    switch (step) {
      case 0:
        return !!challengeId;
      default:
        return true;
    }
  };

  render() {
    const {
      step, challengeId, setChallengeId, goNext, isLoading, error, lastError, closeError,
      challengeDetails, selectFile,
    } = this.props;
    return (
      <div>
        <ErrorDialog error={lastError} show={error} closeError={closeError} />
        {isLoading && <div className={styles.loader}>
          <CircularProgress />
        </div>}
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
        {step === 1 && <div className={styles.step1}>
          <div>
            <Typography type="paragraph" gutterBottom>Challenge: <strong>{challengeDetails.title}</strong></Typography>
            <Typography type="paragraph" gutterBottom>Deadline: <strong>{moment(challengeDetails.deadline).fromNow()}</strong></Typography>
            <div className={styles.center}>
              <Button dense raised color="primary" onClick={selectFile}>Select file</Button>
            </div>
          </div>
        </div>}
        <div className={styles.buttons}>
          <Button raised disabled={!this.canPrev()}>Prev</Button>
          <Button raised color="accent" disabled={!this.canNext()} onClick={goNext}>Next</Button>
        </div>
      </div>
    );
  }
}
