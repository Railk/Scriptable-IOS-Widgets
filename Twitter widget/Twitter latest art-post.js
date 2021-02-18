// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: comment;
/*------------
     CONST
-------------*/
const BEARER_TOKEN = "YOUR BEARER TOKEN HERE";
const HOST =  'api.twitter.com';
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization':'Bearer '+BEARER_TOKEN
};
const REFRESH_INTERVAL = 5;
const MAXLOOP = 10;
const PARAMETERS = 'tweet.fields=attachments,created_at'+
                  '&exclude=retweets,replies'+
                  '&expansions=attachments.media_keys'+
                  '&media.fields=url';
                  

const USERS = [
  '666pigeon',
  'inukainuzoku',
  'daisukerichard',
  'Criisalys',
  'pacota22ma'
];

/*------------
     UTILS
-------------*/
async function presentAlert(prompt,items,asSheet) 
{
  let alert = new Alert();
  alert.message = prompt;
  
  for (const item of items) {
    alert.addAction(item);
  }
  
  let res = asSheet ? 
    await alert.presentSheet() : 
    await alert.presentAlert();
  return res;
}

async function createWidget(twit){
  
  let refreshDate = Date.now() + 1000*60*REFRESH_INTERVAL;
  let img = await getImg(twit.img);

  const widget = new ListWidget();
  widget.refreshAfterDate = new Date(refreshDate);
  widget.setPadding(12,12,12,12);
  widget.backgroundImage = img;
  widget.addSpacer();

  let infos = widget.addStack();
  infos.addSpacer();
  
    //HANDLE
    let handle = infos.addText('@'+USERNAME);
    handle.textColor = Color.white();
    handle.font = Font.regularRoundedSystemFont(12);
    handle.shadowColor = Color.black();
    handle.shadowRadius = 1;
    handle.url = 'https://twitter.com/'+USERNAME+(twit.id!==null?'/status/'+twit.id:'');

  return widget
}

function createWidgetError(){
  let refreshDate = Date.now() + 1000*60*REFRESH_INTERVAL;

  const widget = new ListWidget();
  widget.refreshAfterDate = new Date(refreshDate);
  widget.setPadding(12,12,12,12);
  widget.backgroundColor = new Color("1DA1F2");

  let infos = widget.addStack();
  let handle = infos.addText('Nothing to see 😞');
  handle.textColor = Color.white();
  handle.font = Font.regularRoundedSystemFont(18);

  return widget;
}

function getRandom(array,istwit) {
  if(istwit){
    let media = array[Math.floor(Math.random() * array.length)];
    if(media.type!=='photo') return getRandom(array,true);
    return media;
  }
  return array[Math.floor(Math.random() * array.length)];
}

async function getImg(url) {
  const req = new Request(url);
  return await req.loadImage();
}

function getTwitID(data,media){
  for (let i = 0; i < data.length; i++) {
    const twit = data[i];
    if(twit.attachments && twit.attachments.media_keys.includes(media)) return twit.id;
  }

  return null;
}


/*------------
   API CALLS
-------------*/

async function getUserID(name){
    const req = new Request('https://'+HOST+'/2/users/by?usernames='+name)
    req.headers = HEADERS;
     
    var res = await req.loadJSON();
    return res.data[0].id;
}

async function getTimeline(id,parameters){
    const req = new Request('https://'+HOST+'/2/users/'+id+'/tweets?'+parameters)
    req.headers = HEADERS;
    
    var res = await req.loadJSON();
    return res;
}

async function getMediaFrom(name,parameters){
    let id = await getUserID(name);
    let twits = await getTimeline(id,parameters);

    if(twits.includes === undefined || twits.errors !== undefined) {
	    USERNAME = getRandom(USERS,false);
      LOOP+=1;
      if(LOOP===MAXLOOP) {
        LOOP=0;
        return null;
      } else {
        return await getMediaFrom(USERNAME,PARAMETERS);
      }
    }

    let media = getRandom(twits.includes.media,true);
    let twitID = getTwitID(twits.data,media.media_key);

    return {"img":media.url,"id":twitID};
}



/*------------
  GET TWIT IMG
-------------*/
let LOOP = 0;
let USERNAME = getRandom(USERS,false);
let TWIT = await getMediaFrom(USERNAME,PARAMETERS);

/*------------
 LAUNCH WIDGET
-------------*/
let fm = FileManager.iCloud();
if (config.runsInWidget){
  await fm.writeString(fm.documentsDirectory()+'/twitter.img.txt',TWIT.img);
  let widget = (TWIT!==null) ? await createWidget(TWIT) : createWidgetError();
  Script.setWidget(widget);
} else {
  // DEBUG
  //let widget = (TWIT!==null) ? await createWidget(TWIT) : createWidgetError();
  //await widget.presentLarge();

  // SAVE 
  let url = await fm.readString(fm.documentsDirectory()+'/twitter.img.txt');
  var img = await getImg(url);
  await Photos.save(img);
  // NOTIFICATION
  let n = new Notification();
  n.title = 'Twitget';
  n.subtitle = "";
  n.body = 'Image from '+USERNAME+' saved';
  n.schedule();
}

Script.complete();
