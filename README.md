# inker
Discord bot for Disney/Ravenburger's Lorcana TCG

# Usage
inker has two modes of use: in-line and slash commands.

## In-line
You can summon a card by using the "[[term]]" notation, where "term" is the character or descriptor of a card.

For example, [[Mickey Mouse]] will summon a Mickey Mouse card, whereas [[Brave Little Tailor]] will summon specifically the Brave Little Tailor Mickey Mouse card.

### Arguments

! - Grabs only the image for the card. Usage: [[!term]]

## Slash command
You can also use /card command. This provides a list of matching cards.

For example, /card mickey will give you Brave Little Tailor and Sorcerer Mickey to choose from.

# Installation

The output created by inker uses specific emojis in place of generic symbols. These need to be installed onto the server using the custom emoji settings.

# Testing

## Deploy Slash Commands
> node deploy-command.js

## Run bot
> node .
