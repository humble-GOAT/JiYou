import { Avatar, Box, Card, CardActions, CardContent, CardHeader, Collapse, Divider, Grid, IconButton, IconButtonProps, Stack, Typography, styled } from "@mui/material";
import { Event, nip19 } from "nostr-tools";
import { ThemeContext } from '../theme/ThemeContext';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCallback, useContext, useState } from "react";
import { DiceBears } from "../utils/miscUtils";
import moment from "moment";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
  }
  
const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
    })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

type Props = {
    event: Event;
    userNote: Event;
}

export default function UserNotificationNote({event, userNote}: Props) {
    const { themeColors } = useContext(ThemeContext);
    const [expanded, setExpanded] = useState(false);
    const defaultAvatar = DiceBears();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const notes = useSelector((state: RootState) => state.notes);


    const handleExpandClick = useCallback(() => {
        setExpanded((expanded: boolean) => !expanded);
      }, []);
    
    if (isMobile) {
        return (
            <Card sx={{ marginBottom: "10px", color: themeColors.textColor, fontSize: themeColors.textSize}}>
                <Grid container direction="column" > 

                    <Grid item xs={4}>
                        <CardHeader
                            avatar={
                            <Avatar aria-label="profile picture" src={notes.metaData[event.pubkey]?.picture ?? defaultAvatar}>
                            </Avatar>
                            }
                            title={notes.metaData[event.pubkey]?.name ?? event.pubkey.substring(0, 6) + "..."}
                            subheader={notes.metaData[event.pubkey]?.nip05 ?? ""}
                            subheaderTypographyProps={{color: themeColors.textColor}}
                            style={{color: themeColors.textColor}}
                        />
                    </Grid>

                    <Grid item xs={8}>

                        <Grid container direction="row">
                            <Grid item xs={10}>
                                <CardContent>
                                    <Typography fontSize={themeColors.textSize}>
                                        Reacted with {event.content === "+" ? "🤙" : event.content}
                                    </Typography>
                                </CardContent>
                            </Grid>
                        
                            <Grid item xs={2}>
                                <CardActions>
                                    <ExpandMore
                                        expand={expanded}
                                        onClick={handleExpandClick}
                                        aria-expanded={expanded}
                                        sx={{color: themeColors.textColor}}
                                        aria-label="show more"
                                        >
                                        <ExpandMoreIcon />
                                    </ExpandMore>
                                </CardActions>
                            </Grid>
                        </Grid>

                    </Grid>
                    
                </Grid>


                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                    <Typography paragraph display="h6" color={themeColors.textColor}>MetaData:</Typography>
                    <Typography variant="caption" display="block" color={themeColors.textColor}>
                        Event Id: {event.id}
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom color={themeColors.textColor}>
                        PubKey: {nip19.npubEncode(event.pubkey)}
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom color={themeColors.textColor}>
                        PubKey hex: {event.pubkey}
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom color={themeColors.textColor}>
                        Created: {moment.unix(event.created_at).format("LLLL")}
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom color={themeColors.textColor}>
                        UnixTime: {event.created_at}
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom color={themeColors.textColor}>
                        Sig: {event.sig}
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom color={themeColors.textColor}>
                        Tags: <ul >{event.tags.map((tag) => <li key={tag[1]}>{tag[0]}: {tag[1]}, {tag[2]}, {tag[3]}</li>)}</ul>
                    </Typography>
                    </CardContent>
                </Collapse>

                <Card variant="outlined" sx={{ margin: "20px", color: themeColors.textColor, fontSize: themeColors.textSize}}>
                    <Grid container direction="row" spacing={2}>

                        <Grid item xs={1}>
                            <CardContent>
                                <Avatar src={notes.metaData[userNote.pubkey].picture} sx={{width: 24, height: 24}}/>
                            </CardContent>
                        </Grid>

                        <Grid item xs={11}>
                            <CardContent >
                                <Typography variant="body2">
                                    {userNote.content}
                                </Typography>
                            </CardContent>
                        </Grid>
                        
                    </Grid>
                </Card>

            </Card>
        )
    }

    return (
    <Card sx={{ color: themeColors.textColor, fontSize: themeColors.textSize}}>
        <Grid container direction="row" spacing={2} > 

            <Grid item xs={3}>
                <CardHeader
                    avatar={
                    <Avatar aria-label="profile picture" src={notes.metaData[event.pubkey]?.picture ?? defaultAvatar}>
                    </Avatar>
                    }
                    title={notes.metaData[event.pubkey]?.name ?? event.pubkey.substring(0, 6) + "..."}
                    subheader={notes.metaData[event.pubkey]?.nip05 ?? ""}
                    subheaderTypographyProps={{color: themeColors.textColor}}
                    style={{color: themeColors.textColor}}
                />
            </Grid>

            <Grid item xs={1}>
                <CardContent>
                    <Typography fontSize={themeColors.textSize}>
                        Reacted {event.content === "+" ? "🤙" : event.content}
                    </Typography>
                </CardContent>
            </Grid>
            
            <Grid item xs={1}>
                <CardContent>
                    <Avatar src={notes.metaData[event.pubkey]?.picture ?? ""} sx={{width: 24, height: 24}}/>
                </CardContent>
            </Grid>

            <Grid item xs={6}>
                <CardContent >
                    <Typography variant="body2">
                        {userNote.content}
                    </Typography>
                </CardContent>
            </Grid>

            <Grid item xs={1}>
                <CardActions>
                    <Box>
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            sx={{color: themeColors.textColor}}
                            aria-label="show more"
                            >
                            <ExpandMoreIcon />
                        </ExpandMore>

                    </Box>
                </CardActions>
            </Grid>
            
        </Grid>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
            <Typography paragraph display="h6" color={themeColors.textColor}>MetaData:</Typography>
            <Typography variant="caption" display="block" color={themeColors.textColor}>
                Event Id: {event.id}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom color={themeColors.textColor}>
                PubKey: {nip19.npubEncode(event.pubkey)}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom color={themeColors.textColor}>
                PubKey hex: {event.pubkey}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom color={themeColors.textColor}>
                Created: {moment.unix(event.created_at).format("LLLL")}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom color={themeColors.textColor}>
                UnixTime: {event.created_at}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom color={themeColors.textColor}>
                Sig: {event.sig}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom color={themeColors.textColor}>
                Tags: <ul >{event.tags.map((tag) => <li key={tag[1]}>{tag[0]}: {tag[1]}, {tag[2]}, {tag[3]}</li>)}</ul>
            </Typography>
            </CardContent>
        </Collapse>
    </Card>
    )
}