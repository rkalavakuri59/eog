import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { actions } from './reducer';
import { IState } from '../../store';

const useStyles = makeStyles({
  chartContainer: {
    margin: '20px',
  },
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
query($input: MeasurementQuery){
    getMeasurements(input: $input){
      metric
      at
      value
      unit
    }
}
`;

export type ChartWrapperProps = {
  currentTime: number;
};

const getMatric = (state: IState) => {
  const { selectedMatrix } = state.matrix;
  return selectedMatrix;
};

const ChartWrapper = (props: ChartWrapperProps) => {
  return (
    <Provider value={client}>
      <Chart currentTime={props.currentTime} />
    </Provider>
  );
};

export default ChartWrapper;

const Chart = (props: ChartWrapperProps) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const selectedMatrix = useSelector(getMatric);

  const input = {
    metricName: selectedMatrix,
    after: props.currentTime - 30 * 60 * 1000,
    before: props.currentTime,
  };
  const [result] = useQuery({
    query,
    variables: {
      input,
    },
  });
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.chartApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  const chartData = data.getMeasurements.map((d: any) => {
    const date = new Date(d.at);
    d.at = `${date.getHours()}:${date.getMinutes()}`;
    return d;
  });

  return (
    <div className={classes.chartContainer}>
      <Paper>
        <ResponsiveContainer height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type="monotone" dataKey="value" stroke="#000" dot={false} />
            <Tooltip />
            <XAxis dataKey="at" interval="preserveStartEnd" tickCount={6} />
            <YAxis />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </div>
  );
};
