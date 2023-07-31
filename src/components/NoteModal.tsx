import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Event } from 'nostr-tools';
import Note from './Note';
import { Stack } from '@mui/material';
import SouthIcon from '@mui/icons-material/South';
import { useContext } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { ThemeContext } from '../theme/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setNoteModalEvent } from '../redux/slices/noteSlice';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  width: "95%",
  maxWidth: "1000px",
  boxShadow: 24,
  overflowY: 'auto' as 'auto', //scrollable
};

interface NoteModalProps {
  fetchEvents: boolean;
  setFetchEvents: React.Dispatch<React.SetStateAction<boolean>>;
  updateFollowing: (pubkey: string) => void;
  imagesOnlyMode?: React.MutableRefObject<boolean>;
}

export default function NoteModal({
  fetchEvents,
  setFetchEvents,
  updateFollowing,
  imagesOnlyMode
}: NoteModalProps) {
  const note = useSelector((state: RootState) => state.note);  
  const dispatch = useDispatch();
  const { themeColors } = useContext(ThemeContext);
  const events = useSelector((state: RootState) => state.events);
  const idsFromTags = note.noteModalEvent?.tags.filter((t) => t[0] === "e" && t[1])?.map((t) => t[1]);
  const rootNotes = idsFromTags?.length ?? 0 > 0 ? events.rootNotes.filter((e) => idsFromTags!.includes(e.id)) : [];

  const handleClose = () => {
    dispatch(setNoteModalEvent(null));
  }

  const getThread = () => {
    if (note.noteModalEvent === null) return <></>;
    return (
      <Box>
        <Box>
          {(rootNotes?.length ?? 0) > 0 && 
            rootNotes.map((rootEvent: Event) => {
              return (
                <Box 
                  key={rootEvent.sig + Math.random()}                                        
                  sx={{ 
                    marginBottom: "10px", 
                    justifyContent: "center", 
                    flexDirection: "row", 
                    alignItems: "center" 
                  }}
                >
                  <Note
                      key={rootEvent.sig + Math.random()}
                      event={rootEvent}
                      fetchEvents={fetchEvents}
                      setFetchEvents={setFetchEvents}
                      updateFollowing={updateFollowing}
                      disableReplyIcon={false}
                      imagesOnlyMode={imagesOnlyMode}
                      isInModal={true}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'center'}}>
                    <SouthIcon sx={{color: themeColors.textColor}}/>
                  </Box>
                </Box>
              )
          })}
        </Box>

        <Box>
            <Note 
              event={note.noteModalEvent}
              fetchEvents={fetchEvents}
              setFetchEvents={setFetchEvents}
              updateFollowing={updateFollowing}
              disableReplyIcon={false}
              key={note.noteModalEvent.sig + "modal"}
              imagesOnlyMode={imagesOnlyMode}
              isInModal={true}
            />
        </Box>

        <Box>
          {(events.replyNotes[note.noteModalEvent.id]?.length ?? 0) > 0 && (
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <SouthIcon />
                </Box>
                {events.replyNotes[note.noteModalEvent.id].map((replyEvent) => {
                  return (
                    <Note 
                      event={replyEvent}
                      fetchEvents={fetchEvents}
                      setFetchEvents={setFetchEvents}
                      updateFollowing={updateFollowing}
                      key={replyEvent.sig + Math.random()}
                      disableReplyIcon={false}
                      imagesOnlyMode={imagesOnlyMode}
                      isInModal={true}
                    />
                    );
                  })}
            </Box>
          )}
        </Box>
      </Box>
    )
  }

  return (
    <Modal
        open={note.noteModalEvent !== null}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
    <Box sx={{...style, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Box sx={{position: 'absolute', top: 8, right: 1}}>
            <ClearIcon            
              sx={{color: themeColors.textColor, cursor: 'pointer'}}
              onClick={handleClose} />
        </Box>

        <Box sx={{overflowY: 'auto', width: '98%', maxHeight: "80vh"}}>
            <Stack direction="row" spacing={0} flexDirection="column">

                {getThread()}

              </Stack>
          </Box>      
      </Box>
    </Modal>
  );
} 
