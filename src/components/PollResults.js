import React from 'react';
import Chart from 'react-google-charts';

class PollResults extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        let pollChartData = this.props.poll.choices.map(choice => {
            return [choice.text, choice.votes];
        });
        pollChartData.unshift(['Choice', 'Votes']);
        let pollChartOptions = { title: 'Results' };

        return (
            <div>
                <Chart
                    width={300}
                    height={300}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={pollChartData}
                    options={pollChartOptions}
                />
            </div>
        )
    }
}

export default PollResults;
