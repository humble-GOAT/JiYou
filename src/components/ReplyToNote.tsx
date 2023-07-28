import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Event, SimplePool } from 'nostr-tools';
import { MetaData, RelaySetting } from '../nostr/Types';
import Note from './Note';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CreateNote from './CreateNote';

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
  event: Event;
  open: boolean;
  setReplyToNoteOpen: (open: boolean) => void;
  pool: SimplePool | null;
  relays: RelaySetting[];
  following: string[];
  hashTags: string[];
  updateFollowing: (pubkey: string) => void;
  setHashtags: React.Dispatch<React.SetStateAction<string[]>>;
  imagesOnlyMode?: React.MutableRefObject<boolean>;
}

export default function ReplyToNote({
  fetchEvents,
  setFetchEvents,
  event,
  open, 
  setReplyToNoteOpen, 
  pool, 
  relays, 
  following,
  hashTags,
  updateFollowing, 
  setHashtags,
  imagesOnlyMode
}: ReplyToNoteProps) {
  const handleClose = () => setReplyToNoteOpen(false);

  const setPostedNote = () => {
    handleClose();
  }

  return (
    <div>
      <Modal
        open={open}
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
            <Note 
              pool={pool} 
              relays={relays}
              event={event}
              fetchEvents={fetchEvents}
              setFetchEvents={setFetchEvents}
              following={following} 
              updateFollowing={updateFollowing} 
              setHashtags={setHashtags} 
              disableReplyIcon={true}
              hashTags={hashTags}
              imagesOnlyMode={imagesOnlyMode}
              />
            <CreateNote 
              pool={pool} 
              relays={relays} 
              replyEvent={event} 
              setPostedNote={setPostedNote} 
              />
        </Box>
      </Modal>
    </div>
  );
}