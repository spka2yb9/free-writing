import React, { useState } from 'react';
import { List, ListItem, ListItemText, Collapse, Box } from '@mui/material';
import Dexie from 'dexie';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useLiveQuery } from 'dexie-react-hooks';
import { Note } from '@/types/note.type';

interface NotesListProps {
  db: Dexie;
}

const NotesList: React.FC<NotesListProps> = ({ db }) => {
  const notes = useLiveQuery(() => db.table<Note>('notes').toArray(), []);
  const [openNoteId, setOpenNoteId] = useState<number | null>(null);

  const handleClick = (id: number) => {
    setOpenNoteId(openNoteId === id ? null : id);
  };

  if (!notes) {
    return null;
  }

  return (
    <List>
      {notes.map((note) => (
        <React.Fragment key={note.id}>
          <ListItem onClick={() => handleClick(note.id!)}>
            <ListItemText primary={note.title} />
          </ListItem>
          <Collapse in={openNoteId === note.id} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              <ListItem>
                <Box sx={{ flexDirection: 'column' }}>
                  思考
                  <ListItemText secondary={note.thought} />
                  理由
                  <ListItemText secondary={note.reason} />
                </Box>
              </ListItem>
            </List>
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
};

export default NotesList;
