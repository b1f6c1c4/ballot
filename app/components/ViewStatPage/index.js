import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  withStyles,
  MobileStepper,
  Button,
} from 'material-ui';
import { KeyboardArrowLeft, KeyboardArrowRight } from 'material-ui-icons';
import { PieChart } from 'react-d3-components';
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
  wrapper: {
    textAlign: 'center',
  },
});

class ViewStatPage extends React.PureComponent {
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

    // const data = {
    //   label: ballot.fields[fieldIndex].prompt,
    //   values: stat.map(({ answer, count }) => ({
    //     x: answer,
    //     y: count,
    //   })),
    // };

    const data = {
      label: 'somethingA',
      values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
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
        <div className={classes.wrapper}>
          <MobileStepper
            variant="dots"
            steps={fieldsCount}
            position="static"
            activeStep={fieldIndex}
            backButton={
              <Button size="small" onClick={this.handleBack} disabled={fieldIndex === 0}>
                <KeyboardArrowLeft />
                Back
              </Button>
            }
            nextButton={
              <Button size="small" onClick={this.handleNext} disabled={fieldIndex === fieldsCount - 1}>
                Next
                <KeyboardArrowRight />
              </Button>
            }
          />
          <PieChart
            data={data}
            width={600}
            height={400}
            viewBox="0 0 600 400"
          />
        </div>
      </div>
    );
  }
}

ViewStatPage.propTypes = {
  classes: PropTypes.object.isRequired,
  onPush: PropTypes.func.isRequired,
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
