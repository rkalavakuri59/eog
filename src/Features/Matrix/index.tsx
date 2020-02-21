import React, { useEffect } from 'react';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles({
  matrixContainer: {
    margin: '20px',
  },
  chipClass: {
    backgroundColor: '#000000',
    color: '#fff',
    marginRight: '4px',
  },
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
{
    getMetrics
}
`;

export default () => {
  return (
    <Provider value={client}>
      <Matrix />
    </Provider>
  );
};

const Matrix = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [result] = useQuery({
    query,
  });
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.matrixApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    dispatch(actions.matrixDataRecevied({ matrix: getMetrics }));
    dispatch(actions.matrixUpdateSelectedValue({ selectedMatrix: [getMetrics[0]] }));
  }, [dispatch, data, error]);

  const handleChange = (e: any) => {
    dispatch(actions.matrixUpdateSelectedValue({ selectedMatrix: e.target.value }));
  };

  if (fetching) return <LinearProgress />;
  return (
    <div className={classes.matrixContainer}>
      <Select
        multiple
        defaultValue={[data.getMetrics[0]]}
        onChange={handleChange}
        renderValue={(selected: any) => (
          <div>
            {selected.map((value: any) => (
              <Chip className={classes.chipClass} key={value} label={value} />
            ))}
          </div>
        )}
      >
        {data.getMetrics.map((d: string, i: number) => (
          <MenuItem key={i} value={d}>
            {d}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
