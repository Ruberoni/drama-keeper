import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import './LoadingIndicator.css';

export default function LoadingIndicator() {
  return (<div className='loadingIndicator'><CircularProgress /></div>)
}