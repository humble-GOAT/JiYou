import { useContext, useEffect, useState } from 'react';
import { Event, EventTemplate } from 'nostr-tools';
import { signEventWithNostr, signEventWithStoredSk } from '../nostr/FeedEvents';
import { RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { PoolContext } from '../context/PoolContext';
import { setCurrentProfileFollowers, setCurrentProfileFollowing, setFollowing } from '../redux/slices/nostrSlice';

type UseFollowingProps = {};

export const useFollowing = ({}: UseFollowingProps) => {
  const pool = useContext(PoolContext);
  const nostr = useSelector((state: RootState) => state.nostr);
  const keys = useSelector((state: RootState) => state.keys);
  const note = useSelector((state: RootState) => state.note);
  const [followers, setFollowers] = useState<string[]>([]);
  const allRelayUrls = nostr.relays.map((r) => r.relayUrl);
  const writableRelayUrls = nostr.relays.filter((r) => r.write).map((r) => r.relayUrl);
  const dispatch = useDispatch();


  const getFollowing = async (pubkey: string) => {
    if(pubkey === ""){
      return [];
    }

    if (!pool) return [];
    let followingPks: string[] = [];
    const userFollowingEvent: Event[] = await pool.list(allRelayUrls, [{kinds: [3], authors: [pubkey], limit: 1 }])
    
    if (!userFollowingEvent[0] || !userFollowingEvent[0].tags) return [];

    const followingArray: string[][] = userFollowingEvent[0].tags.filter((tag) => tag[0] === 'p');
    for (let i = 0; i < followingArray.length; i++) {
      if (followingArray[i][1]) {
        followingPks.push(followingArray[i][1]);
      }
    }

    if (note.profileEventToShow !== null) {
      dispatch(setCurrentProfileFollowing(followingPks));
    } else{
      dispatch(setFollowing(followingPks));
    }

    return followingPks;
  };

  const getFollowers = async (pubkey: string) => {
    if(!pool || pubkey === ""){
      return;
    }

    const followerEvents = await pool.list(allRelayUrls, [{kinds: [3], ["#p"]: [pubkey] }])

    if (!followerEvents || followerEvents.length === 0) return;

    const followerPks: string[] = followerEvents.map((event) => event.pubkey);

    if(note.profileEventToShow !== null){
      dispatch(setCurrentProfileFollowers(followerPks));
      return;
    }
    
    setFollowers(followerPks);
  }
  
  useEffect(() => {
    getFollowers(keys.publicKey.decoded);
    getFollowing(keys.publicKey.decoded);
  }, [pool, nostr.relays, keys.publicKey.decoded]);

  useEffect(() => {
    if(note.profileEventToShow !== null){
      getFollowing(note.profileEventToShow.pubkey);
      getFollowers(note.profileEventToShow.pubkey);
      return;
    }

  }), [note.profileEventToShow];
  
  const updateFollowing = async (followPubkey: string) => {
    if (!pool) return;

    try {
      const currentFollowing = await getFollowing(keys.publicKey.decoded);
      const isUnfollowing: boolean = !!currentFollowing.find((follower) => follower === followPubkey);
                
      const newTags: string[][] = isUnfollowing ? [] : [["p", followPubkey]];
      currentFollowing.forEach((follow) => {
        if (follow === followPubkey && isUnfollowing) {
          return
        } else {
          newTags.push(["p", follow])
        }
      })
      
      const _baseEvent = {
        kind: 3,
        content: "",
        created_at: Math.floor(Date.now() / 1000),
        tags: newTags,
      } as EventTemplate
      
      //sign with Nostr Extension
      if (window.nostr && keys.privateKey.decoded === "") {
        const signed = await signEventWithNostr(pool, writableRelayUrls, _baseEvent, dispatch);
        if (signed) {
          setFollowing(newTags.filter((tag) => tag[0] === "p").map((tag) => tag[1]))
          return
        }
      }

      //sign with sk
      const signedWithSk = await signEventWithStoredSk(pool, keys, writableRelayUrls, _baseEvent, dispatch); 
      if (signedWithSk) {      
        setFollowing(newTags.filter((tag) => tag[0] === "p").map((tag) => tag[1]))
      }

    } catch (error) {
        console.error(error);
    }
}

  return { updateFollowing, followers };
};
