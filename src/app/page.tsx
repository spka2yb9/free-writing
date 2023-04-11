'use client';

import { useState, useEffect } from 'react';

import { TextField, Button, Container, TextareaAutosize } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

import SaveIcon from '@mui/icons-material/Save';
import TimerIcon from '@mui/icons-material/Timer';

import { db } from '@/db/db';
import NotesList from '@/components/NotesList';
import { styled } from '@mui/material/styles';

const StyledDiv = styled('div')(({ theme }) => ({}));

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '70%',
  marginRight: theme.spacing(2),
}));

const StyledTimerButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  minHeight: '500px',
  maxHeight: '700px',
  resize: 'none',
  overflowY: 'auto',
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.grey[400]}`,
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('sm')]: {
    width: '98%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

const Home: React.FC = () => {
  const [title, setTitle] = useState('');
  const [thought, setThought] = useState('');
  const [reason, setReason] = useState('');
  const [timer, setTimer] = useState(2 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isSaveButtonActive, setIsSaveButtonActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      setIsActive(false);
      setIsSaveButtonActive(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timer]);

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeThought = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setThought(e.target.value);
  };

  const handleChangeReason = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
  };

  const handleStartTimer = () => {
    setIsActive(true);
  };

  const handleSave = async () => {
    await db.notes.add({ title, thought, reason });

    setTitle('');
    setThought('');
    setReason('');
    setTimer(2 * 60);
    setIsSaveButtonActive(false);
  };

  return (
    <StyledContainer>
      <Grid2 container spacing={3}>
        <Grid2 sm={12} md={8}>
          <StyledTextField
            id='time'
            type='text'
            placeholder='テーマ'
            value={title}
            onChange={handleChangeTitle}
            disabled={isActive}
          />
          <StyledTimerButton
            startIcon={<TimerIcon />}
            color='primary'
            aria-label='start timer'
            onClick={handleStartTimer}
            disabled={isActive}
          >
            {timer} 秒
          </StyledTimerButton>
          <br />
          <StyledDiv>
            思考
            <StyledTextarea color='primary' value={thought} onChange={handleChangeThought} disabled={!isActive} />
          </StyledDiv>
          <StyledDiv>
            理由
            <StyledTextarea color='primary' value={reason} onChange={handleChangeReason} disabled={!isActive} />
          </StyledDiv>
          <br />
          <Button startIcon={<SaveIcon />} color='primary' onClick={handleSave} disabled={!isSaveButtonActive}>
            保存する
          </Button>
        </Grid2>
        <Grid2 sm={12} md={4}>
          <NotesList db={db} />
        </Grid2>
      </Grid2>
    </StyledContainer>
  );
};

export default Home;
