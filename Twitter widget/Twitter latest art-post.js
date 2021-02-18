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
const OPTIONS = ['Small', 'Medium', 'Large', 'Cancel'];
const REFRESH_INTERVAL = 5;
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
  //widget.url = twit.img;
  widget.refreshAfterDate = new Date(refreshDate);
  widget.setPadding(12,12,12,12);
  widget.backgroundImage = img;
  widget.addSpacer();

  let infos = widget.addStack();
  infos.addSpacer();
  
    //HANDLE
    let handle = infos.addText('@'+username);
    handle.textColor = Color.white();
    handle.font = Font.regularRoundedSystemFont(12);
    handle.shadowColor = Color.black();
    handle.shadowRadius = 1;
    handle.url = 'https://twitter.com/'+username+(twit.id!==null?'/status/'+twit.id:'');

  return widget
}

function getRandom(array,istwit) {
  if(istwit){
    let media = array[Math.floor(Math.random() * array.length)];
    if(media.type!=='photo') getRandom(array,true);
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

    if(twits.includes === undefined ) {
      username = getRandom(USERS,false);
	    return await getMediaFrom(username,PARAMETERS);
    }

    let media = getRandom(twits.includes.media,true);
    let twitID = getTwitID(twits.data,media.media_key);
    
    return {"img":media.url,"id":twitID};
}



/*------------
  GET TWIT IMG
-------------*/
const username = getRandom(USERS,false);
const twit = await getMediaFrom(username,PARAMETERS);


/*------------
 LAUNCH WIDGET
-------------*/
let fm = FileManager.iCloud();
if (config.runsInWidget){
  await fm.writeString(fm.documentsDirectory()+'/twitter.img.txt',twit.img);
  let widget = await createWidget(twit);
  Script.setWidget(widget);
} else {
  //let res = await presentAlert('Preview Widget', OPTIONS);
  //if (res===OPTIONS.length-1) return;
  // let widget = await createWidget(twit);
  // await widget[`present${OPTIONS[res]}`]();
  
  let url = await fm.readString(fm.documentsDirectory()+'/twitter.img.txt');
  var img = await getImg(url);
  await Photos.save(img);
  //Notification
  let n = new Notification();
  n.title = 'Twitget';
  n.subtitle = "";
  n.body = 'Image from '+username+' saved';
  n.schedule();
}

Script.complete();
