import { Box, Fab, IconButton, Modal, Tab, Tabs, Typography } from '@mui/material';
import { EventTemplate, SimplePool } from 'nostr-tools'
import { useState } from 'react'
import HashtagsFilter from '../components/HashtagsFilter';
import Loading from '../components/Loading';
import Note from '../components/Note';
import "./GlobalFeed.css";
import { useListEvents } from '../hooks/useListEvents';
import { setEventData } from '../utils/eventUtils';
import EditIcon from '@mui/icons-material/Edit';
import CreateNote from '../components/CreateNote';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeContext } from '../theme/ThemeContext';
import { useContext } from 'react';

const createNoteStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "95%",
    maxWidth: "600px",
    height: "70%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    overflowY: 'auto' as 'auto', //scrollable
  };


type GlobalFeedProps = {
    pool: SimplePool | null;
    relays: string[];
    pk: string;
    setEventToSign: React.Dispatch<React.SetStateAction<EventTemplate | null>>;
    setSignEventOpen: React.Dispatch<React.SetStateAction<boolean>>;
    updateFollowing: (pubkey: string) => void;
    following: string[];
    hideExplicitContent: boolean;
    imagesOnlyMode: boolean;
  };
  
  const GlobalFeed: React.FC<GlobalFeedProps> = ({ 
        pool, 
        relays, 
        pk, 
        following, 
        setEventToSign, 
        setSignEventOpen, 
        updateFollowing,
        hideExplicitContent,
        imagesOnlyMode
    }) => {
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [tabIndex, setTabIndex] = useState(0);
    const { 
        events, 
        setEvents, 
        reactions, 
        metaData, 
        eventsFetched, 
        setEventsFetched 
    } = useListEvents({ 
        pool, 
        relays, 
        tabIndex, 
        following, 
        hashtags,
        hideExplicitContent,
        imagesOnlyMode
    });
    const [createNoteOpen, setCreateNoteOpen] = useState(false);
    const { themeColors } = useContext(ThemeContext);


    //global or followers
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setEventsFetched(false);
        setTabIndex(newValue);
        setHashtags([]);
        setEvents([]);
    };

    const handleCreateNoteOpen = () => {
        setCreateNoteOpen(true)
    }

    const handleCreateNoteClose = () => {
        setCreateNoteOpen(false)
    }

    const setPostedNote = () => {
        setCreateNoteOpen(false);
    }


    //render
    return (
        <Box sx={{marginTop: "52px"}}>

            <HashtagsFilter 
                hashtags={hashtags} 
                setHashtags={setHashtags} 
                setEventsFetched={setEventsFetched}/>

            {events.length === 0 && !eventsFetched && <Box sx={{textAlign: "center"}}><Loading /></Box>}
            {events.length === 0 && eventsFetched && <Box sx={{textAlign: "center"}}><Typography color={themeColors.textColor}>No Notes Found</Typography></Box>}
            
            {events.map((event) => setEventData(event, metaData[event.pubkey], reactions[event.id]))
                    .filter(e => imagesOnlyMode ? e.images.length > 0 : true)
                    .map((fullEventData) => {
                        return (
                            <Note 
                                pool={pool} 
                                relays={relays} 
                                eventData={fullEventData} 
                                updateFollowing={updateFollowing} 
                                following={following} 
                                setHashtags={setHashtags} 
                                key={fullEventData.sig + Math.random()} 
                                pk={pk}
                                setSignEventOpen={setSignEventOpen}
                                setEventToSign={setEventToSign}
                                hashTags={hashtags} 
                                imagesOnlyMode={imagesOnlyMode}/>
                        )
                    })
            }

            <Modal
                open={createNoteOpen}
                onClose={handleCreateNoteClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={createNoteStyle}
                >
                <Box>
                    <IconButton 
                        aria-label="close" 
                        onClick={handleCreateNoteClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: themeColors.textColor
                        }}
                        >
                        <CloseIcon />
                    </IconButton>
                    <CreateNote 
                        replyEventData={null} 
                        pool={pool} 
                        relays={relays} 
                        pk={pk}
                        setPostedNote={setPostedNote} 
                        setEventToSign={setEventToSign}
                        setSignEventOpen={setSignEventOpen}
                        />
                </Box>
            </Modal>

            <Box sx={{
                    bgcolor: 'background.paper',
                    position: "fixed",
                    bottom: 50,
                    left: 0,
                    right: 0,
                    color: themeColors.textColor,
                }}
                >
                    
                <Fab 
                    color="secondary" 
                    aria-label="edit" 
                    sx={{ position: "fixed", bottom: 70, right: 10 }} 
                    onClick={handleCreateNoteOpen}>
                    <EditIcon /> 
                </Fab>

                <Tabs 
                    value={tabIndex} 
                    onChange={handleTabChange}
                    textColor='inherit'
                    indicatorColor='secondary'
                    centered>
                    <Tab 
                        label="Global"
                        />
                    <Tab label="Followers"/>
                </Tabs>

            </Box>
    </Box>
    )
}

export default GlobalFeed