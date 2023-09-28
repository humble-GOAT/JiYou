import { RelaySetting } from "./Types";

export const defaultRelays: RelaySetting[]  = [
    {relayUrl: "wss://nostr.wine", read: false, write: false},
    {relayUrl: "wss://filter.nostr.wine", read: true, write: true},
    {relayUrl: "wss://eden.nostr.land", read: true, write: false},
    {relayUrl: "wss://relay.nostr.band/", read: false, write: false},
    {relayUrl: "wss://nostr-pub.wellorder.net", read: false, write: true},
    {relayUrl: "wss://relay.nostr.band/all", read: false, write: true},
    {relayUrl: "wss://relay.snort.social", read: false, write: true},
    {relayUrl: "wss://nostr.bitcoiner.social", read: false, write: true},
    {relayUrl: "wss://relay.nostrgraph.net", read: false, write: true},
    {relayUrl: "wss://relay.damus.io/", read: false, write: true},
    {relayUrl: "wss://relay.nostr.bg/", read: false, write: true},
    {relayUrl: "wss://nostr.fmt.wiz.biz/", read: false, write: true},
    {relayUrl: "wss://nos.lol/", read: false, write: true},
    {relayUrl: "wss://nostr.mutinywallet.com", read: false, write: true},
    {relayUrl: "wss://relay.nostr.info", read: false, write: true},
    {relayUrl: "wss://nostr.foundrydigital.com", read: false, write: true},
    {relayUrl: "wss://nostr.milou.lol", read: false, write: true},
    {relayUrl: "wss://relay.nostr.bg", read: false, write: true},
    {relayUrl: "wss://relay.noswhere.com", read: false, write: true},
    {relayUrl: "wss://relay.nostrati.com", read: false, write: true},
    {relayUrl: "wss://relay.nostr.com.au", read: false, write: true},
    {relayUrl: "wss://nostr.inosta.cc", read: false, write: true},
    {relayUrl: "wss://atlas.nostr.land", read: false, write: true},
    {relayUrl: "wss://nostr.oxtr.dev", read: false, write: true},
    {relayUrl: "wss://nostr.mom", read: false, write: true},
    {relayUrl: "wss://relay.orangepill.dev", read: false, write: true},
    {relayUrl: "wss://puravida.nostr.land", read: false, write: true},
  ]