import React, {Component} from 'react';
import moment from 'moment';
import Stepper, {Step, StepLabel} from 'material-ui/Stepper';
import TextField from 'material-ui/TextField';
import {CircularProgress} from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import ErrorDialog from './ErrorDialog';
import styles from './Submit.css';


const steps = ['Pick a challenge', 'Submit', 'Confirm', 'Success'];

export default class Submit extends Component {

  canPrev = () => {
    const {step} = this.props;
    return step !== 0;
  };

  canNext = () => {
    const {step, challengeId, uploadDetails} = this.props;
    switch (step) {
      case 0:
        return !!challengeId;
      case 1:
        return !!uploadDetails;
      default:
        return true;
    }
  };

  renderNext = () => {
    const {step, confirm, getChallenge, selectFile} = this.props;
    switch (step) {
      case 0:
        return <Button raised color="primary" disabled={!this.canNext()} onClick={getChallenge}>Next</Button>;
      case 1:
        return <Button raised color="primary" onClick={selectFile}>Select file</Button>;
      case 2:
        return <Button raised color="primary" onClick={confirm}>Confirm</Button>;
      default:
        return null;
    }
  };

  render() {
    const {
      step, challengeId, setChallengeId, isLoading, error, lastError, closeError,
      challengeDetails, uploadDetails, goPrevStep,
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
        {step === 1 && <div className={styles.step0}>
          <div>
            <Typography type="paragraph" gutterBottom>Challenge: <strong>{challengeDetails.title}</strong></Typography>
            <Typography type="paragraph" gutterBottom>Deadline: <strong>{moment(challengeDetails.deadline).fromNow()}</strong></Typography>
          </div>
        </div>}
        {step === 2 && <div className={styles.step0}>
          <div>
            <Typography type="paragraph" >Challenge:</Typography>
            <Typography type="paragraph" gutterBottom><strong>{challengeDetails.title}</strong></Typography>
            <Typography type="paragraph" >URL:</Typography>
            <Typography type="paragraph" gutterBottom><a className={styles.url} href={uploadDetails.url}>{uploadDetails.url}</a></Typography>
            <Typography type="paragraph" >HASH:</Typography>
            <Typography type="paragraph" gutterBottom><strong>{uploadDetails.hash}</strong></Typography>
          </div>
        </div>}
        {step === 3 && <div className={styles.step0}>
          <div style={{textAlign: 'center'}}>
            <Typography type="title" >Success</Typography>
            <Typography type="paragraph" >Your submission has been uploaded to blockchain!</Typography>
          </div>
        </div>}
        {step !== 3 && <div className={styles.buttons}>
          <Button raised disabled={!this.canPrev()} onClick={goPrevStep}>Prev</Button>
          {this.renderNext()}
        </div>}
      </div>
    );
  }
}
