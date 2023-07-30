import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Note from './Note';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CreateNote from './CreateNote';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setReplyToNote } from '../redux/slices/noteSlice';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "95%",
  maxWidth: "600px",
  height: "90%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
  overflowY: 'auto' as 'auto', //scrollable
};

interface ReplyToNoteProps {
  fetchEvents: boolean;
  setFetchEvents: React.Dispatch<React.SetStateAction<boolean>>;
  following: string[];
  hashTags: string[];
  updateFollowing: (pubkey: string) => void;
  setHashtags: React.Dispatch<React.SetStateAction<string[]>>;
  imagesOnlyMode?: React.MutableRefObject<boolean>;
}

export default function ReplyToNote({
  fetchEvents,
  setFetchEvents,
  following,
  hashTags,
  updateFollowing, 
  setHashtags,
  imagesOnlyMode
}: ReplyToNoteProps) {
  const note = useSelector((state: RootState) => state.note);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setReplyToNote(null));
  }

  const getNote = () => {

    if (note.replyToNote){
      return (
        <Box>
          <Note 
          event={note.replyToNote}
          fetchEvents={fetchEvents}
          setFetchEvents={setFetchEvents}
          following={following} 
          updateFollowing={updateFollowing} 
          setHashtags={setHashtags} 
          disableReplyIcon={true}
          hashTags={hashTags}
          imagesOnlyMode={imagesOnlyMode}
          />
          <CreateNote />
      </Box>
      )
    } else {
      return <></>
    }
  }

  return (
    <div>
      <Modal
        open={note.replyToNote ? true : false}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <IconButton 
            aria-label="close" 
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
            {getNote()}
        </Box>
      </Modal>
    </div>
  );
}