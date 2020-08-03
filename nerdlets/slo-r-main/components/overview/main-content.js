import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spinner, PlatformStateContext, StackItem } from 'nr1';
import TableSummary from './table-summary';

export default class MainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aggregatedData: [],
      isProcessing: true
    };
  }

  componentDidMount = () => {
    this.aggregateData();
  };

  componentDidUpdate = prevProps => {
    if (prevProps.slos !== this.props.slos) {
      this.aggregateData();
    }
  };

  aggregateData = () => {
    const { slos } = this.props;
    this.setState({ isProcessing: true });
    try {
      const aggregatedData = [];
      slos.forEach(slo => {
        const indicatorIndex = aggregatedData.findIndex(
          item => item.indicator === slo.document.indicator
        );
        if (indicatorIndex < 0) {
          aggregatedData.push({
            indicator: slo.document.indicator,
            slos: [slo]
          });
        } else {
          aggregatedData[indicatorIndex].slos.push(slo);
        }
      });

      this.setState({ aggregatedData });
    } finally {
      this.setState({ isProcessing: false });
    }
  };

  render() {
    const { isProcessing, aggregatedData } = this.state;

    return (
      <StackItem>
        {isProcessing && <Spinner />}
        <PlatformStateContext.Consumer>
          {platformUrlState =>
            aggregatedData.map(data => (
              <TableSummary
                key={data.indicator}
                indicator={data.indicator}
                slos={data.slos}
                timeRange={platformUrlState.timeRange}
              />
            ))
          }
        </PlatformStateContext.Consumer>
      </StackItem>
    );
  }
}

MainContent.propTypes = {
  slos: PropTypes.array.isRequired
};
