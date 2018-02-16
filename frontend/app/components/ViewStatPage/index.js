import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
  Typography,
  MobileStepper,
  Button,
} from 'material-ui';
import { KeyboardArrowLeft, KeyboardArrowRight } from 'material-ui-icons';
import { PieChart } from 'react-d3-components';
import Loading from 'components/Loading';
import BallotMeta from 'components/BallotMeta';
import LoadingButton from 'components/LoadingButton';
import RefreshButton from 'components/RefreshButton';
import ResultIndicator from 'components/ResultIndicator';

import messages from './messages';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing.unit,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  wrapper: {
    textAlign: 'center',
  },
});

class ViewStatPage extends React.PureComponent {
  handlePrev = () => this.props.onChangeFieldAction(this.props.fieldIndex - 1);

  handleNext = () => this.props.onChangeFieldAction(this.props.fieldIndex + 1);

  render() {
    // eslint-disable-next-line no-unused-vars
    const {
      classes,
      bId,
      isLoading,
      isStatsLoading,
      ballot,
      stat,
      fieldIndex,
    } = this.props;

    const fieldsCount = ballot && ballot.fields.length;

    const data = {
      label: ballot.fields[fieldIndex].prompt,
      values: stat.map(({ answer, count }) => ({
        x: answer,
        y: count,
      })),
    };

    return (
      <div className={classes.container}>
        <BallotMeta
          {...{
            onPush: this.props.onPush,
            bId,
            ballot,
            isLoading,
          }}
        />
        <div className={classes.actions}>
          <LoadingButton {...{ isLoading }}>
            <RefreshButton
              isLoading={isLoading}
              onClick={this.props.onRefresh}
            />
          </LoadingButton>
        </div>
        <ResultIndicator error={this.props.error} />
        {!isLoading && isStatsLoading && (
          <Loading />
        )}
        {!isLoading && !isStatsLoading && ballot && (
          <div className={classes.wrapper}>
            <MobileStepper
              variant="dots"
              steps={fieldsCount}
              position="static"
              activeStep={fieldIndex}
              backButton={
                <Button size="small" onClick={this.handlePrev} disabled={fieldIndex === 0}>
                  <KeyboardArrowLeft />
                  <FormattedMessage {...messages.prev} />
                </Button>
              }
              nextButton={
                <Button size="small" onClick={this.handleNext} disabled={fieldIndex === fieldsCount - 1}>
                  <FormattedMessage {...messages.next} />
                  <KeyboardArrowRight />
                </Button>
              }
            />
            <Typography variant="title">
              {ballot.fields[fieldIndex].prompt}
            </Typography>
            <PieChart
              data={data}
              width={600}
              height={400}
              viewBox="0 0 600 400"
            />
          </div>
        )}
      </div>
    );
  }
}

ViewStatPage.propTypes = {
  onPush: PropTypes.func.isRequired,
  bId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isStatsLoading: PropTypes.bool.isRequired,
  ballot: PropTypes.object,
  error: PropTypes.object,
  fieldIndex: PropTypes.number.isRequired,
  stat: PropTypes.array,
  onRefresh: PropTypes.func.isRequired,
  onChangeFieldAction: PropTypes.func.isRequired,
};

export const styledViewStatPage = withStyles(styles)(ViewStatPage);

export default styledViewStatPage;