# Subscription

## Ballot Status Change

### Exchange

`topic_subscription`

### Routing Key

`status.{owner}.{bId}`

### Body

`inviting`

## Voter Registered

### Exchange

`topic_subscription`

### Routing Key

`vreg.{bId}.{iCode}`

### Body

`{"comment":"{comment}","publicKey":"{publicKey}"}`

