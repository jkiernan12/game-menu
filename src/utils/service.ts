import { bgg } from '../utils/constants';
import { XMLParser } from 'fast-xml-parser';

interface Game {
  description: string;
  name: {
    type: string;
    value: string;
  }[];
  image: string;
  thumbnail: string;
  minplayers: {value: string};
  maxplayers: {value: string};
  minplaytime: {value: string};
  maxplaytime: {value: string};

}

export const getGames = async (username: string) : Promise<Game[]> => {
  const parser = new XMLParser({ignoreAttributes: false});
  const res = await fetch(bgg + `collection?username=${username}&brief=0`).then(response => response.text());
  // console.log(res);
  const gameIds = parser.parse(res).items.item.map(game => game['@_objectid']);
  const gameIdString = gameIds.join(',');
  const gamesXml = await fetch(bgg + 'thing?id=' + gameIdString).then(response => response.text());
  const gamesParser = new XMLParser({attributeNamePrefix: '', ignoreAttributes: false, isArray: (name) => name === 'name'});
  const games = gamesParser.parse(gamesXml).items.item;

  console.log('df', games[0].name)
  return games;
}