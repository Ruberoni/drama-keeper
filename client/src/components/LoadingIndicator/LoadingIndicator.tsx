import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import './LoadingIndicator.css';

export default function LoadingIndicator() {
  return (<div className='loadingIndicator'><CircularProgress /></div>)
}